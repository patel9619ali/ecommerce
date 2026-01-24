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
import { ArrowLeft } from "lucide-react";
import { verifyEmailOtp } from "@/actions/verify-email";

export default function VerifyEmailPage() {
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

    if (otp.length !== 6 || !email) {
      setError("Please enter a valid 6-digit OTP");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white/50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow space-y-4">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-black flex items-center gap-1"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-black">
            Verify your email
          </h2>
        </div>

        <p className="text-sm text-gray-600">
          We sent a 6-digit verification code to{" "}
          <span className="font-semibold text-black">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP INPUT */}
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            className="!w-full"
            disabled={isPending}
          >
            <InputOTPGroup className="flex justify-center gap-4 !w-full">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="border border-[#C9C9C9] !rounded-[20px] w-[45px] h-[45px] text-[22px] font-semibold text-black data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-black data-[active=true]:ring-0"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error}
            </p>
          )}

          {/* RESEND */}
          <div className="text-center mt-4 text-sm text-gray-700">
            Didn’t receive the code?{" "}
            <button
              type="button"
              disabled={otpTimer > 0}
              onClick={resendOtp}
              className="text-blue-600 font-medium disabled:opacity-50"
            >
              {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend"}
            </button>
          </div>

          <div ref={submitRef} className="mt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-yellow-400 text-black"
            >
              {isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
