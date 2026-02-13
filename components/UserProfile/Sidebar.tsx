"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import LoadingLink from "@/components/Loader/LoadingLink";
export default function Sidebar() {
    const pathname = usePathname();
    return (
        <>
            <aside className="md:block hidden md:sticky md:top-25 w-full h-max p-5 bg-white rounded-[20px] border border-[#C9C9C9]">
                {/* Profile Section */}
                <h2 className="text-[#000] text-[19px] font-bold mb-2">Profile</h2>
                <LoadingLink href={`/user-profile/my-profile`}
                    className={`flex items-center gap-3 ${pathname === "/user-profile/my-profile" ? "bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] hover:bg-[#fff] transition-colors" : "rounded-[20px] border border-[#C9C9C9]"} px-4 py-3 rounded-[20px] mb-3`} >
                    <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px]`}>
                        <svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/user-profile/my-profile" ? "text-[#fff]" : ""}`}>
                            <path d="M7.08984 0C4.74424 0 2.83594 1.9083 2.83594 4.2539C2.83594 6.5995 4.74424 8.5078 7.08984 8.5078C9.43544 8.5078 11.3437 6.5995 11.3437 4.2539C11.3437 1.9083 9.43544 0 7.08984 0Z" />
                            <path d="M12.3825 11.2867C11.2179 10.1042 9.67397 9.453 8.03515 9.453H6.14452C4.50573 9.453 2.96179 10.1042 1.79716 11.2867C0.638243 12.4635 0 14.0167 0 15.6605C0 15.9216 0.211624 16.1332 0.472656 16.1332H13.707C13.968 16.1332 14.1797 15.9216 14.1797 15.6605C14.1797 14.0167 13.5414 12.4635 12.3825 11.2867Z" />
                        </svg>
                    </div>
                    <span className={`${pathname === "/user-profile/my-profile" ? "text-[#fff]" : ""} text-[16px] font-semibold uppercase whitespace-nowrap`}>My Profile</span>
                </LoadingLink>

                <Card className="rounded-[20px] py-0 shadow-none border-none">
                    <CardContent className="p-0">

                        <LoadingLink
                            href={`/user-profile/wishlist`}
                            className={`flex items-center gap-3 ${pathname === "/user-profile/wishlist" ? "bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] hover:bg-[#fff] transition-colors" : "rounded-[20px] border border-[#C9C9C9]"} px-4 py-3 rounded-[20px] mb-3 `}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] ${pathname === "/user-profile/wishlist" ? "" : ""}`}>
                                <svg width="20" height="16" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/user-profile/wishlist" ? "text-[#ff0000]" : ""}`}>
                                    <path d="M7.99999 13C7.91905 13 7.83815 12.9804 7.76565 12.941C7.6869 12.8983 5.81594 11.8778 3.91813 10.3401C2.79332 9.42874 1.89545 8.52482 1.24951 7.65348C0.413642 6.52597 -0.00670047 5.44143 8.07524e-05 4.42997C0.00801823 3.25302 0.456735 2.14617 1.26367 1.31329C2.08423 0.466377 3.17929 0 4.34719 0C5.84397 0 7.21243 0.787669 8.00002 2.03543C8.78761 0.787698 10.1561 0 11.6529 0C12.7562 0 13.8089 0.420814 14.6172 1.18494C15.5042 2.02348 16.0082 3.2083 15.9999 4.43555C15.9931 5.44525 15.5649 6.52814 14.7272 7.6541C14.0792 8.525 13.1826 9.42851 12.0622 10.3396C10.1713 11.8772 8.3138 12.8977 8.23565 12.9403C8.1628 12.9801 8.08137 13 7.99999 13Z" />
                                </svg>
                            </div>
                            <span className={`${pathname === "/user-profile/wishlist" ? "text-[#fff]" : ""} text-[16px] font-semibold uppercase whitespace-nowrap`}>My Wishlist</span>
                        </LoadingLink>
                    </CardContent>
                </Card>
            </aside>

            {/* Mobile sidebar */}
            <div className="md:hidden block w-full h-max p-4 bg-white rounded-[10px] border border-[#C9C9C9] mb-4">
                {/* Profile Section */}
                <h2 className="text-[#000] text-[17px] font-bold mb-2">Profile</h2>
                <LoadingLink href={`/user-profile/my-profile`}
                    className={`flex items-center gap-3 ${pathname === "/user-profile/my-profile" ? "bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] hover:bg-[#fff] transition-colors" : "rounded-[20px] border border-[#C9C9C9]"} px-3 py-3 rounded-[10px] mb-3`} >
                    <div className={`flex items-center justify-center text-[#053E54] w-6 h-6 rounded-[10px]`}>
                        <svg width="13" height="15" viewBox="0 0 15 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/user-profile/my-profile" ? "text-[#fff]" : ""}`}>
                            <path d="M7.08984 0C4.74424 0 2.83594 1.9083 2.83594 4.2539C2.83594 6.5995 4.74424 8.5078 7.08984 8.5078C9.43544 8.5078 11.3437 6.5995 11.3437 4.2539C11.3437 1.9083 9.43544 0 7.08984 0Z" />
                            <path d="M12.3825 11.2867C11.2179 10.1042 9.67397 9.453 8.03515 9.453H6.14452C4.50573 9.453 2.96179 10.1042 1.79716 11.2867C0.638243 12.4635 0 14.0167 0 15.6605C0 15.9216 0.211624 16.1332 0.472656 16.1332H13.707C13.968 16.1332 14.1797 15.9216 14.1797 15.6605C14.1797 14.0167 13.5414 12.4635 12.3825 11.2867Z" />
                        </svg>
                    </div>
                    <span className={`${pathname === "/user-profile/my-profile" ? "text-[#fff]" : ""} text-[12px] font-semibold uppercase whitespace-nowrap`}>My Profile</span>
                </LoadingLink>

                <Card className="rounded-[10px] py-0 shadow-none border-none">
                    <CardContent className="p-0">

                        <LoadingLink
                            href={`/user-profile/wishlist`}
                            className={`flex items-center gap-3 ${pathname === "/user-profile/wishlist" ? "bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] hover:bg-[#fff] transition-colors" : "rounded-[10px] border border-[#C9C9C9]"} px-3 py-3 rounded-[10px] mb-2 `}
                        >
                            <div className={`flex items-center justify-center text-[#053E54] w-6 h-6 rounded-[10px] ${pathname === "/user-profile/wishlist" ? "" : ""}`}>
                                <svg width="20" height="16" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/user-profile/wishlist" ? "text-[#ff0000]" : ""}`}>
                                    <path d="M7.99999 13C7.91905 13 7.83815 12.9804 7.76565 12.941C7.6869 12.8983 5.81594 11.8778 3.91813 10.3401C2.79332 9.42874 1.89545 8.52482 1.24951 7.65348C0.413642 6.52597 -0.00670047 5.44143 8.07524e-05 4.42997C0.00801823 3.25302 0.456735 2.14617 1.26367 1.31329C2.08423 0.466377 3.17929 0 4.34719 0C5.84397 0 7.21243 0.787669 8.00002 2.03543C8.78761 0.787698 10.1561 0 11.6529 0C12.7562 0 13.8089 0.420814 14.6172 1.18494C15.5042 2.02348 16.0082 3.2083 15.9999 4.43555C15.9931 5.44525 15.5649 6.52814 14.7272 7.6541C14.0792 8.525 13.1826 9.42851 12.0622 10.3396C10.1713 11.8772 8.3138 12.8977 8.23565 12.9403C8.1628 12.9801 8.08137 13 7.99999 13Z" />
                                </svg>
                            </div>
                            <span className={`${pathname === "/user-profile/wishlist" ? "text-[#fff]" : ""} text-[12px] font-semibold uppercase whitespace-nowrap`}>My Wishlist</span>
                        </LoadingLink>
                    </CardContent>
                </Card>
            
            </div>
        </>
    );
}