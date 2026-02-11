"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingLink from "@/components/Loader/LoadingLink";
import { Heart, User, Car } from "lucide-react";
import LogoutButton from "../LogOutButton/LogoutButton";
import Link from "next/link";

type ProfileDropdownProps = {
  user: any
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild className="!cursor-pointer">
        <Button
          variant="ghost"
          className="flex items-center md:gap-2 gap-0 !cursor-pointer !pointer-events-auto pl-0"
        >
          <div className="text-white bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] shadow-[0_4px_12px_-2px_rgba(104,71,235,0.3)] p-2 rounded-full !cursor-pointer !pointer-events-auto">
            <User size={18} />
          </div>

          <span className="pl-1 font-semibold text-sm text-[#000] !cursor-pointer !pointer-events-auto">
            {user.name.length > 10
              ? `${user.name.slice(0, 10)}...`
              : user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent className="w-56 bg-[#fff]" align="end">

        {/* User Info */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-[#000]">{user.name}</p>
          <p className="text-[14px] font-semibold text-[#0f0f0fc4]">{user.email}</p>
        </div>

        <DropdownMenuSeparator className="bg-[#c9c9c9] -mx-1 my-1 h-px"/>

        {/* Links */}
        <DropdownMenuItem asChild>
          <LoadingLink href="/user-profile/my-profile" className="text-[16px] font-semibold uppercase cursor-pointer flex gap-2 text-[#000]">
            <User size={22} /> My Profile
          </LoadingLink>
        </DropdownMenuItem>
<DropdownMenuSeparator className="bg-[#c9c9c9] -mx-1 my-1 h-px"/>
        {/* <DropdownMenuItem asChild>
          <Link href="/bookings" className="flex gap-2 text-[#000]">
            <Car size={16} /> My Bookings
          </Link>
        </DropdownMenuItem> */}

        <DropdownMenuItem asChild>
          <LoadingLink href="/wishlist" className="text-[16px] font-semibold uppercase cursor-pointer flex gap-2 text-[#000]">
            <Heart size={16} /> My Wishlist
          </LoadingLink>
        </DropdownMenuItem>
<DropdownMenuSeparator className="bg-[#c9c9c9] -mx-1 my-1 h-px"/>
        <DropdownMenuSeparator />

        {/* Logout */}
        <LogoutButton />

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
