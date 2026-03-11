import CartHydrator from "@/components/Cart/CartHydrator";
import Footer from "@/components/Footer/Footer";
import { DesktopHeader } from "@/components/Header/DesktopHeader";
import MobileHeaderController from "@/components/Header/MobileHeaderController";
import { Suspense } from "react";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartHydrator/>
      <Suspense fallback={null}>
        <DesktopHeader brandName="BlendRas" brandLogoUrl={null} />
        <MobileHeaderController/>
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
