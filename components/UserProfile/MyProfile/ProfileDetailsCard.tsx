"use client";
import { useId,useState } from 'react'
import { Card } from "@/components/ui/card";
import { Label } from '@/components/ui/label'
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Switch } from "@/components/ui/switch"
import { updateSetting } from "@/actions/settings";
import { useTransition } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CardSwitch } from './CardSwitch';
import { AvatarFallback,Avatar } from "@/components/ui/avatar";
import { LogOut, Pencil, Shield } from 'lucide-react';
type ProfileDetailsCardProps = {
    setOpenChangeName: (open: boolean) => void;
    setOpenChangeEmail: (open: boolean) => void;
    setManageOpen: (open: boolean) => void;
};

export default function ProfileDetailsCard({ setOpenChangeName, setOpenChangeEmail, setManageOpen }: ProfileDetailsCardProps) {
    const id = useId()
    const [checked, setChecked] = useState(true);
    const user = useCurrentUser();
    const [isPending, startTransition] = useTransition();
    const { update } = useSession();
    const handleTwoFactorToggle = (checked: boolean) => {
    startTransition(() => {
        updateSetting({ isTwoFactorEnabled: checked })
        .then((res) => {
            if (res?.error) {
            toast.error(res.error);
            }
            if (res?.success) {
            update();
            toast.success(res.success);
            }
        });
    });
    };
    //   Handle Logout
    const handleLogout = async () => {
        await signOut({
            redirect: true,
        })
    }

    return (
        <Card className="p-6 gap-0 shadow-none bg-white rounded-[20px] border border-[#C9C9C9]">
            <div className="flex flex-col gap-y-4">
                {/* Left Profile Info */}
                <div className="flex items-center justify-between flex-col sm:flex-row  gap-4">
                    <div className="flex items-center justify-between text-[#053E54] sm:w-auto w-full">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mr-5 sm:mb-0 mb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2" style={{ borderColor: '#8c3cdd' }}>
                                        <AvatarFallback className="bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] shadow-[0_4px_12px_-2px_rgba(104,71,235,0.3)] text-white text-xl font-bold">{user?.name?.slice(0,1)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>

                          
                            <button onClick={handleLogout} className="flex items-center sm:hidden  cursor-pointer ring-0 focus-visible:outline-none rounded-[8px] gap-1 border-0 shadow-sm border-[#ef4444] bg-[#ef4444] px-3 py-2 hover:bg-[#ef4444e6]">
                                <LogOut className="h-4 w-4 text-[#f8fafc]" />
                                <span className="text-[10px] text-[#f8fafc] font-semibold uppercase">Logout</span>
                            </button>


                        </div>
                            <div>
                                <h2 className="sm:text-[23px] text-[16px] font-bold text-[#000] capitalize"> {user?.name} </h2>
                                <p className="sm:text-[16px] text-[16px] font-medium text-[#64748b] capitalize">Individual Account</p>
                                <div className='flex gap-2 items-center sm:mt-2 mt-5'>
                                    <Shield className="h-4 w-4 text-[#64748b]" />
                                    <CardSwitch id={id} label="2FA" checked={user?.isTwoFactorEnabled || false} disabled={isPending} onChange={handleTwoFactorToggle} />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpenChangeName(true)} className="flex items-center gap-2 sm:border sm:px-3 sm:py-2 text-[#000] cursor-pointer ring-0 focus-visible:outline-none ring-offset-[#fafafa] text-[12px] hover:bg-[#e8308c] hover:text-[#fff] transition-colors md:border-[#e2e8f0] rounded-[12px] bg-[#fafafa] border-[#e2e8f0] sm:w-[150px] w-full p-3 justify-center">
                            <Pencil className="h-4 w-4 hover:text-[#fff]" /> 
                            <span className="sm:text-[12px] text-[12px] font-semibold uppercase  hover:text-[#fff]">Edit Profile</span>
                        </button>
                </div>

              
            </div>

            {/* Divider */}
            <div className="sm:my-5 my-4 border-t border-[#C9C9C9]" />

            {/* Phone Section */}
            <div>
                <p className="sm:text-[16px] text-[14px] font-semibold text-[#666666] mb-1">PHONE</p>
                
                    <div className="flex items-center gap-2 text-[#053E54] font-semibold text-[15px]">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.2699 1H9.72989C8.22278 1.00173 7.0015 2.23888 7 3.76557V24.2346C7.0015 25.7613 8.22278 26.9985 9.72989 27H18.2699C19.777 26.9985 20.9983 25.7613 21 24.2346V3.76557C20.9983 2.23888 19.777 1.00173 18.2699 1ZM14 24.6365C13.3555 24.6365 12.8332 24.1074 12.8332 23.4545C12.8332 22.8019 13.3555 22.2728 14 22.2728C14.6443 22.2728 15.1666 22.8019 15.1666 23.4545C15.1666 24.1074 14.6443 24.6365 14 24.6365ZM15.75 4.54546H12.25C11.9279 4.54546 11.6666 4.28081 11.6666 3.95448C11.6666 3.62815 11.9279 3.36371 12.25 3.36371H15.75C16.0721 3.36371 16.3332 3.62815 16.3332 3.95448C16.3332 4.28081 16.0721 4.54546 15.75 4.54546Z" />
                        </svg>

                        <span className="text-[#053E54] sm:text-[19px] text-[14px] font-semibold">Contact Info will come here</span>
                        <div className="sm:w-6 sm:h-6 w-4 h-4 rounded-full bg-[#057C72] flex items-center justify-center">
                            <svg className="sm:w-3 sm:h-3 w-2 h-2" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
            </div>

            {/* Divider */}
            {(user?.email) && (
                <div className="sm:my-5 my-4 border-t border-[#C9C9C9]" />
            )}

            {/* Email Section */}
            {user?.email && (
                <div className="flex lg:flex-row flex-col justify-between items-start">
                    <div className="lg:mb-0 mb-4">
                        <p className="sm:text-[16px] text-[14px] font-semibold text-[#666666] mb-1">
                            EMAIL ADDRESS
                        </p>

                        <div className="flex items-center gap-3 mb-1">
                            <svg
                                width="23"
                                height="17"
                                viewBox="0 0 23 17"
                                fill="#053E54"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12.1653 11.3778C11.9481 11.5136 11.7037 11.5679 11.4864 11.5679C11.2692 11.5679 11.0248 11.5136 10.8076 11.3778L0 4.77924V13.5502C0 15.4239 1.52066 16.9445 3.39433 16.9445H19.6057C21.4793 16.9445 23 15.4239 23 13.5502V4.77924L12.1653 11.3778Z" />
                                <path d="M19.6064 0H3.39509C1.79296 0 0.435231 1.1405 0.109375 2.66116L11.5143 9.61275L22.8921 2.66116C22.5663 1.1405 21.2085 0 19.6064 0Z" />
                            </svg>

                            <span className="text-[#053E54] sm:text-[19px] text-[14px] font-semibold">
                                {user.email}
                            </span>

                            {/* {user.isEmailVerified && (
                                <div className="sm:w-6 sm:h-6 w-4 h-4 rounded-full bg-[#057C72] flex items-center justify-center">
                                    <svg className="sm:w-3 sm:h-3 w-2 h-2" viewBox="0 0 14 10">
                                        <path
                                            d="M1 5L5 9L13 1"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            )} */}
                        </div>

                        {/* {!user.isEmailVerified && (
                            <p className="sm:text-[18px] text-[14px] text-[#FF0000]">
                                This email address is not verified. Please verify
                            </p>
                        )} */}
                    </div>

                    {/* {!user.isEmailVerified && (
                        <button
                            onClick={() => setOpenChangeEmail(true)}
                            className="lg:w-max w-full bg-[#C8FFFA] border border-[#053E54] px-4 py-2 sm:text-[19px] text-[15px] rounded-[20px] font-semibold text-[#053E54] cursor-pointer"
                        >
                            VERIFY EMAIL
                        </button>
                    )} */}
                </div>
            )}

            {/* Manage Button for small screens */}
            <div className="pt-4 mt-5 md:hidden border-t border-[#C9C9C9]">
                <button
                    onClick={() => setManageOpen(true)}
                    className="w-full flex gap-3 items-center justify-center cursor-pointer ring-0 focus-visible:outline-none">
                    <div className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#053E54]"></span>
                        <span className="w-1 h-1 rounded-full bg-[#053E54]"></span>
                        <span className="w-1 h-1 rounded-full bg-[#053E54]"></span>
                    </div>
                    <span className="text-[#053E54] text-[14px] font-bold uppercase">MANAGE</span>
                </button>
            </div>
        </Card >
    );
}