"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLoading } from "@/context/LoadingContext";

export default function LogoutButton() {
  const { setLoading } = useLoading();

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
    // Loading will automatically hide when navigation completes
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[16px] font-semibold uppercase cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-sm text-black rounded-md hover:bg-gray-100 transition-colors"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}