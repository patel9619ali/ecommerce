"use client";

import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Logout() {
    const handleLogout = async () => {
        await signOut({
            redirect: true,
        })
    }
    return (
        <Card className="sm:block hidden px-6 py-4 gap-0 shadow-none bg-[#ffffff50] rounded-[20px] border border-[#C9C9C9]">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[17px] font-semibold text-[#000]">
                    Need to logout?
                </h2>
                <button onClick={handleLogout} className="flex items-center cursor-pointer ring-0 focus-visible:outline-none rounded-[10px] gap-1 border-0 shadow-sm border-[#ef4444] bg-[#ef4444] px-4 py-3 hover:bg-[#ef4444e6]">
                    <LogOut className="h-4 w-4 text-[#f8fafc]" />
                    <span className="text-[12px] text-[#f8fafc] font-semibold uppercase">Logout</span>
                </button>
            </div>
        </Card>
    );
}