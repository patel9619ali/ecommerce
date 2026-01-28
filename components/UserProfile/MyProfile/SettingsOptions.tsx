"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

type SettingsOptionsProps = {
    setOpenManageDocuments: (open: boolean) => void;
    setOpenChangePhone: (open: boolean) => void;
    setOpenChangeEmail: (open: boolean) => void;
    setIsChangeEmail: (isChange: boolean) => void;
}

export default function SettingsOptions({ setOpenManageDocuments, setOpenChangePhone, setOpenChangeEmail, setIsChangeEmail }: SettingsOptionsProps) {
    const user = useCurrentUser();

    return (
        <aside className="lg:sticky lg:top-25 w-full h-max p-5 bg-white rounded-[20px] border border-[#C9C9C9] hidden md:block">
            {/* <div className="first:pt-0 pt-5 pb-5 last:pb-0 border-b border-[#C9C9C9] last:border-0">
                <button
                    onClick={() => setOpenManageDocuments(true)}
                    className="flex items-center gap-3 w-full cursor-pointer ring-0 focus-visible:outline-none">
                    <div>
                        <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.1795 4.87571L10.9744 0.784539C10.4615 0.297503 9.7436 0.00527325 8.9231 0.00527325H2.8718C1.33333 -0.0921398 0 1.17418 0 2.63531V16.2725C0 17.7337 1.23077 19 2.8718 19H13.1282C14.6667 19 16 17.8311 16 16.2725V6.72649C16 6.04462 15.6923 5.36276 15.1795 4.87571ZM4.92308 7.70061H8C8.4103 7.70061 8.8205 7.99283 8.8205 8.47989C8.8205 8.96686 8.5128 9.25908 8 9.25908H4.92308C4.51282 9.25908 4.10256 8.96686 4.10256 8.47989C4.10256 7.99283 4.51282 7.70061 4.92308 7.70061ZM11.0769 13.1555H4.92308C4.51282 13.1555 4.10256 12.8633 4.10256 12.3762C4.10256 11.8892 4.41026 11.5969 4.92308 11.5969H11.0769C11.4872 11.5969 11.8974 11.8892 11.8974 12.3762C11.8974 12.8633 11.4872 13.1555 11.0769 13.1555Z" fill="#053E54" />
                        </svg>
                    </div>
                    <span className="text-start text-md text-[#053E54] font-semibold">Manage Documents</span>
                </button>
            </div> */}
            <div className="first:pt-0 pt-5 pb-5 last:pb-0 border-b border-[#C9C9C9] last:border-0">
                <button
                    onClick={() => setOpenChangePhone(true)}
                    className="flex items-center gap-3 w-full cursor-pointer ring-0 focus-visible:outline-none">
                    <div>
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9714 17.8286H8.22857C7.68298 17.8286 7.15974 17.6118 6.77395 17.226C6.38816 16.8403 6.17143 16.317 6.17143 15.7714V13.0286C6.17066 12.7583 6.22354 12.4906 6.32701 12.241C6.43047 11.9913 6.58246 11.7647 6.77417 11.5742L15.0027 3.3456C15.0281 3.31954 15.059 3.30171 15.0857 3.27703V2.27314C15.085 1.67049 14.8453 1.09273 14.4191 0.66659C13.993 0.24045 13.4152 0.000725869 12.8126 0H2.27314C1.67049 0.000725869 1.09273 0.24045 0.66659 0.66659C0.24045 1.09273 0.000725869 1.67049 0 2.27314V18.2983C0.000725869 18.9009 0.24045 19.4787 0.66659 19.9048C1.09273 20.331 1.67049 20.5707 2.27314 20.5714H12.8126C13.4152 20.5707 13.993 20.331 14.4191 19.9048C14.8453 19.4787 15.085 18.9009 15.0857 18.2983V14.5659L12.4258 17.2258C12.2353 17.4175 12.0087 17.5695 11.7591 17.673C11.5094 17.7765 11.2417 17.8293 10.9714 17.8286ZM5.48571 2.74286C5.48571 2.56099 5.55796 2.38658 5.68656 2.25798C5.81515 2.12939 5.98957 2.05714 6.17143 2.05714H8.91429C9.09615 2.05714 9.27056 2.12939 9.39916 2.25798C9.52776 2.38658 9.6 2.56099 9.6 2.74286C9.6 2.92472 9.52776 3.09913 9.39916 3.22773C9.27056 3.35633 9.09615 3.42857 8.91429 3.42857H6.17143C5.98957 3.42857 5.81515 3.35633 5.68656 3.22773C5.55796 3.09913 5.48571 2.92472 5.48571 2.74286Z" fill="#053E54" />
                            <path d="M19.6919 7.05807L16.9491 4.31521C16.8205 4.18666 16.6461 4.11444 16.4643 4.11444C16.2825 4.11444 16.1081 4.18666 15.9795 4.31521L14.75 5.54469L18.4625 9.25715L19.6919 8.02767C19.8205 7.89908 19.8927 7.72469 19.8927 7.54287C19.8927 7.36104 19.8205 7.18666 19.6919 7.05807Z" fill="#053E54" />
                            <path d="M7.73998 12.5438C7.61137 12.6723 7.5391 12.8467 7.53906 13.0286V15.7714C7.53906 15.9533 7.61131 16.1277 7.7399 16.2563C7.8685 16.3849 8.04291 16.4571 8.22478 16.4571H10.9676C11.1495 16.4571 11.3239 16.3848 11.4524 16.2562L17.4819 10.2267L13.7695 6.51428L7.73998 12.5438Z" fill="#053E54" />
                        </svg>
                    </div>
                    <span className="text-start text-md text-[#053E54] font-semibold ">Change Phone Number</span>
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
                        <div>
                            <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.2137 10.0197L12.7134 13.5266C12.6252 13.6074 12.5664 13.7176 12.5517 13.8352L12.2505 15.6206C12.1844 16.01 12.5224 16.3554 12.9191 16.2892L14.6972 15.988C14.8148 15.966 14.925 15.9072 15.0131 15.8264L18.5127 12.3268L16.2137 10.0197Z" fill="#053E54" />
                                <path d="M20.0899 8.43485C19.458 7.80297 18.4294 7.80297 17.7901 8.43485L17.1406 9.08436L19.4389 11.39L20.0899 10.7346C20.7291 10.1027 20.7291 9.07407 20.0899 8.43485Z" fill="#053E54" />
                                <path d="M10.5935 8.041C10.1835 8.282 9.71843 8.40911 9.24673 8.40911C8.77503 8.40911 8.3092 8.282 7.90142 8.04174L0 3.36217V11.8146C0 12.9094 0.889038 13.7984 1.9838 13.7984H11.218L11.2489 13.6148C11.293 13.2474 11.4987 12.8433 11.822 12.5494L14.8124 9.55163L16.6786 7.68539L16.8623 7.5017C17.3113 7.05278 17.88 6.77945 18.4935 6.68614V3.36217L10.5935 8.041Z" fill="#053E54" />
                                <path d="M8.57464 6.90364C8.77816 7.0234 9.01107 7.08659 9.24839 7.08659C9.48572 7.08659 9.71863 7.0234 9.92362 6.9029L18.4804 1.83465C18.4025 0.810421 17.5547 0 16.5113 0H1.97812C0.932583 0 0.089834 0.807482 0.015625 1.83392L8.57464 6.90364Z" fill="#053E54" />
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