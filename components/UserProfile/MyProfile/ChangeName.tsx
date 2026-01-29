'use client'

import { useState, useEffect,useTransition } from "react";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { updateSetting } from "@/actions/settings";
import { useSession } from "next-auth/react";
type ChangeNameProps = {
    openChangeName: boolean;
    setOpenChangeName: (open: boolean) => void;
};

type FormValues = {
    name: string;
};

export default function ChangeName({
    openChangeName,
    setOpenChangeName
}: ChangeNameProps) {
const { update } = useSession();
    const user = useCurrentUser();
    const [view, setView] = useState<"changeName" | "changeNameSuccess">("changeName");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
    if (!user || !openChangeName) return;

    reset({
        name: user.name || "",
    });
    }, [user, openChangeName, reset]);


    useEffect(() => {
        if (!openChangeName) {
            const timeout = setTimeout(() => {
                setView("changeName");
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [openChangeName]);
    const [isPending, startTransition] = useTransition();
    const onSubmit = (values: FormValues) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
        updateSetting(values)
        .then((res) => {
            if (res?.error) {
            setError(res.error);
            }

            if (res?.success) {
            update(); // refresh session
            setView("changeNameSuccess");
            setSuccess(res.success);
            }
        })
        .catch(() => setError("Something went wrong"));
    });
    };


    // if (!isReady) {
    //     return null;
    // }

    return (
        <Dialog open={openChangeName} onOpenChange={setOpenChangeName}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[440px] max-w-full xs:h-auto h-full bg-[#053E54] border-none [&>button]:hidden gap-0 block z-200"
            >
                {view === "changeName" && (
                    <>
                        <div className="flex items-center justify-between xs:px-6 px-4 xs:py-8 py-3">
                            <DialogTitle className="text-white">
                                Change Name
                            </DialogTitle>
                            <DialogClose className="text-white">
                                <X size={30} />
                            </DialogClose>
                        </div>

                        <div className="bg-white xs:px-6 px-4 xs:py-6 py-4 h-full">
                            <div className="flex flex-col justify-between h-full">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label className="font-semibold text-[#053E54]">
                                    Full Name (As per document)
                                </label>

                                    <input
                                        type="text"
                                        {...register("name", {
                                            required: "Please enter your full name",
                                            pattern: {
                                                value: /^[A-Za-z ]+$/,
                                                message: "Only alphabets allowed",
                                            },
                                        })}
                                        className="w-full border border-[#C9C9C9] rounded-[20px] px-4 py-3 mt-2 outline-none text-[#053E54] placeholder:text-[#C9C9C9] font-medium outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 focus-visible:border-[#053E54] focus-visible:border-[1.5px]"
                                    />

                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {errors.name.message}
                                        </p>
                                    )}

                                <div className="sticky bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
                                    <button type="submit"
                                        disabled={isPending}
                                        className="w-full h-[50px] leading-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px] cursor-pointer"
                                        >
                                        {isPending ? "Saving..." : "Done"}
                                    </button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </>
                )}

                {view === "changeNameSuccess" && (
                    <>
                        <div className="flex items-center justify-center py-10">
                            <div className="w-[92px] h-[92px] flex items-center justify-center border border-[3px] border-[#053E5433] bg-[#C8FFFA] rounded-full">
                                <Check size={50} color="#057C72" />
                            </div>
                        </div>

                        <div className="bg-white px-6 py-4 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-md xs:text-[23px] font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent xs:mb-4 inline-block">Changed</h2>
                                <p className="text-[#666666] mt-2 xs:text-[18px] text-sm font-400 xs:text-start text-center">Your name has been changed Successfully.</p>
                            </div>

                            <div className="sticky bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
                                <button 
                                    onClick={() => setOpenChangeName(false)}
                                    className="w-full h-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px] cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
