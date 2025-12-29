import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

export type ProductBenefit = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export type Variant = {
  key: string;
  name: string;
  price: number;
  images: StaticImageData[];
  benefits: ProductBenefit[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  variants: Variant[];
};
