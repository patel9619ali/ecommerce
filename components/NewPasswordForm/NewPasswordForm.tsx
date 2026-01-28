"use client";
import { useState, useTransition } from "react";
import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { AuthCard } from "@/components/ForgotPasswordForm/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator/PasswordStrengthIndicator";
type FormValues = {
  password: string;
  confirmPassword: string;
};

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch("password");

  const onSubmit = (data: FormValues) => {
    setError(undefined);
    setSuccess(undefined);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (data.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    startTransition(() => {
        newPassword(data, token)
        .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white/50 p-4">
      <div className="rounded-2xl shadow-md p-6 w-full max-w-sm relative bg-[#fff]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
            <Lock className="h-5 w-5 text-[#ff8000]" />
          </div>
          <h1 className="text-xl font-semibold text-[#020817]">{`Set a new password`}</h1>
        </div>
          <p className="text-sm text-[#64748b] mb-6">{`Create a new password. Ensure it differs from previous ones for security`}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!success ? (
            <>
              <div className="space-y-2">
                <Label className="text-black/80 text-[15px] mb-1 block" htmlFor="password">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    disabled={isPending}
                    className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
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
                  <p className="text-sm text-[#ff0000]">{errors.password.message}</p>
                )}
                <PasswordStrengthIndicator password={password} />
              </div>

              <div className="space-y-2">
                <Label className="text-black/80 text-[15px] mb-1 block" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    disabled={isPending}
                    className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#000]/60 hover:text-[#000]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-[#ef4444]">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && <FormError message={error} />}

              <Button
                type="submit"
                className="cursor-pointer w-full h-11"
                variant="auth"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#000000]" />
                    Resetting...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4 text-[#000000]">
              <FormSuccess message={success} />
              <p className="text-center text-sm text-[#000000]">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#020817]"
              asChild
            >
              <a className="text-[#000000]" href="/sign-in">
                Back to Login
              </a>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
