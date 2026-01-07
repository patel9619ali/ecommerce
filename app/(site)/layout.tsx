import { DesktopHeader } from "@/components/Header/DesktopHeader";
import RightStickyBar from "@/components/RightStickyBar/RightStickyBar";
import MobileStickyBar from "@/components/RightStickyBar/MobileStickyBar";
import MobileHeader from "@/components/Header/MobileBottomHeader";
import MobileHeaderController from "@/components/Header/MobileHeaderController";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <MobileHeaderController/>
      {children}
      {/* <RightStickyBar /> */}
      {/* <MobileStickyBar /> */}
    </>
  );
}
