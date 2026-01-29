// 'use client'

// import { useState, useEffect,useTransition } from "react";
// import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
// import { useForm } from "react-hook-form";
// import {
//     Dialog,
//     DialogContent,
//     DialogClose,
//     DialogTitle
// } from "@/components/ui/dialog";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import { FormError } from "@/components/auth/FormError";
// import { FormSuccess } from "@/components/auth/FormSuccess";
// import { updateSetting } from "@/actions/settings";
// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator/PasswordStrengthIndicator";
// import { Label } from "radix-ui";
// import { Input } from "@/components/ui/input";
// type ChangePasswordProps = {
//     openPassword: boolean;
//     setOpenPassword: (open: boolean) => void;
// };

// type FormValues = {
//     name: string;
// };

// export default function ChangePassword({
//     openPassword,
//     setOpenPassword
// }: ChangePasswordProps) {
//     const [view, setView] = useState<"changeName" | "changeNameSuccess">("changeName");
//     const [error, setError] = useState<string | undefined>();
//     const [success, setSuccess] = useState<string | undefined>();
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//         reset,
//     } = useForm<FormValues>({
//         defaultValues: {
//             name: "",
//         },
//     });
//     // const password = watch("password");



//     useEffect(() => {
//         if (!openPassword) {
//             const timeout = setTimeout(() => {
//                 setView("changeName");
//             }, 200);

//             return () => clearTimeout(timeout);
//         }
//     }, [openPassword]);
//     const [isPending, startTransition] = useTransition();
// const onSubmit = (values: FormValues) => {
//   setError(undefined);
//   setSuccess(undefined);

//   if (values.password !== values.confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }

//   startTransition(() => {
//     updatePassword(values.password)
//       .then((res) => {
//         if (res?.error) {
//           setError(res.error);
//         }

//         if (res?.success) {
//           setSuccess(res.success);
//           setView("changeNameSuccess");
//         }
//       })
//       .catch(() => setError("Something went wrong"));
//   });
// };



//     // if (!isReady) {
//     //     return null;
//     // }

//     return (
//         <Dialog open={openPassword} onOpenChange={setOpenPassword}>
//             <DialogContent
//                 onInteractOutside={(e) => e.preventDefault()}
//                 onEscapeKeyDown={(e) => e.preventDefault()}
//                 className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[440px] max-w-full xs:h-auto h-full bg-[#053E54] border-none [&>button]:hidden gap-0 block z-200"
//             >
//                 {view === "changeName" && (
//                     <>
//                         <div className="flex items-center justify-between xs:px-6 px-4 xs:py-8 py-3">
//                             <DialogTitle className="text-white">
//                                 Change Password
//                             </DialogTitle>
//                             <DialogClose className="text-white">
//                                 <X size={30} />
//                             </DialogClose>
//                         </div>

//                         <div className="bg-white xs:px-6 px-4 xs:py-6 py-4 h-full">
//                             <div className="flex flex-col justify-between h-full">
//                             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                                 {!success ? (
//                                     <>
//                                     <div className="space-y-2">
//                                         <label className="text-black/80 text-[15px] mb-1 block" htmlFor="password">
//                                         New Password
//                                         </label>
//                                         <div className="relative">
//                                         <Input
//                                             id="password"
//                                             type={showPassword ? "text" : "password"}
//                                             placeholder="Enter new password"
//                                             {...register("password", {
//                                             required: "Password is required",
//                                             minLength: {
//                                                 value: 8,
//                                                 message: "Password must be at least 8 characters",
//                                             },
//                                             })}
//                                             disabled={isPending}
//                                             className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#000]/60 hover:text-[#000]"
//                                         >
//                                             {showPassword ? (
//                                             <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                             <Eye className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                         </div>
//                                         {errors.password && (
//                                         <p className="text-sm text-[#ff0000]">{errors.password.message}</p>
//                                         )}
//                                         <PasswordStrengthIndicator password={password} />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label className="text-black/80 text-[15px] mb-1 block" htmlFor="confirmPassword">
//                                         Confirm Password
//                                         </Label>
//                                         <div className="relative">
//                                         <Input
//                                             id="confirmPassword"
//                                             type={showConfirmPassword ? "text" : "password"}
//                                             placeholder="Confirm new password"
//                                             {...register("confirmPassword", {
//                                             required: "Please confirm your password",
//                                             validate: (value) =>
//                                                 value === password || "Passwords do not match",
//                                             })}
//                                             disabled={isPending}
//                                             className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                             className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#000]/60 hover:text-[#000]"
//                                         >
//                                             {showConfirmPassword ? (
//                                             <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                             <Eye className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                         </div>
//                                         {errors.confirmPassword && (
//                                         <p className="text-sm text-[#ef4444]">{errors.confirmPassword.message}</p>
//                                         )}
//                                     </div>

//                                     {error && <FormError message={error} />}

//                                     <Button
//                                         type="submit"
//                                         className="cursor-pointer w-full h-11"
//                                         variant="auth"
//                                         disabled={isPending}
//                                     >
//                                         {isPending ? (
//                                         <>
//                                             <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#000000]" />
//                                             Resetting...
//                                         </>
//                                         ) : (
//                                         "Update Password"
//                                         )}
//                                     </Button>
//                                     </>
//                                 ) : (
//                                     <div className="space-y-4 text-[#000000]">
//                                     <FormSuccess message={success} />
//                                     <p className="text-center text-sm text-[#000000]">
//                                         Your password has been updated. You can now sign in with your new password.
//                                     </p>
//                                     </div>
//                                 )}
//                                 </div>
//                             </form>
//                         </div>
//                     </>
//                 )}

//                 {view === "changeNameSuccess" && (
//                     <>
//                         <div className="flex items-center justify-center py-10">
//                             <div className="w-[92px] h-[92px] flex items-center justify-center border border-[3px] border-[#053E5433] bg-[#C8FFFA] rounded-full">
//                                 <Check size={50} color="#057C72" />
//                             </div>
//                         </div>

//                         <div className="bg-white px-6 py-4 h-full flex flex-col justify-between">
//                             <div>
//                                 <h2 className="text-md xs:text-[23px] font-bold bg-gradient-to-r from-[#053E54] to-[#057C72] bg-clip-text text-transparent xs:mb-4 inline-block">Changed</h2>
//                                 <p className="text-[#666666] mt-2 xs:text-[18px] text-sm font-400 xs:text-start text-center">Your name has been changed Successfully.</p>
//                             </div>

//                             <div className="sticky bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
//                                 <button 
//                                     onClick={() => setOpenPassword(false)}
//                                     className="w-full h-[50px] bg-[#053E54] rounded-[20px] text-white font-semibold text-[19px] cursor-pointer"
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </DialogContent>
//         </Dialog>
//     );
// }
