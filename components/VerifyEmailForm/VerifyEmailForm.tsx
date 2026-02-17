"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { verifyEmailOtp } from "@/actions/verify-email";
import LoadingLink from "../Loader/LoadingLink";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(30);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const submitRef = useRef<HTMLDivElement>(null);

  // ⏱ OTP timer
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  // ❌ No email → go back
  useEffect(() => {
    if (!email) {
      router.replace("/sign-up");
    }
  }, [email, router]);

  const resendOtp = () => {
    setOtp("");
    setError(undefined);
    setOtpTimer(30);
    // (optional) create resend-email-otp action later
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (otp.length !== 4 || !email) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    startTransition(() => {
      verifyEmailOtp(email, otp).then((res) => {
        if (res?.error) {
          setError(res.error);
        }

        if (res?.success) {
          router.replace("/sign-in?verified=true");
        }
      });
    });
  };
const maskedEmail = email?.replace(/(.{2})(.*)(@.*)/, "$1***$3");
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
      <div className="rounded-2xl shadow-md p-6 w-full max-w-sm relative bg-[#fff]">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#ff8000]" />
          </div>
          <h1 className="text-xl font-semibold text-[#020817]">{`Check your email`}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 -mt-2">
            <p className="text-sm text-[#64748b]">
              We sent a verification code to{" "}
              <span className="font-medium text-[#020817]">{maskedEmail}</span>
            </p>
            <p className="text-sm text-[#64748b]">
              Enter the 4-digit code mentioned in the email
            </p>
          </div>
          {/* OTP INPUT */}
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS}
            className="!w-full"
            disabled={isPending}
          >
            <InputOTPGroup className="flex justify-center gap-4 !w-full">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="border border-[#C9C9C9] h-14 w-14 text-[22px] rounded-xl font-semibold text-black data-[active=true]:bg-[#64748b47] data-[active=true]:border-[#254fda] data-[active=true]:border-[2px] data-[active=true]:ring-0 transition-colors border-1 rounded-xl first:rounded-xl last:rounded-xl "
                />
                
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2 mb-2">
              {error}
            </p>
          )}
          <div ref={submitRef} className="mt-4 mb-2">
            <Button
              type="submit"
              disabled={isPending}
              variant="auth"
              className="text-[#fff] w-full h-10 cursor-pointer"
            >
              {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
            </Button>
          </div>
          {/* RESEND */}
          <p className="text-center text-sm text-[#64748b]">
            Haven't got the email yet?{" "}
            <button
              type="button"
              disabled={otpTimer > 0 || isPending}
              onClick={resendOtp}
              className="cursor-pointer font-medium mt-3 text-[#254fda] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend email"}
            </button>
          </p>
          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-[#64748b] hover:text-[#020817] hover:bg-[#f1f5f9]"
              asChild
            >
              <LoadingLink className={`${isPending ?"opacity-50 pointer-events-none":"" } text-[#000000]`} href="/sign-up">
                Back to Sign up
              </LoadingLink>
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
