import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import LoaderWrapper from "@/components/Loader/LoaderWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
export const metadata: Metadata = {
  title: "BlendRas - Portable Juicer",
  description: "BlendRas - Portable Juicer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
        <body className="dark:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)]">
        <SessionProvider>
          <SpeedInsights />
          <LoadingProvider>
            <LoaderWrapper>{children}</LoaderWrapper>
          </LoadingProvider>
        </SessionProvider>
        </body>
      </html>
  );
}
