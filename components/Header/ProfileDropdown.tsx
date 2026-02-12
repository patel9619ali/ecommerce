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
import { AvatarFallback,Avatar } from "../ui/avatar";

type ProfileDropdownProps = {
  user: any
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild className="!cursor-pointer">
        <Button variant="ghost" className="flex items-center md:gap-2 gap-0 !cursor-pointer !pointer-events-auto pl-0" >
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
      <DropdownMenuContent className="border-[#fff] w-64 p-0 bg-[#fff] border shadow-xl rounded-xl overflow-hidden z-[100]" align="end">
         <div className="p-4 bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] text-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-lg font-bold">{user.name.slice(0,1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-white/70">{user.email}</p>
            </div>
          </div>
        </div>


        {/* Links */}
        {/* <DropdownMenuItem asChild>
          <LoadingLink href="/user-profile/my-profile" className="text-[16px] font-semibold uppercase cursor-pointer flex gap-2 text-[#000]">
            <User size={22} /> 
            <div>
                <p className="font-medium text-sm">My Profile</p>
                <p className="text-xs text-[#64748b]">Manage your account</p>
            </div>
          </LoadingLink>
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild className="py-3 cursor-pointer hover:bg-gray-100 ">
          <LoadingLink href="/user-profile/my-profile" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                <User className="h-4 w-4" style={{ color: 'hsl(330 80% 55%)' }} />
              </div>
              <div>
                <p className="font-medium text-sm">My Profile</p>
                <p className="text-xs text-[#64748b]">Manage your account</p>
              </div>
          </LoadingLink>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator className="bg-[#c9c9c9] -mx-1 my-0 h-px"/> */}

        <DropdownMenuItem asChild className="py-3 cursor-pointer hover:bg-gray-100 ">
          <LoadingLink href="/wishlist" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                <Heart className="h-4 w-4" style={{ color: 'hsl(330 80% 55%)' }} />
              </div>
              <div>
                <p className="font-medium text-sm">My Wishlist</p>
                <p className="text-xs text-[#64748b]">Items you love</p>
              </div>
          </LoadingLink>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator className="bg-[#c9c9c9] -mx-1 my-0 h-px"/> */}
       

        {/* Logout */}
        <LogoutButton />

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
