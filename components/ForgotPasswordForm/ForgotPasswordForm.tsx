"use client";
import { useState, useTransition } from "react";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { FormError } from "../auth/FormError";
import { FormSuccess } from "../auth/FormSuccess";
import { forgotPassword } from "@/actions/forgot-password";
import { useForm } from "react-hook-form";

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
          console.log("Forgot Password Response:", res);
          setError(res.error);
          setSuccess(res.success);
        });
      });
    };
  return (
    <div className="flex min-h-screen items-center justify-center bg-white/50 p-4">
      <AuthCard
        title="Forgot Password"
        description="Enter your email and we'll send you a reset link"
        icon={<KeyRound className="h-6 w-6 text-primary-foreground" />}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!success ? (
            <>
              <div className="space-y-2">
                <Label className="text-black/80 text-[15px] mb-1" htmlFor="email">Email address</Label>
                
                <Input id="email" type="email" placeholder="Write your email" value={email} {...register("email", { required: "Email is required" })} onChange={(e) => setEmail(e.target.value)} disabled={isPending} className="bg-[#fff] border-[#000] placeholder:text-[#0f0f0] text-[#000] focus-visible:!ring-0" />
              </div>

              {error && <FormError message={error} />}

              <Button type="submit" className="w-full h-11 mb-0 text-[#000000] border-b-2 rounded-none border-[#000000]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#000000]" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
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
                  className="cursor-pointer font-medium text-[#000000] hover:text-[#000000] hover:underline"
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
              className="w-full text-[#000000] hover:text-[#000000]"
              asChild
            >
              <a className="text-[#000000]" href="/sign-in">
                <ArrowLeft className="text-[#000000] mr-2 h-4 w-4" />
                Back to Login
              </a>
            </Button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};
