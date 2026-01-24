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

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

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
            <Input
              type="password"
              disabled={isPending}
              {...register("password", { required: "Password is required" })}
              className="bg-[#fff] border-[#000]"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button disabled={isPending} className="w-full bg-yellow-400 text-black">
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
