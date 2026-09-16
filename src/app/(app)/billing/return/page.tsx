import { Suspense } from "react";
import { PaystackReturn } from "./paystack-return";

export const metadata = { title: "Payment" };

export default function BillingReturnPage() {
  return (
    <Suspense fallback={null}>
      <PaystackReturn />
    </Suspense>
  );
}
