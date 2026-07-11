use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::{instruction::Instruction, system_program},
        AccountDeserialize, InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

#[test]
fn test_quantum_invest() {
    let program_id = quantum_invest::id();
    let payer = Keypair::new();
    
    // Find PDA addresses
    let (user_account_pda, _) = Pubkey::find_program_address(
        &[quantum_invest::constants::USER_SEED, payer.pubkey().as_ref()],
        &program_id,
    );
    
    let (subscription_vault_pda, _) = Pubkey::find_program_address(
        &[quantum_invest::constants::VAULT_SEED, payer.pubkey().as_ref()],
        &program_id,
    );

    let mut svm = LiteSVM::new();
    let bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/quantum_invest.so"
    ));
    svm.add_program(program_id, bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 20_000_000_000).unwrap(); // 20 SOL

    // ─── 1. Test InitializeUser ───
    let init_user_ix = Instruction::new_with_bytes(
        program_id,
        &quantum_invest::instruction::InitializeUser {}.data(),
        quantum_invest::accounts::InitializeUser {
            wallet: payer.pubkey(),
            user_account: user_account_pda,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[init_user_ix], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[&payer]).unwrap();
    svm.send_transaction(tx).unwrap();

    let user_account = svm.get_account(&user_account_pda).unwrap();
    let mut data: &[u8] = &user_account.data;
    let user_state = quantum_invest::state::UserAccount::try_deserialize(&mut data).unwrap();
    assert_eq!(user_state.wallet, payer.pubkey());
    assert_eq!(user_state.plan, quantum_invest::constants::PLAN_STARTER);
    assert_eq!(user_state.claimable_lamports, 0);

    // ─── 2. Test Subscribe (Reader tier: 1.5 SOL) ───
    let subscribe_ix = Instruction::new_with_bytes(
        program_id,
        &quantum_invest::instruction::Subscribe {
            plan: quantum_invest::constants::PLAN_READER,
        }
        .data(),
        quantum_invest::accounts::Subscribe {
            wallet: payer.pubkey(),
            user_account: user_account_pda,
            subscription_vault: subscription_vault_pda,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[subscribe_ix], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[&payer]).unwrap();
    svm.send_transaction(tx).unwrap();

    // Verify UserAccount update
    let user_account = svm.get_account(&user_account_pda).unwrap();
    let mut data: &[u8] = &user_account.data;
    let user_state = quantum_invest::state::UserAccount::try_deserialize(&mut data).unwrap();
    assert_eq!(user_state.plan, quantum_invest::constants::PLAN_READER);

    // Verify SubscriptionVault state
    let vault_account = svm.get_account(&subscription_vault_pda).unwrap();
    let mut data: &[u8] = &vault_account.data;
    let vault_state = quantum_invest::state::SubscriptionVault::try_deserialize(&mut data).unwrap();
    assert_eq!(vault_state.owner, payer.pubkey());
    assert_eq!(vault_state.plan, quantum_invest::constants::PLAN_READER);
    assert_eq!(vault_state.amount_lamports, quantum_invest::constants::PRICE_READER_LAMPORTS);

    // Verify vault balance holds the funds
    let vault_balance = svm.get_balance(&subscription_vault_pda).unwrap();
    assert!(vault_balance >= quantum_invest::constants::PRICE_READER_LAMPORTS);

    // ─── 3. Test ClaimReward ───
    // Let's modify the user account to have some claimable lamports and fund it so it can pay them out
    let mut user_account = svm.get_account(&user_account_pda).unwrap();
    let mut data: &[u8] = &user_account.data;
    let mut user_state = quantum_invest::state::UserAccount::try_deserialize(&mut data).unwrap();
    user_state.claimable_lamports = 500_000_000; // 0.5 SOL
    
    // Serialize back
    let mut new_data = Vec::new();
    anchor_lang::AccountSerialize::try_serialize(&user_state, &mut new_data).unwrap();
    user_account.data = new_data;
    
    // Fund the PDA so it has lamports to pay out!
    user_account.lamports += 500_000_000;
    
    svm.set_account(user_account_pda, user_account).unwrap();

    // Now test ClaimReward
    let claim_reward_ix = Instruction::new_with_bytes(
        program_id,
        &quantum_invest::instruction::ClaimReward {}.data(),
        quantum_invest::accounts::ClaimReward {
            wallet: payer.pubkey(),
            user_account: user_account_pda,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    );

    let wallet_balance_before = svm.get_balance(&payer.pubkey()).unwrap();

    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[claim_reward_ix], Some(&payer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[&payer]).unwrap();
    svm.send_transaction(tx).unwrap();

    // Verify wallet received the 0.5 SOL (minus small tx fee)
    let wallet_balance_after = svm.get_balance(&payer.pubkey()).unwrap();
    assert!(wallet_balance_after > wallet_balance_before);
    
    // Verify UserAccount was updated
    let user_account = svm.get_account(&user_account_pda).unwrap();
    let mut data: &[u8] = &user_account.data;
    let user_state = quantum_invest::state::UserAccount::try_deserialize(&mut data).unwrap();
    assert_eq!(user_state.claimable_lamports, 0);
    assert_eq!(user_state.total_earned_lamports, 500_000_000);
}
