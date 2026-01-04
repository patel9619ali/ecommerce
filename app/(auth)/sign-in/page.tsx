"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { mockUsers } from "@/app/(auth)/mockUsers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle,ArrowBigLeftDash, ArrowLeft } from "lucide-react";

type View = "identifier" | "password" | "signup";
type FormValues = {
  identifier: string;
  password: string;
};
export default function LoginPassword() {
  const [view, setView] = useState<View>("identifier");
  const [userInput, setUserInput] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const identifierForm = useForm();
  const passwordForm = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
  });

  /* STEP 1: CHECK EMAIL / PHONE */
  const onContinue = (data: any) => {
    const value = data.identifier.trim();
    setUserInput(value);

    const user = mockUsers.find(
      (u) => u.email === value || u.phone === value
    );

    if (user) {
      setFoundUser(user);
      setView("password");
    } else {
      setView("signup");
    }
  };

  /* STEP 2: PASSWORD LOGIN */
  const handleLogin = (data: any) => {
    if (data.password === foundUser.password) {
      alert("✅ Login Successful");
    } else {
      alert("❌ Wrong password");
    }
  };
 const goBackToIdentifier = () => {
    setView("identifier");
    setFoundUser(null);
    passwordForm.reset();
  };

  const goBackFromSignup = () => {
    setView("identifier");
    setIdentifier("");
    identifierForm.reset();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000e6]">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow">

        {/* STEP 1 */}
        {view === "identifier" && (
          <form onSubmit={handleSubmit(onContinue)}>
            <h1 className="text-[28px] text-[#000000e6] font-[600] leading-normal mb-4">
              Sign in or create account
            </h1>

            <Label className="text-[#000000e6]">Enter mobile number or email</Label>
            <Input
              className={`bg-[#fff] mt-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none placeholder:text-[#000000e6] text-[#000000e6] ${
                errors.identifier ? "focus-visible:border-tranparent focus-visible:outline-none border-[2px] border-[#c10015]" : "border-[1px] border-[#0000004a]"
              }`}
              placeholder="Email or mobile number"
              {...register("identifier", {
                required: "Enter your mobile number or email",
                validate: (value) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const phoneRegex = /^\+?[1-9]\d{9,14}$/;

                  if (emailRegex.test(value) || phoneRegex.test(value)) {
                    return true;
                  }

                  return "Enter a valid email or mobile number with country code";
                },
              })}
            />

            {errors.identifier && (
              <Label className="text-[#c10015] flex gap-1 items-center mt-2 text-[12px]">
                <AlertCircle className="w-[15px] h-[15px]" />
                {errors.identifier.message}
              </Label>
            )}

            <Button className="w-full mt-4 bg-yellow-400 text-black">
              Continue
            </Button>
          </form>
        )}

        {/* STEP 2: PASSWORD */}
        {view === "password" && (
          <form onSubmit={passwordForm.handleSubmit(handleLogin)}>

            <h1 className="text-[28px] text-[#000000e6] font-[600] leading-normal mb-4">Sign in</h1>
            <div className="flex gap-3 items-center mb-2">
              <p className="text-sm text-gray-600">{userInput}</p>
              <button type="button" onClick={goBackToIdentifier} className="hover:text-underline flex cursor-pointer text-[13px] text-blue-600 items-center gap-1" >
                <ArrowLeft width={12} height={12}/> Continue
              </button>

            </div>
            <div className="flex justify-between w-full items-center">
              <Label className="text-[#000000e6] ">Password</Label>
              <Link href="/forget-password" className="hover:text-underline flex cursor-pointer text-[13px] text-blue-600 mb-0 items-center gap-1">
                  Forgot password?
              </Link>
            </div>
                
            <Input type="password" className="placeholder:text-[#000000e6] text-[#000000e6]  bg-[#fff] mt-2" {...passwordForm.register("password", { required: true })} />

            <Button className="w-full mt-4 bg-yellow-400 text-black">
              Sign in
            </Button>
          </form>
        )}

        {/* SIGNUP */}
        {view === "signup" && (
          <>
            <div className="border-b border-[#0000003b] pb-5">

              <h1 className="text-[28px] text-[#000000e6] font-[600] leading-normal mb-4">
                Looks like you are new to Store
              </h1>
              <div className="flex gap-3 items-center mb-3">
                <p className="text-sm text-gray-600">{userInput}</p>
                <button type="button" onClick={goBackFromSignup} className="hover:text-underline flex cursor-pointer text-[13px] text-blue-600 items-center gap-1" >
                  <ArrowLeft width={12} height={12}/> Change
                </button>
              </div>
              <Label className="mb-2 text-[#000000e6] block text-[16px] leading-[20px]">Let's create an account using your mobile number</Label>

              <Link href="/sign-up">
                <Button className="w-full bg-yellow-400 text-black">
                  Proceed to create an account
                </Button>
              </Link>
            </div>
            <Label className="text-[14px] font-[600] block mt-3 mb-2 text-[#000000e6]">Already a customer?</Label>
            <button type="button" onClick={goBackFromSignup} className="hover:text-underline flex cursor-pointer text-[13px] text-blue-600 items-center gap-1" >
              Sign in with another email or mobile
            </button>
            
          </>
        )}

        <p className="text-xs text-gray-600 mt-4">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-blue-600">Terms</Link> &{" "}
          <Link href="#" className="text-blue-600">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
