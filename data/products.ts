import img1 from "@/public/assets/cartImages/dynasty-headphone-blackgold-01.jpg";
import img2 from "@/public/assets/cartImages/dynasty-headphone-black-02.jpg";
import img3 from "@/public/assets/cartImages/dynasty-headphone-black-03.jpg";
import img4 from "@/public/assets/cartImages/dynasty-headphone-black-04.jpg";

import blue1 from "@/public/assets/cartImages/dynasty-headphone-blue-01.jpg";
import blue2 from "@/public/assets/cartImages/dynasty-headphone-blue-02.jpg";
import blue3 from "@/public/assets/cartImages/dynasty-headphone-blue-03.jpg";
import blue4 from "@/public/assets/cartImages/dynasty-headphone-blue-04.jpg";

import { RefreshCw, Gift, ShieldCheck } from "lucide-react";
import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "dynasty-headphone",
    slug: "dynasty-headphone",
    title: "Noise Newly Launched Airwave Max XR Wireless Over-Ear Headphones with 120H Playtime, ANC, HFA Tech, Spatial Audio, Dual Pairing",
    subtitle: "Ultimate over-ear headphones",

    variants: [
      {
        key: "black",
        name: "Black",
        price: 169400,
        images: [img1, img2, img3, img4],
        benefits: [
          { id: "trial", label: "30-day free trial", icon: RefreshCw },
          { id: "gift", label: "Available gift wrapping", icon: Gift },
          { id: "warranty", label: "3 years warranty", icon: ShieldCheck },
        ],
      },
      {
        key: "blue",
        name: "Blue",
        price: 169400,
        images: [blue1, blue2, blue3, blue4],
        benefits: [
          { id: "trial", label: "20-day free trial", icon: RefreshCw },
          { id: "gift", label: "Available gift wrapping", icon: Gift },
          { id: "warranty", label: "3 years warranty", icon: ShieldCheck },
        ],
      },
    ],
  },
];
