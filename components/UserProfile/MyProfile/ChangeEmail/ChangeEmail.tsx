import { useState, useEffect,useTransition } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ConfirmEmail from "./ConfirmEmail";
import VerifiedEmail from "./VerifiedEmail";
import NewEmail from "./NewEmail";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateSetting } from "@/actions/settings";
import { useSession } from "next-auth/react";
import ConfirmOtp from "@/components/UserProfile/MyProfile/ChangeEmail/ConfirmOtp";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
type ChangeEmailProps = {
    openChangeEmail: boolean;
    setOpenChangeEmail: (open: boolean) => void;
    newEmail: string;
    setNewEmail: (email: string) => void;
    isChangeEmail: boolean;
    setIsChangeEmail: (change: boolean) => void;
}
type FormValues = {
    email: string;
};
export default function ChangeEmail({ openChangeEmail, setOpenChangeEmail, newEmail, setNewEmail, isChangeEmail, setIsChangeEmail }: ChangeEmailProps) {
    const [openChangeName, setOpenChangeName] = useState(false);
    const { update } = useSession();
    const [view, setView] = useState<"confirmEmail" | "newEmail" | "confirmOtp" | "verifiedEmail">(isChangeEmail ? "newEmail" : "confirmEmail");
    const [otpTimer, setOtpTimer] = useState(0);
    const user = useCurrentUser();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const {
            register,
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<FormValues>({
            defaultValues: {
                email: "",
            },
        });
     useEffect(() => {
        if (!user || !openChangeEmail) return;
    
        reset({
            email: user.email || "",
        });
        }, [user, openChangeEmail, reset]);
    
    
        useEffect(() => {
            if (!openChangeEmail) {
                const timeout = setTimeout(() => {
                    setView("newEmail");
                }, 200);
    
                return () => clearTimeout(timeout);
            }
        }, [openChangeEmail]);
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
                    setView("confirmOtp");
                    setSuccess(res.success);
                }
            })
            .catch(() => setError("Something went wrong"));
        });
        };

    return (
        <Dialog open={openChangeEmail} onOpenChange={setOpenChangeEmail}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[300px] max-w-full xs:h-auto h-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-white/50 border-none [&>button]:hidden gap-0 block z-200 rounded-2xl lg:h-full h-[385px] m-auto">
                <div className="rounded-2xl shadow-md p-6 w-full max-w-full relative bg-[#fff] lg:h-full h-[385px]">
                    <DialogTitle className="text-white hidden">
                        Confirm email screens
                    </DialogTitle>
               <DialogClose asChild className="z-[999]">
                    <X size={30} fill="#000" className="absolute top-[20px] right-[20px] text-[#000] opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0"/>
                </DialogClose>

                    {/* New Email Screen */}
                    {view === "newEmail" && (
                        <NewEmail newEmail={newEmail} goBack={() => setView("confirmEmail")} openOtp={() => setView("confirmOtp")} setNewEmail={setNewEmail} openChangeEmail={openChangeEmail} isChangeEmail={isChangeEmail} setOtpTimer={setOtpTimer} setOpenChangeEmail={setOpenChangeEmail} />
                    )}
                    {view === "confirmOtp" && (
                        <ConfirmOtp
                            newEmail={newEmail}
                            otpTimer={otpTimer}
                            setOtpTimer={setOtpTimer}
                            goToConfirmEmail={() => setView("confirmEmail")}
                            goToNewEmail={() => setView("newEmail")}
                            verifiedEmail={() => setView("verifiedEmail")}
                        />
                    )}
                    {view === "verifiedEmail" && (
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
                                <p className="text-[#666666] mt-2 xs:text-[28px] text-[22px] font-700 text-center">Your Email has been changed Successfully.</p>
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
                </div>
            </DialogContent>
        </Dialog>
    );
}