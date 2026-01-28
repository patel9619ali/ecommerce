import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ConfirmEmail from "./ConfirmEmail";
import VerifiedEmail from "./VerifiedEmail";
import NewEmail from "./NewEmail";

type ChangeEmailProps = {
    openChangeEmail: boolean;
    setOpenChangeEmail: (open: boolean) => void;
    newEmail: string;
    setNewEmail: (email: string) => void;
    isChangeEmail: boolean;
    setIsChangeEmail: (change: boolean) => void;
}

export default function ChangeEmail({ openChangeEmail, setOpenChangeEmail, newEmail, setNewEmail, isChangeEmail, setIsChangeEmail }: ChangeEmailProps) {
    const [view, setView] = useState<"confirmEmail" | "newEmail" | "confirmOtp" | "verifiedEmail">(isChangeEmail ? "newEmail" : "confirmEmail");
    const [otpTimer, setOtpTimer] = useState(0);

    useEffect(() => {
        setView(isChangeEmail ? "newEmail" : "confirmEmail");
    }, [isChangeEmail]);

    useEffect(() => {
        if (!openChangeEmail) {
            const timeout = setTimeout(() => {
                setView(isChangeEmail ? "newEmail" : "confirmEmail");
                setIsChangeEmail(false);
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [openChangeEmail]);

    return (
        <Dialog open={openChangeEmail} onOpenChange={setOpenChangeEmail}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[440px] max-w-full xs:h-auto h-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-[#053E54] border-none [&>button]:hidden gap-0 block z-200">
                <DialogTitle className="text-white hidden">
                    Confirm email screens
                </DialogTitle>
                {/* Confirm Email Screen */}
                {view === "confirmEmail" && (
                    <ConfirmEmail
                        setNewEmail={setNewEmail}
                        openOtp={() => setView("confirmOtp")}
                        openNewEmail={() => setView("newEmail")}
                    />
                )}

                {/* Confirm Otp Screen */}
                {/* {view === "confirmOtp" && (
                    <ConfirmOtp
                        otpTimer={otpTimer}
                        setOtpTimer={setOtpTimer}
                        newEmail={newEmail}
                        goToConfirmEmail={() => setView("confirmEmail")}
                        goToNewEmail={() => setView('newEmail')}
                        verifiedEmail={() => setView("verifiedEmail")}
                    />
                )} */}

                {/* New Email Screen */}
                {view === "newEmail" && (
                    <NewEmail
                        newEmail={newEmail}
                        goBack={() => setView("confirmEmail")}
                        openOtp={() => setView("confirmOtp")}
                        setNewEmail={setNewEmail}
                        openChangeEmail={openChangeEmail}
                        isChangeEmail={isChangeEmail}
                        setOtpTimer={setOtpTimer}
                        setOpenChangeEmail={setOpenChangeEmail}
                    />
                )}

                {/* Verified Email Screen */}
                {view === "verifiedEmail" && (
                    <VerifiedEmail
                        setOpenChangeEmail={setOpenChangeEmail}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}