import { Suspense } from "react";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div>Verifying...</div>}>
      {/* <NewVerificationForm /> */}
    </Suspense>
  );
}
