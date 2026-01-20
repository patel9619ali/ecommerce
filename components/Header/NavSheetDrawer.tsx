"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { X } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

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
        className="w-[300px] bg-black text-white border-white/10"
      >
        {/* CLOSE ICON */}
        <SheetClose asChild className="[&>svg]:w-[30px] [&>svg]:h-[30px]">
          
        </SheetClose>

        {/* LINKS */}
        <nav className="flex flex-col">
          {[
            { href: "/", label: "Home" },
            { href: "/more-products", label: "Headphones" },
            { href: "/our-story", label: "Our Story" },
            { href: "/about-us", label: "About Us" },
            { href: "/contact-us", label: "Contact Us" },
          ].map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="border-b border-white/20 py-4 text-[18px] font-semibold"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
