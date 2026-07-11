use anchor_lang::prelude::*;

#[error_code]
pub enum QuantumError {
    #[msg("Invalid plan ID. Must be 0 (Starter), 1 (Reader), 2 (Scholar) or 3 (Sage).")]
    InvalidPlan,

    #[msg("Subscription has expired. Please renew your plan.")]
    SubscriptionExpired,

    #[msg("Subscription is still active. Cannot re-subscribe until it expires.")]
    SubscriptionStillActive,

    #[msg("Insufficient lamports sent for the selected plan.")]
    InsufficientPayment,

    #[msg("No claimable rewards available.")]
    NoRewardsToClaim,

    #[msg("Arithmetic overflow.")]
    Overflow,
}
