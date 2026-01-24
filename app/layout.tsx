import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import LoaderWrapper from "@/components/Loader/LoaderWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import {auth} from "@/lib/auth";
import { Session } from "inspector/promises";
export const metadata: Metadata = {
  title: "BlendRas - Portable Juicer",
  description: "BlendRas - Portable Juicer",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" className="dark">
        <body className="bg-transparent dark:!bg-[#fff]">
          <SpeedInsights />
          <LoadingProvider>
            <LoaderWrapper>{children}</LoaderWrapper>
          </LoadingProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
