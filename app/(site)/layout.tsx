import Footer from "@/components/Footer/Footer";
import { DesktopHeader } from "@/components/Header/DesktopHeader";
import MobileHeaderController from "@/components/Header/MobileHeaderController";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <MobileHeaderController/>
      {children}
      <Footer />
    </>
  );
}
