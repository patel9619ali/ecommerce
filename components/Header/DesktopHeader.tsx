"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react"

import { Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
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
import { Skeleton } from "@/components/ui/skeleton"
import ProfileDropdown from "./ProfileDropdown";

const HamBurger = (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="16" viewBox="0 0 21 16" fill="none">
    <path d="M1.25 1.25H19.2483" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.25 7.84961H11.8372" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.25 14.4492H15.0134" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function DesktopHeader() {
  const items = useCartStore((state) => state.items);
  const { openCart } = useCartStore();
  const resetCart = useCartStore((s) => s.resetCart);
  const loadFromDatabase = useCartStore((s) => s.loadFromDatabase);
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const user = useCurrentUser();

  const isHomePage = pathName === '/';
  const [isMobile, setIsMobile] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
        setIsVisible(true);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  useEffect(() => {
    if (user?.id) {
      // ✅ User logged in / switched user
      resetCart();          // 🔥 clear previous user's cart
      loadFromDatabase();   // 🔄 load THIS user's cart from DB
    } else {
      // ✅ User logged out
      resetCart();          // 🔥 clear cart completely
    }
  }, [user?.id]);
  console.log(items,"loadFromDatabase")
  return (
    <header className={cn(
      "top-0 left-0 right-0 z-50 bg-white transition-transform duration-300",
      isFixed ? "fixed" : "relative",
      isFixed && "backdrop-blur-md bg-white/90",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left: Hamburger Menu */}
        <div className="flex gap-6">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent">
                {HamBurger}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetTitle className="hidden">Menu</SheetTitle>
            
            <SheetContent side="left" className="menu-sheet-hide-close w-[300px] bg-[#fff] text-[#000] border-white/10 duration-500 ease-out">
              <SheetClose asChild>
                <button className="cursor-pointer relative text-[#000] opacity-70 hover:opacity-100">
                  <X fill="#fff40" size={30} className="bg-[#fff] rounded-full p-1"/>
                </button>
              </SheetClose>
              <div className="h-full flex flex-col justify-between border-t-[1px] border-b-[1px] border-[#C9C9C950] py-0">
                <div className="flex flex-col shrink-0 gap-0">
                  <Link className="text-[18px] font-[600] last:pb-0 pb-4 border-b-[1px] border-[#C9C9C950] last:border-0 pt-4 pb-0" href="/">Home</Link>
                  {/* <Link className="text-[18px] font-[600] last:pb-0 pb-4 border-b-[1px] border-[#C9C9C950] last:border-0 pt-4 pb-0" href="/more-products">Headphones</Link> */}
                  {/* <Link className="text-[18px] font-[600] last:pb-0 pb-4 border-b-[1px] border-[#C9C9C950] last:border-0 pt-4 pb-0" href="/our-story">Our story</Link> */}
                  <Link className="text-[18px] font-[600] last:pb-0 pb-4 border-b-[1px] border-[#C9C9C950] last:border-0 pt-4 pb-0" href="/about-us">About Us</Link>
                  <Link className="text-[18px] font-[600] last:pb-0 pb-4 border-b-[1px] border-[#C9C9C950] last:border-0 pt-4 pb-0" href="/contact-us">Contact Us</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <CurrencySelector/>
        </div>

        {/* Center: Logo */}
        <h3 className="text-2xl font-bold text-[#28af60]"><Link href={`/`}>BlendRas</Link></h3>

        {/* Right: Actions */}
        <div className="flex items-center md:gap-2 gap-0">
          <Button variant="ghost" size="icon" className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent">
            <Search className="h-5 w-5 dark:text-black" />
            <span className="sr-only">Search</span>
          </Button>
          <Button className="cursor-pointer" onClick={openCart} variant="ghost" size="icon" disabled={items.length === 0}>
            <ShoppingCart className="h-5 w-5 dark:text-black" />
          </Button>
          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Button onClick={() => router.push('/sign-in')} variant="ghost" size="icon" className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent">
              <User className="h-5 w-5 dark:text-black" />
              <span className="sr-only">Account</span>
            </Button>
          )}
          <AddToCart />
        </div>
      </div>
    </header>
  );
}