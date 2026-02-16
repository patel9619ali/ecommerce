"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react"

import { ChevronRight, Globe, Heart, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import LoadingLink from "@/components/Loader/LoadingLink";
import { useLoadingRouter } from "@/components/Loader/UseLoadingRouter";
import { useWishlistStore } from "@/store/useWishListStore";
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
const menuItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Shop", href: "/products/blend-ras-portable-juicer", icon: "🛍️" },
  { label: "My Orders", href: "/my-orders", icon: "📦" },
  { label: "About Us", href: "/about-us", icon: "ℹ️" },
  { label: "How It Works", href: "#", icon: "⚡" },
  { label: "FAQs", href: "/faqs", icon: "❓" },
  { label: "Contact Us", href: "/contact-us", icon: "📧" },
];

const quickLinks = [
  { label: "Track Order", icon: "📦" },
  { label: "Warranty & Support", icon: "🛡️" },
  { label: "Shipping Policy", icon: "🚚" },
  { label: "Return Policy", icon: "↩️" },
];
export function DesktopHeader() {
  const items = useCartStore((state) => state.items);
  const { openCart } = useCartStore();
  const resetCart = useCartStore((s) => s.resetCart);
  const loadFromDatabase = useCartStore((s) => s.loadFromDatabase);
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useLoadingRouter();
  const pathName = usePathname();
  const user = useCurrentUser();
  const loadWishlist = useWishlistStore((s) => s.loadFromDatabase);
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
      loadFromDatabase(user.id);  // 🔄 load THIS user's cart from DB
    } else {
      // ✅ User logged out
      resetCart();          // 🔥 clear cart completely
    }
  }, [user?.id]);
useEffect(() => {
  if (user?.id) {
    loadWishlist(user.id); // Load wishlist when user logs in
  }
}, [user?.id, loadWishlist]);
  return (
    <header className={cn(
      "w-full sticky top-0 z-50 bg-[#fff]"
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
            
            <SheetContent side="left" className="menu-sheet-hide-close w-[300px] h-[100vh] bg-[#fff] text-[#000] border-white/10 duration-500 ease-out px-0 pt-0">
              <div className="h-full flex flex-col justify-between border-t-[1px] border-b-[1px] border-[#C9C9C950] py-0">
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

                    {/* Menu Footer */}
                    {/* <div className="p-4 border-t">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Indian (INR ₹)</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <CurrencySelector/>
        </div>

        {/* Center: Logo */}
        <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">
          <LoadingLink href={`/`}><span className="text-gradient">Blend</span>
            <span className="text-foreground">Ras</span>
          </LoadingLink>
        </h3>
        {/* Right: Actions */}
        <div className="flex items-center md:gap-2 gap-0">
          {/* <Button variant="ghost" size="icon" className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent">
            <Search className="h-5 w-5 dark:text-black" />
            <span className="sr-only">Search</span>
          </Button> */}
          <LoadingLink href="/user-profile/wishlist" className="rounded-lg hover:bg-[#f1f5f9] transition-colors relative" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </LoadingLink>
          <Button className="cursor-pointer relative" onClick={() => router.push('/cart')} variant="ghost" size="icon" disabled={items.length === 0}>
            <ShoppingCart className="h-5 w-5 dark:text-black" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] shadow-[0_4px_12px_-2px_rgba(104,71,235,0.3)]">
                {items.length}
              </span>
            )}
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