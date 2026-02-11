import CartHydrator from "@/components/Cart/CartHydrator";
import Footer from "@/components/Footer/Footer";
import { DesktopHeader } from "@/components/Header/DesktopHeader";
import MobileHeaderController from "@/components/Header/MobileHeaderController";
import { Suspense } from "react";
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartHydrator/>
      <Suspense fallback={null}>
        <DesktopHeader />
        <MobileHeaderController/>
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
