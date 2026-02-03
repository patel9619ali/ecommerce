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
                    <div className="sm:w-16 sm:h-16 w-14 h-14 rounded-xl border border-[#0A3549]/30 flex justify-center items-center">
                        <svg className="sm:!w-8 !w-6" width="38" height="43" viewBox="0 0 38 43" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.7425 0C12.5434 0 7.5 5.04336 7.5 11.2425C7.5 17.4415 12.5434 22.4849 18.7425 22.4849C24.9415 22.4849 29.9849 17.4415 29.9849 11.2425C29.9849 5.04336 24.9415 0 18.7425 0Z" />
                            <path d="M32.7252 29.8293C29.6473 26.7041 25.5669 24.983 21.2357 24.983H16.2391C11.908 24.983 7.82758 26.7041 4.74964 29.8293C1.68678 32.9392 0 37.0443 0 41.3886C0 42.0785 0.559291 42.6378 1.24916 42.6378H36.2257C36.9155 42.6378 37.4748 42.0785 37.4748 41.3886C37.4748 37.0443 35.7881 32.9392 32.7252 29.8293Z" />
                        </svg>
                    </div>

                    <button onClick={handleLogout} className="sm:hidden flex items-center sm:gap-4 gap-2 cursor-pointer ring-0 focus-visible:outline-none">
                        <div className="flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] bg-[#C8FFFA]">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.8 0C1.2536 0 0 1.2536 0 2.8V6.3H7.41006L5.80503 4.69498C5.53168 4.42161 5.53168 3.97839 5.80503 3.70502C6.07838 3.43166 6.52162 3.43166 6.79497 3.70502L9.59448 6.50454L9.59952 6.50965C9.66441 6.57566 9.71348 6.6514 9.74687 6.73204C9.78089 6.81401 9.79972 6.90375 9.8 6.9979V7V7.0021C9.79944 7.19222 9.72307 7.36456 9.59952 7.49035L9.59448 7.49546L6.79497 10.295C6.52162 10.5683 6.07838 10.5683 5.80503 10.295C5.53168 10.0216 5.53168 9.57838 5.80503 9.30503L7.41006 7.7H0V11.2C0 12.7464 1.2536 14 2.8 14H11.2C12.7464 14 14 12.7464 14 11.2V2.8C14 1.2536 12.7464 0 11.2 0H2.8Z" fill="#053E54" />
                            </svg>
                        </div>
                        <span className="sm:text-md text-[12px] text-[#053E54] font-semibold uppercase">Logout</span>
                    </button>
                    </div>
                    {/* <div className='cursor-pointer border-input has-data-[state=checked]:border-primary/50 relative flex items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                    <Switch id={id} className='cursor-pointer order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-3.5 data-[state=checked]:[&_span]:rtl:-translate-x-2.5' aria-describedby={`${id}-description`} checked={user?.isTwoFactorEnabled} disabled={isPending} onCheckedChange={handleTwoFactorToggle} />
                        <div className='flex grow gap-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width={22} height={22} viewBox="0 0 32 32" id="icon" >
                            <defs>
                                <style>{"\n      .cls-1 {\n        fill: none;\n      }\n    "}</style>
                            </defs>
                            <polygon points="11 23.18 9 21.179 7.589 22.589 11 26 17 20 15.59 18.59 11 23.18" />
                                <path d="M28,30H24V28h4V16H24V8a4.0045,4.0045,0,0,0-4-4V2a6.0067,6.0067,0,0,1,6,6v6h2a2.0021,2.0021,0,0,1,2,2V28A2.0021,2.0021,0,0,1,28,30Z" transform="translate(0 0)" />
                                <path d="M20,14H18V8A6,6,0,0,0,6,8v6H4a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V16A2,2,0,0,0,20,14ZM8,8a4,4,0,0,1,8,0v6H8ZM20,28H4V16H20Z" transform="translate(0 0)" />
                                <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className="cls-1" width={32} height={32} />
                        </svg>
                            <div className='grid grow gap-2'>
                            <Label htmlFor={id} className='text-[#000] font-[600] text-[14px]'>Two Factor Authentification</Label>
                            </div>
                        </div>
                    </div> */}
                    <CardSwitch
                        id={id}
                        label="Two Factor Authentication"
                        checked={user?.isTwoFactorEnabled || false}
                        disabled={isPending}
                        onChange={handleTwoFactorToggle}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={22} height={22} viewBox="0 0 32 32">
                                <polygon points="11 23.18 9 21.179 7.589 22.589 11 26 17 20 15.59 18.59 11 23.18" />
                                <path d="M28,30H24V28h4V16H24V8a4.0045,4.0045,0,0,0-4-4V2a6.0067,6.0067,0,0,1,6,6v6h2a2.0021,2.0021,0,0,1,2,2V28A2.0021,2.0021,0,0,1,28,30Z" />
                                <path d="M20,14H18V8A6,6,0,0,0,6,8v6H4a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V16A2,2,0,0,0,20,14ZM8,8a4,4,0,0,1,8,0v6H8ZM20,28H4V16H20Z" />
                            </svg>
                        }
                    />
                </div>

                <div className="flex justify-between items-center">
                    <div>
                            <>
                                <h2 className="sm:text-[23px] text-[14px] font-bold text-[#053E54] capitalize">
                                    {user?.name}
                                </h2>
                                <p className="sm:text-[16px] text-[12px] font-medium text-[#053E54] capitalize">Individual Account</p>
                            </>
                    </div>
                        
                    {/* Edit Button */}
                        <button
                            onClick={() => setOpenChangeName(true)}
                            className="flex items-center gap-2 sm:border sm:border-[#053E54] sm:px-6 sm:py-2 p-0 rounded-[20px] w-max sm:h-[50px] text-[#053E54] cursor-pointer ring-0 focus-visible:outline-none">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.04674 4.23529L0.8737 12.4225C0.572535 12.7247 0.3822 13.1201 0.333596 13.5444L0.00794516 16.4087C-0.0132826 16.6101 0.00814316 16.8138 0.0708234 17.0063C0.133504 17.1989 0.236028 17.376 0.371702 17.5262C0.507376 17.6764 0.673147 17.7962 0.85819 17.8778C1.04323 17.9595 1.24338 18.0011 1.44557 18H1.61237L4.47174 17.6738C4.89359 17.6249 5.28739 17.4374 5.59166 17.1407L13.7647 8.94552L9.04674 4.23529Z" />
                                <path d="M17.4314 2.70347L15.2942 0.56631C15.1155 0.386815 14.903 0.24439 14.669 0.147208C14.4351 0.0500262 14.1842 0 13.9309 0C13.6775 0 13.4267 0.0500262 13.1927 0.147208C12.9588 0.24439 12.7463 0.386815 12.5675 0.56631L10.5859 2.54789L15.4498 7.41177L17.4314 5.43019C17.6109 5.2514 17.7533 5.03894 17.8505 4.80498C17.9477 4.57101 17.9977 4.32017 17.9977 4.06683C17.9977 3.81349 17.9477 3.56264 17.8505 3.32868C17.7533 3.09472 17.6109 2.88225 17.4314 2.70347Z" />
                            </svg>
                            <span className="sm:text-[16px] text-[12px] font-semibold uppercase">Edit</span>
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