"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CountryCodeSelector from "@/components/SignUp/CountryCodeSelector";
import { ChevronDown } from "lucide-react";
import ConfirmOtp from "@/components/SignUp/ConfirmOtp";
import Link from "next/link";

type View = "signup" | "country" | "otp";

type SignUpFormValues = {
  firstName: string;
  phone: string;
  password: string;
};

export default function SignUpPage() {
  const [view, setView] = useState<View>("signup");
  const [countryCode, setCountryCode] = useState("+91");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpFormValues>();

  const phoneValue = watch("phone");

  /* SUBMIT → GO TO OTP */
  const onSubmit = (data: SignUpFormValues) => {
    console.log({
      countryCode,
      ...data,
    });

    setView("otp"); // OTP screen (you’ll implement later)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000e6]">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow">

        {/* ================= SIGN UP FORM ================= */}
        {view === "signup" && (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="border-b border-[#00000052] pb-4">
              <h1 className="text-[28px] font-[600] mb-4">
                Create Account
              </h1>


              {/* MOBILE NUMBER */}
              <div className="mb-4">
                <Label>Mobile number</Label>

                <div className="flex gap-2 mt-2">
                  {/* COUNTRY CODE */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setView("country")}
                    className="flex items-center gap-1"
                  >
                    {countryCode}
                    <ChevronDown size={16} />
                  </Button>

                  {/* PHONE INPUT */}
                  <Input className={`focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none  ${errors.phone ? "focus-visible:border-tranparent focus-visible:outline-none border-[2px] border-[#c10015]" : "border-[1px] border-[#0000004a]"
                }`} type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="Mobile number"
                    {...register("phone", {
                      required: "Mobile number is required",
                      minLength: {
                        value: 7,
                        message: "Minimum 7 digits",
                      },
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers allowed",
                      },
                    })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setValue("phone", value);
                    }}
                  />
                </div>

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* FIRST NAME */}
              <div className="mb-4">
                <Label className="mb-2 block">First name</Label>
                <Input className={`focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none  ${errors.firstName ? "focus-visible:border-tranparent focus-visible:outline-none border-[2px] border-[#c10015]" : "border-[1px] border-[#0000004a]"
                }`} placeholder="Your name" {...register("firstName", { required: "First name is required", minLength: { value: 2, message: "At least 2 characters", }, })} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>



              {/* PASSWORD */}
              <div className="mb-4">
                <Label>Password</Label>
                <Input className={`focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none  ${errors.password ? "focus-visible:border-tranparent focus-visible:outline-none border-[2px] border-[#c10015]" : "border-[1px] border-[#0000004a]"
                }`} 
                  type="password"
                  placeholder="At least 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Label className="text-[14px] leading-[18px] mb-3 block">To verify your number, we will send you a text message with a temporary code. Message and data rates may apply.</Label>
              {/* SUBMIT */}
              <Button
                type="submit"
                className="w-full bg-yellow-400 text-black"
                disabled={!phoneValue}
              >
                Verify mobile number
              </Button>
            </form>
            <div className="my-2">
              <Label className="text-[#000000e6] text-[14px] block mb-0 font-[700]">Already a customer?</Label>
              <Link href="/sign-in" className="text-blue-600 text-[14px]">Sign in</Link>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-blue-600">Terms</Link> &{" "}
              <Link href="#" className="text-blue-600">Privacy</Link>.
            </p>
          </>
        )}

        {/* ================= COUNTRY CODE ================= */}
        {view === "country" && (
          <CountryCodeSelector
            handleSelect={(code) => {
              setCountryCode(code);
              setView("signup");
            }}
            goBack={() => setView("signup")}
          />
        )}

        {/* ================= OTP PLACEHOLDER ================= */}
        {view === "otp" && (
          <ConfirmOtp
            phoneNumber={watch("phone")}
            countryCode={countryCode}
            goBack={() => setView("signup")}
          />
        )}
      </div>
    </div>
  );
}
