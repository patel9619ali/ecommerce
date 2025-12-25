"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react"
import { Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from "@/lib/utils";
import CurrencySelector from "./CurrencySelector";
import { AddToCart } from "../AddToCart/AddToCart";
const HamBurger = (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="16" viewBox="0 0 21 16" fill="none">
    <path d="M1.25 1.25H19.2483" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.25 7.84961H11.8372" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.25 14.4492H15.0134" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const user = (
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="2" height="2" strokeWidth="1.5" fill="none" viewBox="0 0 14 18">
      <path d="M7.34497 10.0933C4.03126 10.0933 1.34497 12.611 1.34497 15.7169C1.34497 16.4934 1.97442 17.1228 2.75088 17.1228H11.9391C12.7155 17.1228 13.345 16.4934 13.345 15.7169C13.345 12.611 10.6587 10.0933 7.34497 10.0933Z" stroke="currentColor"></path>
      <ellipse cx="7.34503" cy="5.02631" rx="3.63629" ry="3.51313" stroke="currentColor" strokeLinecap="square"></ellipse>
    </svg>
)


export function DesktopHeader() {
  const items = useCartStore((state) => state.items);
  console.log("Cart items in Header:", items);
  const hasCartData = items.length > 0;
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetOpenCart, setSheetOpenCart] = useState(false);
  const handleSheetClose = () => setSheetOpen(false);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header className={cn( "fixed top-0 left-0 right-0 z-50 bg-[#000] text-white transition-transform duration-300", isVisible ? "translate-y-0" : "-translate-y-full", )} >
    
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left: Hamburger Menu */}
        <div className="flex gap-6">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className=" cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent ">
                {HamBurger}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetTitle className="hidden">Menu</SheetTitle>
              
              <SheetContent side="left" className="menu-sheet-hide-close w-[300px] bg-black text-white border-white/10 duration-500 ease-out">
                <SheetClose asChild>
                    <button className="cursor-pointer relative text-[#fff] opacity-70 hover:opacity-100">
                      <X fill="#fff40" size={30} className="bg-[#fafafa20] rounded-full p-1"/>
                    </button>
                </SheetClose>
                Hello
              </SheetContent>
          </Sheet>
          <CurrencySelector/>

        </div>
        {/* Center: Logo */}
        Logo

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className=" cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent ">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className=" cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent ">
            {user}
            <span className="sr-only">Account</span>
          </Button>
          <Sheet open={sheetOpenCart} onOpenChange={setSheetOpenCart}>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon" disabled={!hasCartData} className={!hasCartData ? "opacity-40 cursor-not-allowed" : ""} >
                  <ShoppingCart className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <AddToCart sheetOpenCart={sheetOpenCart} setQuantity={setQuantity} quantity={quantity}/>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
