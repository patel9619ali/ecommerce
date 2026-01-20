import { Suspense } from "react";
import SignIn from "@/components/SignIn/SignIn";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}

