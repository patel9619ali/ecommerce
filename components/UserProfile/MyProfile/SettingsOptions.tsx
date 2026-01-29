"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Lock } from "lucide-react";
type SettingsOptionsProps = {
    setOpenPassword: (open: boolean) => void;
    setOpenChangePhone: (open: boolean) => void;
    setOpenChangeEmail: (open: boolean) => void;
    setIsChangeEmail: (isChange: boolean) => void;
}

export default function SettingsOptions({ setOpenPassword, setOpenChangePhone, setOpenChangeEmail, setIsChangeEmail }: SettingsOptionsProps) {
    const user = useCurrentUser();

    return (
        <aside className="lg:sticky lg:top-25 w-full h-max p-5 bg-white rounded-[20px] border border-[#C9C9C9] hidden md:block">
            <div className="first:pt-0 pt-5 pb-5 last:pb-0 border-b border-[#C9C9C9] last:border-0">
                <button
                    onClick={() => setOpenPassword(true)}
                    className="flex items-center gap-3 w-full cursor-pointer ring-0 focus-visible:outline-none">
                    <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
                        <Lock className="h-5 w-5 text-[#ff8000]" />
                    </div>
                    <span className="text-start text-md text-[#053E54] font-semibold">Change Password</span>
                </button>
            </div>
            
            <div className="first:pt-0 pt-5 pb-5 last:pb-0 border-b border-[#C9C9C9] last:border-0">
                { !user ? (
                    <Skeleton className="w-full h-6 rounded-md" />
                ) :
                    <button
                        onClick={() => {
                            setIsChangeEmail(true)
                            setOpenChangeEmail(true)
                        }}
                        className="flex items-center gap-3 w-full cursor-pointer ring-0 focus-visible:outline-none">
                        <div className="w-10 h-10 rounded-xl bg-[#fff2e5] flex items-center justify-center">
                            <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.2137 10.0197L12.7134 13.5266C12.6252 13.6074 12.5664 13.7176 12.5517 13.8352L12.2505 15.6206C12.1844 16.01 12.5224 16.3554 12.9191 16.2892L14.6972 15.988C14.8148 15.966 14.925 15.9072 15.0131 15.8264L18.5127 12.3268L16.2137 10.0197Z" fill="#ff8000" />
                                <path d="M20.0899 8.43485C19.458 7.80297 18.4294 7.80297 17.7901 8.43485L17.1406 9.08436L19.4389 11.39L20.0899 10.7346C20.7291 10.1027 20.7291 9.07407 20.0899 8.43485Z" fill="#ff8000" />
                                <path d="M10.5935 8.041C10.1835 8.282 9.71843 8.40911 9.24673 8.40911C8.77503 8.40911 8.3092 8.282 7.90142 8.04174L0 3.36217V11.8146C0 12.9094 0.889038 13.7984 1.9838 13.7984H11.218L11.2489 13.6148C11.293 13.2474 11.4987 12.8433 11.822 12.5494L14.8124 9.55163L16.6786 7.68539L16.8623 7.5017C17.3113 7.05278 17.88 6.77945 18.4935 6.68614V3.36217L10.5935 8.041Z" fill="#ff8000" />
                                <path d="M8.57464 6.90364C8.77816 7.0234 9.01107 7.08659 9.24839 7.08659C9.48572 7.08659 9.71863 7.0234 9.92362 6.9029L18.4804 1.83465C18.4025 0.810421 17.5547 0 16.5113 0H1.97812C0.932583 0 0.089834 0.807482 0.015625 1.83392L8.57464 6.90364Z" fill="#ff8000" />
                            </svg>
                        </div>
                        <span className="text-start text-md text-[#053E54] font-semibold ">
                            {user?.email ? "Change Email" : "Add Email"}
                        </span>
                    </button>
                }
            </div>
        </aside>
    );
}