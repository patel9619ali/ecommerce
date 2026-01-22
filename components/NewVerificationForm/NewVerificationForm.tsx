"use client";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { Card } from "../ui/card";
import { useCallback, useEffect,useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../auth/FormSuccess";
import { FormError } from "../auth/FormError";
export const NewVerificationForm = () => {
const [error, setError] = useState<string | undefined>();
const [success, setSuccess] = useState<string | undefined>();
const searchParams = useSearchParams();
const token = searchParams.get("token");

const onSubmit = useCallback(() => {
  if (!token) {
    setError("Missing token!");
    return;
  }
  newVerification(token)
    .then((data) => {
      if (!data?.error) {
        setSuccess("Verification successful!");
      }
      setError(data?.error);
    })
    .catch(() => {
      setError("Something went wrong!");
    });
}, [token]);
useEffect(() => {
onSubmit();
    // Here you can add logic to verify the token with your backend
}, [onSubmit]);

return (
    <Card className="w-full max-w-md p-6">
        <div className="flex items-center w-full justify-center">
            {!success && !error && <Loader />}
            <FormSuccess message={success}/>
            <FormError message={error}/>
        </div>
    </Card>
);
};