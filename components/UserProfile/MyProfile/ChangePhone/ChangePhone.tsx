import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import CountryCodeSelector from "@/components/LoginSignUp/CountryCodeSelector";
import ConfirmOtp from "./ConfirmOtp";
// import VerifyingOtp from "@/components/LoginSignUp/VerifyingOtp";
import PhoneChanged from "./PhoneChanged";

type ChangePhoneProps = {
    openChangePhone: boolean;
    setOpenChangePhone: (open: boolean) => void;
    newcountryCode: string | undefined;
    setNewCountryCode: (newcountryCode: string) => void;
    newPhoneNumber: string;
    setNewPhoneNumber: (newPhoneNumber: string) => void;
}

export default function ChangePhone({ openChangePhone, setOpenChangePhone, newcountryCode, setNewCountryCode, newPhoneNumber, setNewPhoneNumber }: ChangePhoneProps) {
    const [view, setView] = useState<"changePhone" | "country" | "confirmOtp" | "verifying" | "phoneChanged">("changePhone");
    const [phoneError, setPhoneError] = useState("");
    const [otpTimer, setOtpTimer] = useState(30);
    const [errorOtpMsg, setErrorOtpMsg] = useState("");

    const handleSelect = (code: string) => {
        setNewCountryCode(code)
    };

    // useEffect(() => {
    //     if (!openChangePhone) {
    //         const timeout = setTimeout(() => {
    //             setView("changePhone");
    //             setNewCountryCode(user?.contactNo.split('-')[0] || '')
    //             setNewPhoneNumber("");
    //             setPhoneError("");
    //         }, 200);

    //         return () => clearTimeout(timeout);
    //     }
    // }, [openChangePhone]);

    return (
        <Dialog open={openChangePhone} onOpenChange={setOpenChangePhone}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className={`${view === 'country' ? 'grid' : 'block'} p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[440px] max-w-full xs:h-auto h-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-[#053E54] border-none [&>button]:hidden z-200`}>
                <DialogTitle className="text-white hidden">
                    Change Phone Number screens
                </DialogTitle>
                {/* Change Phone Screen */}
                {/* {view === "changePhone" && (
                    <NewPhone
                        countryCode={newcountryCode}
                        newPhoneNumber={newPhoneNumber}
                        phoneError={phoneError}
                        setPhoneError={setPhoneError}
                        setNewPhoneNumber={setNewPhoneNumber}
                        openCountrySelector={() => setView("country")}
                        openOtp={() => setView("confirmOtp")}
                    />
                )} */}

                {/* Country code selector */}
                {/* {view === "country" && (
                    <CountryCodeSelector
                        handleSelect={(code) => {
                            handleSelect(code);  // update value
                            setView("changePhone");    // go back after selection
                        }}
                        goBack={() => setView("changePhone")}
                    />
                )} */}

                {/* OTP confirmation */}
                {view === "confirmOtp" && (
                    <ConfirmOtp
                        otpTimer={otpTimer}
                        setOtpTimer={setOtpTimer}
                        errorOtpMsg={errorOtpMsg}
                        setErrorOtpMsg={setErrorOtpMsg}
                        goBack={() => setView("changePhone")}
                        invalidOtp={() => setView("confirmOtp")}
                        verifyingOtp={() => setView("verifying")}
                        newPhoneNumber={newPhoneNumber}
                        phoneChanged={() => setView("phoneChanged")}
                    />
                )}

                {/* OTP verifying */}
                {/* {view === "verifying" && (
                    <VerifyingOtp />
                )} */}

                {/* Phone Changed Screen */}
                {view === "phoneChanged" && (
                    <PhoneChanged
                        setOpenChangePhone={setOpenChangePhone}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}