"use client";

import { Card } from "@/components/ui/card";
import { signOut } from "next-auth/react";

export default function Logout() {
    const handleLogout = async () => {
        await signOut({
            redirect: true,
        })
    }
    return (
        <Card className="sm:block hidden p-6 gap-0 shadow-none bg-[#ffffff50] rounded-[20px] border border-[#C9C9C9]">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[19px] font-semibold text-[#053E54]">
                    Need to logout?
                </h2>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 cursor-pointer ring-0 focus-visible:outline-none">
                    <div className="flex items-center justify-center text-[#053E54] w-8 h-8 rounded-[10px] bg-[#C8FFFA]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.8 0C1.2536 0 0 1.2536 0 2.8V6.3H7.41006L5.80503 4.69498C5.53168 4.42161 5.53168 3.97839 5.80503 3.70502C6.07838 3.43166 6.52162 3.43166 6.79497 3.70502L9.59448 6.50454L9.59952 6.50965C9.66441 6.57566 9.71348 6.6514 9.74687 6.73204C9.78089 6.81401 9.79972 6.90375 9.8 6.9979V7V7.0021C9.79944 7.19222 9.72307 7.36456 9.59952 7.49035L9.59448 7.49546L6.79497 10.295C6.52162 10.5683 6.07838 10.5683 5.80503 10.295C5.53168 10.0216 5.53168 9.57838 5.80503 9.30503L7.41006 7.7H0V11.2C0 12.7464 1.2536 14 2.8 14H11.2C12.7464 14 14 12.7464 14 11.2V2.8C14 1.2536 12.7464 0 11.2 0H2.8Z" fill="#053E54" />
                        </svg>
                    </div>
                    <span className="text-md text-[#053E54] font-semibold uppercase">Logout</span>
                </button>
            </div>
        </Card>
    );
}