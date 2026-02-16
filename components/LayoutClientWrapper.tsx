"use client";

import { usePathname } from "next/navigation";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isOrderPage =
    pathname.startsWith("/order-confirmation");

  return (
    <>
      {/* Skip heavy global stuff only on order page */}
      {!isOrderPage && children}

      {/* Still render children normally on order page */}
      {isOrderPage && children}
    </>
  );
}