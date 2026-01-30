"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { updateSetting } from "@/actions/settings";

type NewEmailProps = {
  newEmail: string;
  goBack: () => void;
  openOtp: () => void;
  setNewEmail: (email: string) => void;
  openChangeEmail: boolean;
  setOpenChangeEmail: (open: boolean) => void;
  setOtpTimer: (timer: number) => void;
  isChangeEmail: boolean;
};

type FormValues = {
  email: string;
};

export default function NewEmail({
  goBack,
  openOtp,
  setNewEmail,
  setOpenChangeEmail,
  setOtpTimer,
  isChangeEmail,
}: NewEmailProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setError(undefined);

    startTransition(() => {
      updateSetting({ email: values.email })
        .then((res) => {
          if (res?.error) {
            setError(res.error);
          }

          if (res?.success) {
            setNewEmail(values.email);
            setOtpTimer(60);      // 60s OTP timer
            openOtp();            // move to OTP screen
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    
    <form onSubmit={handleSubmit(onSubmit)} className={`${isMounted ? "overflow-y-auto" : "overflow-y-hidden"} h-full`}>
      {/* HEADER */}
      {/* <div className={`${isChangeEmail ? "justify-end" : "justify-start"} bg-[#053E54] items-start relative h-[150px] flex xs:px-6 px-4 xs:py-5 py-2 rounded-2xl`}>

        <Image
          src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/email-vector.svg`}
          width={1038}
          height={334}
          alt="Email"
          className="w-full absolute inset-0 mt-[19px]"
          unoptimized
        />

        {isChangeEmail && (
          <Button
            type="button"
            onClick={() => setOpenChangeEmail(false)}
            className="bg-transparent text-white hover:bg-transparent !p-0"
          >
            <X className="w-8 h-8" />
          </Button>
        )}
      </div> */}

      {/* BODY */}
      <div className="bg-white xs:px-6 px-4 xs:py-6 py-4">
        <div className="flex flex-col justify-between">

          <div>
            <h2 className="xs:text-[28px] text-[25px] font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent mb-4 uppercase">
              Your New Email
            </h2>

            <label className="font-semibold text-md text-[#053E54]">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Your new email"
              {...register("email", {
                required: "Please enter your new email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full border border-[#C9C9C9] rounded-[20px] px-4 py-3 mt-2 outline-none placeholder:text-[#053E54]"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* BUTTON */}
          <div className="cursor-pointer absolute w-full left-0 px-8 bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full h-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px] disabled:opacity-60"
            >
              {isPending ? "Sending OTP..." : "Next"}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
