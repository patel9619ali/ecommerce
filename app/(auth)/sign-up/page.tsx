// C:\Users\Admin\Documents\single_product\startup\app\(auth)\sign-up\page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "@/actions/signup";
import { FormError } from "@/components/auth/FormError";
import { Eye, EyeOff,UserPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import LoadingLink from "@/components/Loader/LoadingLink";

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onSubmit = (data: SignUpFormValues) => {
    if (!agreeToTerms) {
      setError("You must agree to the Terms and Privacy Policy");
      return;
    }
    setError(undefined);

    startTransition(() => {
      signup(data).then((res) => {
        if (res?.error) {
          setError(res.error);
        }

        // ✅ Redirect to OTP verification page
        if (res?.verifyEmailOtp) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        }
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
      <div className="rounded-2xl shadow-md p-6 w-full max-w-sm relative bg-[#fff]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-[#ff8000]" />
          </div>
          <h1 className="text-xl font-semibold text-[#020817]">{`Sign up`}</h1>
        </div>
        <FormError message={error} />
        <p className="text-sm text-[#64748b] mb-6">{`Create your account - enjoy our services with most updated features.`}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#020817] text-sm mb-1 block">
              Name <span className="text-[#ef4444]">*</span>
            </Label>
            <Input
              id="name"
              disabled={isPending}
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
            />
            {errors.name && (
              <p className="text-xs text-[#ef4444] mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#020817] text-sm mb-1 block">
              Email <span className="text-[#ef4444]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              disabled={isPending}
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
            />
            {errors.email && (
              <p className="text-xs text-[#ef4444] mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#020817] text-sm mb-1 block">
              Password <span className="text-[#ef4444]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#020817] transition-colors focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
              >
                {showPassword ? (
                  <EyeOff className="cursor-pointer h-4 w-4" />
                ) : (
                  <Eye className="cursor-pointer h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#ef4444] mt-1">
                {errors.password.message}
              </p>
            )}
            <PasswordStrengthIndicator password={password} />
          </div>

          {/* TERMS CHECKBOX */}
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)} disabled={isPending} className="cursor-pointer border-[#254fda] data-[state=checked]:bg-[#254fda] data-[state=checked]:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda]"/>
            <label
              htmlFor="terms"
              className="text-sm text-[#64748b] cursor-pointer"
            >
              I agree with{" "}
              <a href="/terms" className="cursor-pointer text-[#254fda] hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="cursor-pointer text-[#254fda] hover:underline">
                Privacy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            variant="auth"
            className="text-[#fff] cursor-pointer w-full h-11"
          >
            {isPending ? "Creating account..." : "Let's roll"}
          </Button>
        </form>

        <p className="text-sm text-center text-[#64748b] mt-4">
          Already have account?{" "}
          <LoadingLink href="/sign-in" className={`${isPending ?"opacity-50 pointer-events-none":"" } text-[#254fda] hover:underline font-medium`}>
            Login
          </LoadingLink>
        </p>
      </div>
    </div>
  );
}
