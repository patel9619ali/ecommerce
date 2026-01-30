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
                className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[300px] max-w-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-white/50 border-none [&>button]:hidden gap-0 block z-200 rounded-2xl m-auto h-[300px]"
            >
                {view === "changeName" && (
                    <>
                    <div className="relative h-full">

                        <div className="flex items-center justify-between xs:px-6 px-4 xs:py-8 py-3 bg-[#fff]">
                            <DialogTitle className="text-[#053E54]">
                                Change Name
                            </DialogTitle>
                            <DialogClose asChild className="z-[999]">
                                <X size={30} fill="#000" className="absolute top-[20px] right-[20px] text-[#000] opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0"/>
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

                                <div className="absolute w-full left-0 px-4 bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
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
                    </div>
                    </>
                )}

                {view === "changeNameSuccess" && (
                    <>
                        <div className="flex items-center justify-center py-10 bg-[#fff]">
                            <div className="w-[92px] h-[92px] flex items-center justify-center border border-[3px] border-[#053E5433] bg-[#C8FFFA] rounded-full">
                                <Check size={50} color="#057C72" />
                            </div>
                        </div>
                        <DialogClose asChild className="z-[999]">
                            <X size={30} fill="#000" className="absolute top-[20px] right-[20px] text-[#000] opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0"/>
                        </DialogClose>

                        <div className="bg-white px-6 py-4 h-full flex flex-col justify-between">
                            <div>
                                <p className="text-[#666666] mt-2 xs:text-[28px] text-[22px] font-700 text-center">Your name has been changed Successfully.</p>
                            </div>

                            <div className="aboslute w-full left-0 bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
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
