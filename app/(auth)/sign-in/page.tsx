"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login } from "@/actions/login";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginSimple() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      login(data).then((res) => {
        setError(res.error);
        setSuccess(res.success);
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white/50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow space-y-4">

        <h1 className="text-[26px] font-semibold text-black">
          Sign in
        </h1>

        <FormError message={error} />
        <FormSuccess message={success} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Input
              type="password"
              disabled={isPending}
              {...register("password", { required: "Password is required" })} className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button disabled={isPending} className="w-full bg-yellow-400 text-black">
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <Button variant="outline" className="w-full bg-[#fff] text-[#000]">
          Continue with Google
        </Button>
          <p className="text-sm text-center text-gray-600 mt-3">
            Don’t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600">
              Create one
            </Link>
          </p>

        <p className="text-xs text-gray-600 text-center">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-blue-600">Terms</Link> &{" "}
          <Link href="#" className="text-blue-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
