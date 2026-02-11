import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
