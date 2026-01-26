"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useTransition,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login } from "@/actions/login";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT_PAGE } from "@/route";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
type FormValues = {
  email: string;
  password: string;
  code: string;
};

export default function SignIn() {
  const searchParams = useSearchParams();

useEffect(() => {
  const oauthError = searchParams.get("error");

  if (oauthError === "OAuthAccountNotLinked") {
    setError(
      "You have already signed in using a different provider. Please use the same sign-in method as before."
    );
  }
}, [searchParams]);
  const onClick = (provider: "google") => {
    signIn(provider, { 
      callbackUrl: DEFAULT_REDIRECT_PAGE 
    });
  }
  const [error, setError] = useState<string | undefined>();
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (res: FormValues) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      login(res)
      .then((res) => {
      if (res?.error) {
        reset();
        setError(res.error);
      }
      if (res?.success) {
        reset();
        setSuccess(res.success);
      }
      if (res?.twoFactor) {
        setShowTwoFactor(true);
      }
    })
    .catch(() => setError("Something went wrong"));
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white/50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow space-y-4">

        <h1 className="text-[26px] font-semibold text-black">
          Sign in
        </h1>

        <FormError message={error} />
        <FormSuccess message={success} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {showTwoFactor && (
            <>
              <div className="space-y-2">
                <Label className="text-black/80 text-[15px] mb-3 block">Two-Factor Authentication Code</Label>
                <Controller
                  name="code"
                  control={control}
                  
                  rules={{ required: "Code is required" }}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      
                      value={field.value || ""}
                      onChange={field.onChange}
                      disabled={isPending}
                      className="justify-center"
                    >
                      <InputOTPGroup className="gap-4">
                        <InputOTPSlot index={0} className="border border-[#C9C9C9] !rounded-[20px] md:w-[40px] md:h-[40px] md:text-[25px] w-[32px] h-[32px] text-[20px] font-semibold text-[#0f0f0f] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#0f0f0f] data-[active=true]:ring-0" />
                        <InputOTPSlot index={1} className="border border-[#C9C9C9] !rounded-[20px] md:w-[40px] md:h-[40px] md:text-[25px] w-[32px] h-[32px] text-[20px] font-semibold text-[#0f0f0f] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#0f0f0f] data-[active=true]:ring-0" />
                        <InputOTPSlot index={2} className="border border-[#C9C9C9] !rounded-[20px] md:w-[40px] md:h-[40px] md:text-[25px] w-[32px] h-[32px] text-[20px] font-semibold text-[#0f0f0f] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#0f0f0f] data-[active=true]:ring-0" />
                        <InputOTPSlot index={3} className="border border-[#C9C9C9] !rounded-[20px] md:w-[40px] md:h-[40px] md:text-[25px] w-[32px] h-[32px] text-[20px] font-semibold text-[#0f0f0f] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#0f0f0f] data-[active=true]:ring-0" />
                        <InputOTPSlot index={4} className="border border-[#C9C9C9] !rounded-[20px] md:w-[40px] md:h-[40px] md:text-[25px] w-[32px] h-[32px] text-[20px] font-semibold text-[#0f0f0f] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#0f0f0f] data-[active=true]:ring-0" />
                        <InputOTPSlot index={5} className="border border-[#C9C9C9] !rounded-[20px] md:w-[40px] md:h-[40px] md:text-[25px] w-[32px] h-[32px] text-[20px] font-semibold text-[#0f0f0f] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#0f0f0f] data-[active=true]:ring-0" />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.code && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </>
          )}
          

          {!showTwoFactor &&
            <>
            <div>
              <Label className="text-black/80 text-[15px]">Email</Label>
              <Input
                type="email"
                disabled={isPending}
                {...register("email", { required: "Email is required" })} className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-black/80 text-[15px]">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  disabled={isPending}
                  {...register("password", { required: "Password is required" })} className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#000]/60 hover:text-[#000]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            </>
          }

          <Button disabled={isPending} className="cursor-pointer w-full bg-yellow-400 text-[#0f0f0f] mb-0">
            {showTwoFactor 
              ? (isPending ? "Verifying..." : "Verify Code")
              : (isPending ? "Signing in..." : "Sign in")
            }
          </Button>
           {!showTwoFactor &&
            <>
          <Button className="text-sm text-gray-600 p-0 hover:text-black" >
            <Link href="/forgot-password">Forgot your password?</Link>
          </Button>
          </>}
        </form>
        {!showTwoFactor &&
            <>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-2 text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <Button variant="outline" className="cursor-pointer w-full bg-[#fff] text-[#000] flex items-center" onClick={()=>
                onClick("google")} >
                <span className="text-[14px]">Sign in with Google</span> 
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="-3 0 262 262" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#ff0000"/></svg>
            </Button>
              <p className="text-sm text-center text-gray-600 mt-3">
                Don’t have an account?{" "}
                <Link href="/sign-up" className="text-blue-600">
                  Create one
                </Link>
              </p>

            <p className="text-xs text-gray-600 text-center">
              By continuing, you agree to our{" "}
              <Link href="/terms-and-conditions" className="text-blue-600">Terms</Link> &{" "}
              <Link href="/privacy-policy" className="text-blue-600">Privacy Policy</Link>.
            </p>
          </>}
      </div>
    </div>
  );
}
