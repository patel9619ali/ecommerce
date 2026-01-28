import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";

type NewEmailProps = {
    newEmail: string;
    goBack: () => void;
    openOtp: () => void;
    setNewEmail: (email: string) => void;
    openChangeEmail: boolean;
    setOpenChangeEmail: (open: boolean) => void;
    setOtpTimer: (timer: number) => void;
    isChangeEmail: boolean;
}

type FormValues = {
    newEmail: string;
};

export default function NewEmail({ newEmail, goBack, openOtp, setNewEmail, openChangeEmail, setOpenChangeEmail, setOtpTimer, isChangeEmail }: NewEmailProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError
    } = useForm<FormValues>({
        defaultValues: {
            newEmail: "",
        },
    });

    // reset with original fullName when popup opens
    useEffect(() => {
        if (openChangeEmail) {
            reset({ newEmail: "" });
        }
    }, [openChangeEmail, reset]);

    const onSubmit = async (data: FormValues) => {
        const email = data.newEmail.trim();
        setLoading(true)
        // const res = await sendEmailOtp(email);

        // if (!res.status) {
        //     setError("newEmail", {
        //         type: "server",
        //         message: res.message || "Failed to send OTP",
        //     });
        //     return;
        // }

        setOtpTimer(30)
        setNewEmail(email);
        openOtp();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${isMounted ? "overflow-y-auto" : "overflow-y-hidden"} h-full`}>
            <div className={`${isChangeEmail ? "justify-end" : "justify-start"} items-start relative h-[200px] flex xs:px-6 px-4 xs:py-5 py-2`}>
                {!isChangeEmail && (
                    <Button
                        type="button"
                        onClick={goBack}
                        className="text-white bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                        <ChevronLeft className="!w-8 !h-8" />
                    </Button>
                )}
                <Image
                    src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}assets/images/email-vector.svg`}
                    width={1038}
                    height={334}
                    alt="Mobile phone"
                    className="w-full absolute inset-0 cover mt-[19px]"
                    unoptimized />
                {isChangeEmail && (
                    <Button
                        type="button"
                        onClick={() => setOpenChangeEmail(false)}
                        className="text-white bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                        <X className="!w-8 !h-8" />
                    </Button>
                )}
            </div>

            <div className="bg-white xs:px-6 px-4 xs:py-6 py-4 h-full">
                <div className="flex flex-col justify-between xs:h-auto h-full">

                    {/* Header + Input */}
                    <div className="xs:mb-2">
                        <div className="relative xs:text-start text-center">
                            <h2 className="xs:text-[23px] text-md font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent xs:mb-8 mb-4 inline-block uppercase">
                                Your New Email
                            </h2>
                        </div>
                        <label className="font-semibold text-md text-[#053E54]">
                            Email Address
                        </label>

                        <input
                            type="text"
                            placeholder="Your new email"
                            {...register("newEmail", {
                                required: "Please enter your new email",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address",
                                },
                                validate: (v) =>
                                    v.trim() !== "" || "Please enter your new email",
                            })}
                            className="w-full border border-[#C9C9C9] rounded-[20px] px-4 py-3 mt-2 outline-none text-[#053E54] placeholder:text-[#C9C9C9] font-medium outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus-visible:border-[#053E54] focus-visible:border-[1.5px]"
                        />

                        {errors.newEmail && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.newEmail.message}
                            </p>
                        )}
                    </div>

                    {/* Submit button */}
                    <div className="sticky bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px] disabled:opacity-60"
                        >
                            {loading ? "Sending OTP..." : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}