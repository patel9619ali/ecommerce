"use client"

import Link from "next/link"
import { HomeIcon, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useUIStore } from "@/store/useUIStore"
import NavSheetDrawer from "./NavSheetDrawer"

export default function MobileBottomHeader({ visible }: { visible: boolean }) {
  const { openCart } = useCartStore()
  const { openMobileMenu } = useUIStore()

  return (
    <nav
      className={` fixed bottom-0 left-0 w-full bg-black text-white flex justify-around py-2 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"} sm:hidden `} >
      {/* HOME */}
      <Link href="/" className="flex flex-col items-center gap-1">
        <HomeIcon size={15} stroke="#f9f9f996"/>
        <span className="text-[10px]">HOME</span>
      </Link>

      {/* USER */}
      <Link href="/sign-in" className="flex flex-col items-center gap-1">
        <svg width="20" height="20" viewBox="0 0 14 18" stroke="#f9f9f996" fill="none">
          <path d="M7 10c-3 0-5 2-5 5h10c0-3-2-5-5-5z" />
          <circle cx="7" cy="4" r="3" />
        </svg>
        <span className="text-[10px]">USER</span>
      </Link>

      {/* CART (opens sheet) */}
      <button
        onClick={openCart}
        className="flex flex-col items-center gap-1"
      >
        <ShoppingCart className="h-5 w-5" stroke="#f9f9f996"/>
        <span className="text-[10px]">CART</span>
      </button>

    <NavSheetDrawer className="sm:hidden flex" />
    </nav>
  )
}
