"use client";
import { useState, useTransition } from "react";
import { KeyRound, ArrowLeft, Loader2, Lock } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { FormError } from "../auth/FormError";
import { FormSuccess } from "../auth/FormSuccess";
import { forgotPassword } from "@/actions/forgot-password";
import { useForm } from "react-hook-form";
import LoadingLink from "../Loader/LoadingLink";

type FormValues = {
  email: string;
};

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>();
  
    const onSubmit = (data: FormValues) => {
      setError(undefined);
      setSuccess(undefined);
  
      startTransition(() => {
        forgotPassword(data).then((res) => {
          setError(res.error);
          setSuccess(res.success);
        });
      });
    };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] p-4">
      <div className="rounded-2xl shadow-md p-6 w-full max-w-sm relative bg-[#fff]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
            <Lock className="h-5 w-5 text-[#ff8000]" />
          </div>
          <h1 className="text-xl font-semibold text-[#020817]">{`Forgot Password`}</h1>
        </div>
        <p className="text-sm text-[#64748b] mb-6">{`Enter your email that you used to register your account, so we can send you a link to reset your password`}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!success ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#020817] text-sm mb-1 block">
                  Email <span className="text-[#ef4444]">*</span>
                </Label>
                
                <Input id="email" type="email" placeholder="Write your email" value={email} {...register("email", { required: "Email is required" })} onChange={(e) => setEmail(e.target.value)} disabled={isPending} className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]" />
              </div>

              {error && <FormError message={error} />}

              <Button
                type="submit"
                className="text-[#fff] cursor-pointer w-full h-11"
                variant="auth"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send link"
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4 text-[#000000]">
              <FormSuccess message={success} />
              <p className="text-center text-sm text-[#000000]">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(undefined);
                    setEmail("");
                  }}
                  className={`cursor-pointer font-medium text-[#000000] hover:text-[#000000] hover:underline`}
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              className={`${isPending ?"opacity-50 pointer-events-none":"" } w-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#020817]`}
              asChild
              disabled={isPending}
            >
              <LoadingLink href="/sign-in">
                
                Back to Login
              </LoadingLink>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
