"use client";
import { useState } from "react";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { FormError } from "../auth/FormError";
import { FormSuccess } from "../auth/FormSuccess";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Mock function - replace with your actual reset password action
const sendResetEmail = async (email: string): Promise<{ error?: string; success?: string }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Return success or error based on your backend logic
  return { success: `Password reset link sent to ${email}` };
};

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    // Validate email
    // const validation = emailSchema.safeParse({ email });
    // if (!validation.success) {
    //   setError(validation.error.errors[0].message);
    //   return;
    // }

    setIsLoading(true);

    try {
      const data = await sendResetEmail(email);
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        setSuccess(data.success);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white/50 p-4">
      <AuthCard
        title="Forgot Password"
        description="Enter your email and we'll send you a reset link"
        icon={<KeyRound className="h-6 w-6 text-primary-foreground" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!success ? (
            <>
              <div className="space-y-2">
                <Label className="text-black/80 text-[15px]" htmlFor="email">Email address</Label>
                
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-[#fff] border-[#000] placeholder:text-[#000] text-[#000] focus-visible:!ring-0"
                />
              </div>

              {error && <FormError message={error} />}

              <Button type="submit" className="w-full h-11 mb-0 text-[#000000] border-b-2 rounded-none border-[#000000]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#000000]" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4 text-[#000000]">
              <FormSuccess message={success} />
              <p className="text-center text-sm text-[#000000]">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(undefined);
                    setEmail("");
                  }}
                  className="font-medium text-[#000000] hover:text-[#000000] hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-[#000000] hover:text-[#000000]"
              asChild
            >
              <a className="text-[#000000]" href="/sign-in">
                <ArrowLeft className="text-[#000000] mr-2 h-4 w-4" />
                Back to Login
              </a>
            </Button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};
