"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import LoadingLink from "../Loader/LoadingLink"
const menuItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Shop", href: "/products/blend-ras-portable-juicer", icon: "🛍️" },
  { label: "My Orders", href: "/my-orders", icon: "📦" },
  { label: "About Us", href: "#", icon: "ℹ️" },
  { label: "How It Works", href: "#", icon: "⚡" },
  { label: "FAQs", href: "#", icon: "❓" },
  { label: "Contact Us", href: "#", icon: "📧" },
];

const quickLinks = [
  { label: "Track Order", href: "#",icon: "📦" },
  { label: "Warranty & Support", href: "#",icon: "🛡️" },
  { label: "Shipping Policy", href: "#",icon: "🚚" },
  { label: "Return Policy", href: "#",icon: "↩️" },
];
interface NavSheetDrawerProps {
  className?: string
  classNameSubTitle?: string
}

const HamBurger = (
  <svg width="21" height="16" viewBox="0 0 21 16" fill="none"  className="dark:text-black dark:!stroke-black">
    <path d="M1.25 1.25H19.2483" stroke="#fff" strokeWidth="2.5"  className="dark:text-black dark:!stroke-black"/>
    <path d="M1.25 7.85H11.8372" stroke="#fff" strokeWidth="2.5"  className="dark:text-black dark:!stroke-black"/>
    <path d="M1.25 14.45H15.0134" stroke="#fff" strokeWidth="2.5"  className="dark:text-black dark:!stroke-black"/>
  </svg>
)

export default function NavSheetDrawer({
  className,
  classNameSubTitle,
}: NavSheetDrawerProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      {/* TRIGGER */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex flex-col gap-1 items-center hover:bg-transparent dark:text-black",
            className
          )}
        >
          {HamBurger}
          <span className={cn("text-[10px] uppercase", classNameSubTitle)}>
            Menu
          </span>
        </Button>
      </SheetTrigger>

      {/* DRAWER */}
      <SheetContent
        side="left"
        className="menu-sheet-hide-close w-[300px] h-[100vh] bg-[#fff] text-[#000] border-white/10 duration-500 ease-out px-0 pt-0"
      >
     

        {/* LINKS */}
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="p-6 bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))]">
          <SheetClose asChild>
            <button className="px-3 cursor-pointer text-[#000] opacity-70 hover:opacity-100 !absolute right-[0]">
              <X fill="#fff40" size={30} className="bg-[#fff] rounded-full p-1"/>
            </button>
          </SheetClose>
            <h2 className="text-xl font-bold text-white">Blend<span className="opacity-80">Ras</span></h2>
            <p className="text-white/70 text-sm mt-1">Blend Fresh, Live Healthy</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 h-[90vh] overflow-y-scroll custom-scroll">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">Navigation</p>
            <ul className="space-y-0">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <LoadingLink
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </LoadingLink>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t" />

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">Quick Links</p>
            <ul className="space-y-1">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors w-full text-left">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>             
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
