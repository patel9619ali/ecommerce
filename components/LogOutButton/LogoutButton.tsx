"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-[16px] font-semibold uppercase cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-sm text-black rounded-md"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}
