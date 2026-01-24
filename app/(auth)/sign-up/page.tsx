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
import { Eye, EyeOff } from "lucide-react";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onSubmit = (data: SignUpFormValues) => {
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
    <div className="min-h-screen flex items-center justify-center bg-white/50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow space-y-4">
        <h1 className="text-[26px] font-semibold text-black">
          Create account
        </h1>

        <FormError message={error} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NAME */}
          <div>
            <Label className="text-black/80 text-[15px]">First name</Label>
            <Input
              disabled={isPending}
              {...register("name", { required: "Name is required" })}
              className="bg-[#fff] border-[#000]"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <Label className="text-black/80 text-[15px]">Email</Label>
            <Input
              type="email"
              disabled={isPending}
              {...register("email", { required: "Email is required" })}
              className="bg-[#fff] border-[#000]"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
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

          <Button disabled={isPending} className="cursor-pointer w-full bg-yellow-400 text-black">
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
