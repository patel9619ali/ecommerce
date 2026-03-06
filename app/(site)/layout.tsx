import CartHydrator from "@/components/Cart/CartHydrator";
import Footer from "@/components/Footer/Footer";
import { DesktopHeader } from "@/components/Header/DesktopHeader";
import MobileHeaderController from "@/components/Header/MobileHeaderController";
import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import { isPortableJuicerCategory } from "@/lib/product-url";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  const rows = products?.data || [];
  const featured =
    rows.find((item: any) =>
      isPortableJuicerCategory(item.category?.slug || item.category?.name)
    ) || rows[0];

  const brandName = featured?.brand?.name || "BlendRas";
  const rawLogo =
    featured?.brand?.logo?.url ||
    featured?.brand?.logo?.[0]?.url ||
    featured?.brand?.image?.url ||
    null;

  const brandLogoUrl =
    rawLogo && rawLogo.startsWith("http")
      ? rawLogo
      : rawLogo
        ? `${process.env.NEXT_PUBLIC_CMS_URL}${rawLogo}`
        : null;

  return (
    <>
      <CartHydrator/>
      <Suspense fallback={null}>
        <DesktopHeader brandName={brandName} brandLogoUrl={brandLogoUrl} />
        <MobileHeaderController/>
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
