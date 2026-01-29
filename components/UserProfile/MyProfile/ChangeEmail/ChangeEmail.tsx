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
import { X } from "lucide-react";
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
                className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[300px] max-w-full xs:h-auto h-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-white/50 border-none [&>button]:hidden gap-0 block z-200 rounded-2xl">
                <div className="rounded-2xl shadow-md p-6 w-full max-w-full relative bg-[#fff] h-full">
                    <DialogTitle className="text-white hidden">
                        Confirm email screens
                    </DialogTitle>
               <DialogClose asChild className="z-[999]">
                    <X size={30} fill="#fff" className="absolute top-[20px] right-[20px] text-[#fff] opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0"/>
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
                </div>
            </DialogContent>
        </Dialog>
    );
}