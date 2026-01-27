import { Suspense } from "react";
import VerifyEmailForm from "@/components/VerifyEmailForm/VerifyEmailForm";

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm/>
    </Suspense>
  );
}
