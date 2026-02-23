import product1 from "@/public/assets/DummyProduct/product-1.jpg";
import product1b from "@/public/assets/DummyProduct/product-1b.jpg";
import product2 from "@/public/assets/DummyProduct/product-2.jpg";
import product2b from "@/public/assets/DummyProduct/product-2b.jpg";
import product3 from "@/public/assets/DummyProduct/product-3.jpg";
import product3b from "@/public/assets/DummyProduct/product-3b.jpg";
import product4 from "@/public/assets/DummyProduct/product-4.jpg";
import product4b from "@/public/assets/DummyProduct/product-4b.jpg";
import product5 from "@/public/assets/DummyProduct/product-5.jpg";
import product5b from "@/public/assets/DummyProduct/product-5b.jpg";
import product6 from "@/public/assets/DummyProduct/product-6.jpg";
import product6b from "@/public/assets/DummyProduct/product-6b.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  color: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "BlendRas Berry Blast",
    description: "Portable Blender — Berry Red Edition",
    price: 1599,
    originalPrice: 2999,
    discount: 47,
    rating: 4.5,
    reviewCount: 1240,
    images: [product1, product1b],
    category: "Portable Blender",
    color: "Red",
    isBestseller: true,
  },
  {
    id: "2",
    name: "BlendRas Green Machine",
    description: "Portable Blender — Fresh Green Edition",
    price: 1599,
    originalPrice: 2999,
    discount: 47,
    rating: 4.3,
    reviewCount: 890,
    images: [product2, product2b],
    category: "Portable Blender",
    color: "Green",
  },
  {
    id: "3",
    name: "BlendRas Ocean Blue",
    description: "Portable Blender — Mango Blue Edition",
    price: 1799,
    originalPrice: 3499,
    discount: 49,
    rating: 4.6,
    reviewCount: 2100,
    images: [product3, product3b],
    category: "Portable Blender",
    color: "Blue",
    isNew: true,
  },
  {
    id: "4",
    name: "BlendRas Strawberry Pink",
    description: "Portable Blender — Cute Pink Edition",
    price: 1499,
    originalPrice: 2799,
    discount: 46,
    rating: 4.7,
    reviewCount: 3200,
    images: [product4, product4b],
    category: "Portable Blender",
    color: "Pink",
    isBestseller: true,
  },
  {
    id: "5",
    name: "BlendRas Pro Black",
    description: "Portable Blender — Gym Pro Edition",
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    rating: 4.4,
    reviewCount: 670,
    images: [product5, product5b],
    category: "Portable Blender",
    color: "Black",
    isNew: true,
  },
  {
    id: "6",
    name: "BlendRas Pure White",
    description: "Portable Blender — Minimalist White Edition",
    price: 1699,
    originalPrice: 3299,
    discount: 48,
    rating: 4.2,
    reviewCount: 450,
    images: [product6, product6b],
    category: "Portable Blender",
    color: "White",
  },
];

export const categories = ["All", "Portable Blender", "Accessories", "Bundles"];
export const colors = ["All", "Red", "Green", "Blue", "Pink", "Black", "White"];
