import TransactionComponent from "@/components/TransactionComponent";
import { Suspense } from "react";

export default function TransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionComponent />
    </Suspense>
  );
}
