"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "@/actions/signup";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const onSubmit = (data: SignUpFormValues) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      signup(data).then((res) => {
        setError(res.error);
        setSuccess(res.success);
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
        <FormSuccess message={success} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* FIRST NAME */}
          <div>
            <Label className="text-black/80 text-[15px]">First name</Label>
            <Input disabled={isPending} {...register("name", { required: true })} className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0" />
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
              {...register("email", { required: true })} className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0"
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
              {...register("password", { required: true })} className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            disabled={isPending}
            className="w-full bg-yellow-400 text-black"
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* GOOGLE SIGNUP */}
        <Button variant="outline" className="w-full bg-[#fff] text-[#000]">
          Continue with Google
        </Button>

        {/* SIGN IN LINK */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600">
            Sign in
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
