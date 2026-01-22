import { Suspense } from "react";
import { NewVerificationForm } from "@/components/NewVerificationForm/NewVerificationForm";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div>Verifying...</div>}>
      <NewVerificationForm />
    </Suspense>
  );
}
