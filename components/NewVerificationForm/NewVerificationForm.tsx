"use client";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Card } from "../ui/card";
import { useCallback, useEffect,useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../auth/FormSuccess";
import { FormError } from "../auth/FormError";
import { AuthCard } from "@/components/ForgotPasswordForm/AuthCard";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export const NewVerificationForm = () => {
const [error, setError] = useState<string | undefined>();
const [success, setSuccess] = useState<string | undefined>();
 const [isLoading, setIsLoading] = useState(true);
const searchParams = useSearchParams();
const token = searchParams.get("token");

const onSubmit = useCallback(() => {
  if (!token) {
    setError("Missing token!");
    setIsLoading(false);
    return;
  }
  newVerification(token)
    .then((data) => {
      if (!data?.error) {
        setSuccess("Verification successful!");
      }
      setError(data?.error);
    })
    .catch(() => {
      setError("Something went wrong!");
    }).finally(() => {
      setIsLoading(false);
    });;
}, [token]);
useEffect(() => {
onSubmit();
    // Here you can add logic to verify the token with your backend
}, [onSubmit]);

return (
    <div className="flex min-h-screen items-center justify-center bg-white/50 p-4">
      <AuthCard
        title="Email Verification"
        description="Confirming your email address..."
        icon={<MailCheck className="h-6 w-6 text-[#000000]" />}
      >
        <div className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#000000]" />
              <p className="text-sm text-[#000000]">Verifying your email...</p>
            </div>
          )}

          {!isLoading && success && (
            <div className="space-y-4">
              <FormSuccess message={success} />
              <Button className="text-[#fff] w-full" asChild>
                <a href="/sign-in">Continue to Login</a>
              </Button>
            </div>
          )}

          {!isLoading && error && (
            <div className="space-y-4">
              <FormError message={error} />
              <Button variant="outline" className="text-[#fff] w-full" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </AuthCard>
    </div>
);
};