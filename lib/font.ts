import { Figtree as FontSans } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});