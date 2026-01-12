import black1 from "@/public/assets/Blender/BlackBlender/black1.jpg";
import black2 from "@/public/assets/Blender/BlackBlender/black2.jpg";
import black3 from "@/public/assets/Blender/BlackBlender/black3.jpg";
import black4 from "@/public/assets/Blender/BlackBlender/black4.jpg";
import black5 from "@/public/assets/Blender/BlackBlender/black4.jpg";

import royal_blue_1 from "@/public/assets/Blender/BlueBlender/royal_blue_1.jpg";
import royal_blue_2 from "@/public/assets/Blender/BlueBlender/royal_blue_2.jpg";
import royal_blue_3 from "@/public/assets/Blender/BlueBlender/royal_blue_3.jpg";
import royal_blue_4 from "@/public/assets/Blender/BlueBlender/royal_blue_4.jpg";
import royal_blue_5 from "@/public/assets/Blender/BlueBlender/royal_blue_4.jpg";


import coconot_1 from "@/public/assets/Blender/CoconotBlender/coconot-1.jpg";
import coconot_2 from "@/public/assets/Blender/CoconotBlender/coconot-2.jpg";
import coconot_3 from "@/public/assets/Blender/CoconotBlender/coconot-3.jpg";
import coconot_4 from "@/public/assets/Blender/CoconotBlender/coconot-4.jpg";
import coconot_5 from "@/public/assets/Blender/CoconotBlender/coconot-5.jpg";
import coconot_6 from "@/public/assets/Blender/CoconotBlender/coconot-6.jpg";

import ice_blender_1 from "@/public/assets/Blender/IceBlender/ice_blender_1.jpg";
import ice_blender_2 from "@/public/assets/Blender/IceBlender/ice_blender_2.jpg";
import ice_blender_3 from "@/public/assets/Blender/IceBlender/ice_blender_3.jpg";

import Ruby_1 from "@/public/assets/Blender/RubyBlender/Ruby_1.jpg";
import Ruby_2 from "@/public/assets/Blender/RubyBlender/Ruby_2.jpg";
import Ruby_3 from "@/public/assets/Blender/RubyBlender/Ruby_3.jpg";
import Ruby_4 from "@/public/assets/Blender/RubyBlender/Ruby_4.jpg";
import Ruby_5 from "@/public/assets/Blender/RubyBlender/Ruby_5.jpg";


import { RefreshCw, Gift, ShieldCheck } from "lucide-react";
import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  // ===================== 1. PORTABLE JUICER =====================
  {
    id: "portable-juicer",
    slug: "portable-juicer",
    title:
      "BlendRas Portable Juicer with Powerful Motor, Rechargeable Battery & Stainless Steel Blades",
    subtitle: "Fresh juice anytime, anywhere",

    variants: [
      {
        key: "black",
        name: "Carbon Black",
        price: 349900,
        images: [black1, black2, black3, black4, black5],
        benefits: [
          { id: "battery", label: "USB rechargeable battery", icon: RefreshCw },
          { id: "gift", label: "Travel friendly design", icon: Gift },
          { id: "warranty", label: "1 year warranty", icon: ShieldCheck },
        ],
      },
      {
        key: "blue",
        name: "Ocean Blue",
        price: 349900,
        images: [royal_blue_1, royal_blue_2, royal_blue_3, royal_blue_4,royal_blue_5],
        benefits: [
          { id: "battery", label: "Fast charging support", icon: RefreshCw },
          { id: "gift", label: "BPA-free material", icon: Gift },
          { id: "warranty", label: "1 year warranty", icon: ShieldCheck },
        ],
      },
      {
        key: "ice",
        name: "Ice",
        price: 349900,
        images: [ice_blender_1, ice_blender_2, ice_blender_3],
        benefits: [
          { id: "battery", label: "Fast charging support", icon: RefreshCw },
          { id: "gift", label: "BPA-free material", icon: Gift },
          { id: "warranty", label: "1 year warranty", icon: ShieldCheck },
        ],
      },
      {
        key: "ruby",
        name: "Ruby",
        price: 349900,
        images: [Ruby_1, Ruby_2, Ruby_3,Ruby_4,Ruby_5],
        benefits: [
          { id: "battery", label: "Fast charging support", icon: RefreshCw },
          { id: "gift", label: "BPA-free material", icon: Gift },
          { id: "warranty", label: "1 year warranty", icon: ShieldCheck },
        ],
      },
      {
        key: "Coconot",
        name: "Coconot",
        price: 349900,
        images: [coconot_1, coconot_2, coconot_3, coconot_4,coconot_5,coconot_6],
        benefits: [
          { id: "battery", label: "Fast charging support", icon: RefreshCw },
          { id: "gift", label: "BPA-free material", icon: Gift },
          { id: "warranty", label: "1 year warranty", icon: ShieldCheck },
        ],
      },
    ],
  },
];
