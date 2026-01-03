import { DesktopHeader } from "@/components/Header/DesktopHeader";
import RightStickyBar from "@/components/RightStickyBar/RightStickyBar";
import MobileStickyBar from "@/components/RightStickyBar/MobileStickyBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      {children}
      <RightStickyBar />
      <MobileStickyBar />
    </>
  );
}
