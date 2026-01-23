import { Suspense } from "react";
import { NewVerificationForm } from "@/components/NewVerificationForm/NewVerificationForm";
import { NewPasswordForm } from "@/components/NewPasswordForm/NewPasswordForm";

export default function NewPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm/>
    </Suspense>
  );
}
