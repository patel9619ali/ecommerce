"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, ChevronLeft } from "lucide-react";

type ConfirmOtpProps = {
  phoneNumber: string;
  countryCode: string;
  goBack: () => void;
};

export default function ConfirmOtp({
  phoneNumber,
  countryCode,
  goBack,
}: ConfirmOtpProps) {
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(30);
  const [error, setError] = useState("");

  const submitRef = useRef<HTMLDivElement>(null);

  /* TIMER */
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  const resendOtp = () => {
    setOtp("");
    setError("");
    setOtpTimer(30);
    // API call later
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 4) {
      setError("Please enter valid OTP");
      return;
    }

    // Next step: create user / verify phone
  };

  return (
    <div className="h-full">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <button type="button" onClick={goBack} className="text-[#000000e6] hover:text-underline flex cursor-pointer text-[13px] items-center gap-1" >
            <ArrowLeft width={18} height={18}/>
        </button>
        <h2 className="text-[#000000e6] text-lg font-semibold">
          Confirm OTP
        </h2>
      </div>

      <p className="text-[#666666] xs:text-[18px] text-sm xs:text-start text-start mb-5">
        We sent an OTP to{" "}
        <span className="text-[#000000e6] font-semibold">
          {countryCode} {phoneNumber}
        </span>
        , You will receive in <span className="text-[#000000e6] font-semibold">30s</span>
      </p>

      <form onSubmit={handleSubmit}>
        <InputOTP value={otp} onChange={setOtp} maxLength={4} pattern={REGEXP_ONLY_DIGITS} className="!w-full" >
          <InputOTPGroup className="flex justify-center gap-4 !w-full">
            {[0, 1, 2, 3].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="border border-[#C9C9C9] !rounded-[20px] w-[60px] h-[60px] text-[35px] font-semibold text-[#000000e6] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#053E54] data-[active=true]:ring-0"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error}
          </p>
        )}

        <div className="text-[#000000e6] text-center mt-4 text-sm">
          Didn’t receive OTP?{" "}
          <button
            type="button"
            disabled={otpTimer > 0}
            onClick={resendOtp}
            className="cursor-pointer text-blue-600 font-medium disabled:opacity-50"
          >
            {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend"}
          </button>
        </div>

        <div
          ref={submitRef}
          className="mt-3"
        >
          <Button
            type="submit"
            className="w-full mt-4 bg-yellow-400 text-black"
          >
            Verify OTP
          </Button>
        </div>
      </form>
    </div>
  );
}
