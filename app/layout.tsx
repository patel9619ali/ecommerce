import type { Metadata } from "next";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import LoaderWrapper from "@/components/Loader/LoaderWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata: Metadata = {
  title: "BlendRas - Portable Juicer",
  description: "BlendRas - Portable Juicer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <SpeedInsights />
        <LoadingProvider>
          <LoaderWrapper>{children}</LoaderWrapper>
        </LoadingProvider>
      </body>
    </html>
  );
}
