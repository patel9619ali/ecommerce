"use client";

import { useEffect, useState, useTransition,useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2, Mail } from "lucide-react";
import { verifyEmailOtp } from "@/actions/verify-email";

type ConfirmOtpProps = {
  goToConfirmEmail: () => void;
  goToNewEmail: () => void;
  otpTimer: number;
  setOtpTimer: (t: number) => void;
  newEmail: string;
  verifiedEmail: () => void;
};

export default function ConfirmOtp({
  goToConfirmEmail,
  goToNewEmail,
  otpTimer,
  setOtpTimer,
  newEmail,
  verifiedEmail,
}: ConfirmOtpProps) {

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  // Countdown
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer(otpTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer, setOtpTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (otp.length !== 4) {
      setError("Please enter 4 digit OTP");
      return;
    }

    startTransition(() => {
      verifyEmailOtp(newEmail, otp)
        .then((res) => {
          if (res?.error) {
            setError(res.error);
          }

          if (res?.success) {
            
            verifiedEmail();
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  const resendOtp = () => {
    setOtp("");
    setError(undefined);
    setOtpTimer(30);
    // optional: add resend API later
  };
 const submitRef = useRef<HTMLDivElement>(null);
  const maskedEmail = newEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <div className="h-full">
      <div className="flex items-center gap-3 mb-4 justify-center">
        <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
          <Mail className="h-5 w-5 text-[#ff8000]" />
        </div>
        <h1 className="text-xl font-semibold text-[#020817] text-center">Check your email</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-1 -mt-2">
            <p className="text-sm text-[#64748b] text-center">
              We sent a verification code to{" "}
              <span className="font-medium text-[#020817]">{maskedEmail}</span>
            </p>
            <p className="text-sm text-[#64748b] text-center">
              Enter the 4-digit code mentioned in the email
            </p>
          </div>

        {/* OTP INPUT */}
        <InputOTP
          value={otp}
          onChange={setOtp}
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={isPending}
        >
          <InputOTPGroup className="flex justify-center gap-4 !w-full">
            {[0,1,2,3].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="border border-[#C9C9C9] h-14 w-14 text-[22px] rounded-xl font-semibold text-black data-[active=true]:bg-[#64748b47] data-[active=true]:border-[#254fda] data-[active=true]:border-[2px] data-[active=true]:ring-0 transition-colors border-1 rounded-xl first:rounded-xl last:rounded-xl "
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2 mb-2">{error}</p>
        )}

        <div ref={submitRef} className="mt-4 mb-2">
            <Button
              type="submit"
              disabled={isPending}
              variant="auth"
              className="w-full h-10 cursor-pointer"
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
        <p className="text-center text-sm text-gray-500 mt-3 block">
          Didn’t get email?{" "}
          <button
            type="button"
            disabled={otpTimer > 0 || isPending}
            onClick={resendOtp}
            className="text-blue-600 font-medium disabled:opacity-50 cursor-pointer"
          >
            {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend"}
          </button>
        </p>

      </form>
    </div>
  );
}
