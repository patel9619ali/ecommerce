"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useTransition, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login } from "@/actions/login";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT_PAGE } from "@/route";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, User } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "../ui/checkbox";
import { useLoading } from "@/context/LoadingContext";
import LoadingLink from "../Loader/LoadingLink";
type FormValues = {
  email: string;
  password: string;
  code: string;
};

export default function SignIn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "OAuthAccountNotLinked") {
      setError(
        "You have already signed in using a different provider. Please use the same sign-in method as before."
      );
    }
  }, [searchParams]);
  
  const onClick = (provider: "google") => {
    setLoading(true);
    signIn(provider, { 
      callbackUrl: DEFAULT_REDIRECT_PAGE 
    });
  }

  const [error, setError] = useState<string | undefined>();
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [rememberMe, setRememberMe] = useState(false);
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
            setError(res.error);
          }
          if (res?.success) {
            setLoading(true);
            reset();
            setSuccess(res.success);
            // Redirect and force a full page refresh to update session
            window.location.href = DEFAULT_REDIRECT_PAGE;
          }
          if (res?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  const onSubmitTwoFactor = (res: FormValues) => {
  setError(undefined);
  setSuccess(undefined);

  startTransition(() => {
    login({
      email: res.email,
      password: res.password,
      code: res.code,
    })
      .then((res) => {
        if (res?.error) {
          setError(res.error);
        }

        if (res?.success) {
          setLoading(true);
          setSuccess(res.success);
          window.location.href = DEFAULT_REDIRECT_PAGE;
        }
      })
      .catch(() => setError("Something went wrong"));
  });
};

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
      <div className="rounded-2xl shadow-md p-6 w-full max-w-sm relative bg-[#fff]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
            <User className="h-5 w-5 text-[#ff8000]" />
          </div>
          <h1 className="text-xl font-semibold text-[#020817]">{`Login`}</h1>
        </div>
        <FormError message={error} />
        <p className="text-sm text-[#64748b] mb-6">{`Login to your account - enjoy exclusive features and many more.`}</p>
        <FormSuccess message={success} />

        <form onSubmit={ showTwoFactor ? handleSubmit(onSubmitTwoFactor) : handleSubmit(onSubmit) } className="space-y-4">
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
                       className="!w-full"
                    >
                      <InputOTPGroup className="flex justify-center gap-4 !w-full">
                        <InputOTPSlot index={0} className="border border-[#C9C9C9] !rounded-[20px] w-[60px] h-[60px] text-[35px] font-semibold text-[#000000e6] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#053E54] data-[active=true]:ring-0" />
                        <InputOTPSlot index={1} className="border border-[#C9C9C9] !rounded-[20px] w-[60px] h-[60px] text-[35px] font-semibold text-[#000000e6] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#053E54] data-[active=true]:ring-0" />
                        <InputOTPSlot index={2} className="border border-[#C9C9C9] !rounded-[20px] w-[60px] h-[60px] text-[35px] font-semibold text-[#000000e6] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#053E54] data-[active=true]:ring-0" />
                        <InputOTPSlot index={3} className="border border-[#C9C9C9] !rounded-[20px] w-[60px] h-[60px] text-[35px] font-semibold text-[#000000e6] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#053E54] data-[active=true]:ring-0" />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                  
                />
                <Button type="submit" disabled={isPending} variant="auth" className="cursor-pointer text-[#fff] w-full h-11" >
                {showTwoFactor 
                  ? (isPending ? "Verifying..." : "Verify Code")
                  : (isPending ? "Signing in..." : "Sign in")
                }
              </Button>
                {errors.code && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </>
          )}
          {!showTwoFactor && (
            <>
              <div>
                <Label className="text-black/80 text-[15px] block mb-1">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your Email"
                  disabled={isPending}
                  {...register("email", { required: "Email is required" })}
                  className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black/80 text-[15px] block mb-1">
                  Password <span className="text-[#ef4444]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    disabled={isPending}
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                    className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] cursor-pointer hover:text-[#64748b] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#ef4444] mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isPending}
                    className="cursor-pointer border-[#254fda] data-[state=checked]:bg-[#254fda] data-[state=checked]:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda]"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-[#64748b] cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                {!showTwoFactor && (
                  <LoadingLink href="/forgot-password" className="text-sm text-[#254fda] hover:underline" >
                    Forgot password?
                  </LoadingLink>
                )}
              </div>
              
              <Button type="submit" disabled={isPending} variant="auth" className="cursor-pointer text-[#fff] w-full h-11" >
                {showTwoFactor 
                  ? (isPending ? "Verifying..." : "Verify Code")
                  : (isPending ? "Signing in..." : "Sign in")
                }
              </Button>
            </>
          )}
        </form>
        {!showTwoFactor && (
          <>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-2 text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="space-y-3">
              <Button disabled={isPending} variant="outline" className="cursor-pointer text-[#020817] w-full h-11" onClick={() => onClick("google")} >
                <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
              </Button>
            </div>
            <p className="text-sm text-center text-[#64748b] mt-6">
              Don't have account?{" "}
              <LoadingLink href="/sign-up" className={`${isPending ?"opacity-50 pointer-events-none":"" } text-[#254fda] hover:underline font-medium`}>
                Sign up
              </LoadingLink>
            </p>
          </>
        )}
      </div>
    </div>
  );
}