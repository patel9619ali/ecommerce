// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft } from "lucide-react";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// import { changeEmail, sendEmailOtp, verifyEmailOtp } from "@/lib/api";
// import { useSession } from "next-auth/react";
// import { REGEXP_ONLY_DIGITS } from "input-otp"
// import useKeyboardAware from "@/lib/useKeyboardAware";
// import { useRequiredUser } from '@/hooks/useRequiredUser'

// type ConfirmOtpProps = {
//     goToConfirmEmail: () => void;
//     goToNewEmail: () => void;
//     otpTimer: number;
//     setOtpTimer: React.Dispatch<React.SetStateAction<number>>;
//     newEmail: string;
//     verifiedEmail: () => void;
// };

// export default function ConfirmOtp({ goToConfirmEmail, goToNewEmail, otpTimer, setOtpTimer, newEmail, verifiedEmail }: ConfirmOtpProps) {
//     const { user, isReady } = useRequiredUser();
//     const { update } = useSession();

//     const [otp, setOtp] = useState("");
//     const [errorMsg, setErrorMsg] = useState("");
//     const [resendingOtp, setResendingOtp] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const submitRef = useRef<HTMLDivElement>(null);
//     // Existing keyboard-aware hook
//     useKeyboardAware(submitRef, 16);
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         if (otpTimer <= 0) return;

//         const interval = setInterval(() => {
//             setOtpTimer((prev) => prev - 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [otpTimer]);
//     if (!isReady) return null;

//     const resendOtp = async () => {
//         setResendingOtp(true);
//         setOtp("");

//         const res = await sendEmailOtp(newEmail);
//         if (!res.status) {
//             setErrorMsg(res.message);
//             return;
//         }

//         setResendingOtp(false);
//         setOtpTimer(30);
//     };

//     // Handle Submit
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!otp) {
//             setErrorMsg("Please enter OTP");
//             return;
//         }

//         if (otp.length < 4) {
//             setErrorMsg("Please enter valid OTP");
//             return;
//         }

//         setErrorMsg("");

//         const emailToVerify = newEmail || user.emailId;
//         if (!emailToVerify) {
//             setErrorMsg("Email not found");
//             return;
//         }

//         setIsLoading(true);
//         const res = await verifyEmailOtp(
//             user.id,
//             emailToVerify,
//             Number(otp)
//         );

//         if (!res.status) {
//             setErrorMsg(res.message || "Invalid OTP");
//             return;
//         }
//         const changeEmailResponse = await changeEmail(user.id, emailToVerify);
//         if (!changeEmailResponse.status) {
//             setErrorMsg(changeEmailResponse.message || "Failed to change email");
//             return;
//         }

//         await update({
//             emailId: newEmail,
//             isEmailVerified: true,
//         });

//         // ✅ OTP verified successfully
//         setIsLoading(false);
//         verifiedEmail();
//     };


//     return (
//         <div className={`${isMounted ? "overflow-y-auto" : "overflow-y-hidden"} h-full`}>
//             <div className={`items-start relative h-[200px] flex xs:px-6 px-4 xs:py-5 py-2`}>
//                 <Button
//                     onClick={user.emailId ? goToConfirmEmail : goToNewEmail}
//                     className="text-white bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
//                     <ChevronLeft className="!w-8 !h-8" />
//                 </Button>
//                 <Image
//                     src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}assets/images/otp-vector.png`}
//                     width={1038}
//                     height={334}
//                     alt="Mobile phone"
//                     className="w-full absolute inset-0 cover mt-[19px]"
//                     unoptimized />
//             </div>

//             <div className="bg-white xs:px-6 px-4 xs:py-6 py-4 xs:h-auto h-full">
//                 <form onSubmit={handleSubmit} className="flex flex-col justify-between xs:h-auto h-full">
//                     <div>
//                         <div className="relative xs:text-start text-center">
//                             <h2 className="xs:text-[23px] text-md font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent mb-4 inline-block uppercase">
//                                 Confirm OTP
//                             </h2>
//                         </div>
//                         <div className="text-[#666666] xs:text-[18px] text-sm xs:text-start text-center">
//                             We have sent an OTP to your email address <br></br>
//                             <span className="text-[#053E54] font-semibold">{newEmail ? newEmail : user.emailId},</span> You will receive in <span className="text-[#053E54] font-semibold">30s</span>
//                         </div>
//                         <div className="mt-6">
//                             <InputOTP
//                                 onClick={() => setIsMounted(true)}
//                                 maxLength={4}
//                                 pattern={REGEXP_ONLY_DIGITS}
//                                 onChange={setOtp}
//                                 className="!w-full">
//                                 <InputOTPGroup className="flex justify-center gap-4 !w-full">
//                                     {[0, 1, 2, 3].map((i) => (
//                                         <InputOTPSlot
//                                             key={i}
//                                             index={i}
//                                             className="border border-[#C9C9C9] !rounded-[20px] w-[60px] h-[60px] text-[35px] font-semibold text-[#053E54] data-[active=true]:bg-[#C8FFFA] data-[active=true]:border-[#053E54] data-[active=true]:ring-0"
//                                         />
//                                     ))}
//                                 </InputOTPGroup>
//                             </InputOTP>
//                             {errorMsg && <p className="text-red-500 text-sm mt-2 text-center">{errorMsg}</p>}
//                         </div>
//                         <div className="text-[#666666] xs:text-[18px] text-sm xs:text-start text-center mt-4">
//                             Didn't Receive?{" "}
//                             <button
//                                 type="button"
//                                 disabled={otpTimer > 0 || resendingOtp}
//                                 onClick={resendOtp}
//                                 className="text-[#053E54] font-semibold disabled:opacity-50 hover:cursor-pointer"
//                             >
//                                 {resendingOtp ? 'Resending...' : otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend"}
//                             </button>
//                         </div>
//                     </div>
//                     <div className="sticky bottom-0 px-0 xs:pt-6 pt-4 xs:pb-0 pb-4 bg-white w-full" ref={submitRef}>
//                         <button
//                             type="submit"
//                             className="w-full h-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px]"
//                         >
//                             {isLoading ? 'Submitting...' : 'SUBMIT'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }