import black1 from "@/public/assets/Blender/BlackBlender/black1.jpg";


export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  currency: string;
  variants: ColorVariant[];
  features: { icon: string; title: string; description: string }[];
  specs: { label: string; value: string }[];
}

export const colorVariants: ColorVariant[] = [
  {
    id: "carbon-black",
    name: "Carbon Black",
    hex: "#2D2D2D",
    bgClass: "bg-[hsl(var(--variant-black))]",
    image: "https://blendras.in/cdn/shop/files/1_1.png?v=1735889848&width=800",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    hex: "#3B82F6",
    bgClass: "bg-[hsl(var(--variant-blue))]",
    image: "https://blendras.in/cdn/shop/files/1_98c43fd3-d0e1-4f2b-871d-c0e5b2fbb77e.png?v=1735890039&width=800",
  },
  {
    id: "coconut-white",
    name: "Coconut White",
    hex: "#F0F0F0",
    bgClass: "bg-[hsl(var(--variant-white))]",
    image: "https://blendras.in/cdn/shop/files/1_bfaa4ad1-d2a1-4d01-9a0a-5b93d7ced1ca.png?v=1735890120&width=800",
  },
  {
    id: "ice-grey",
    name: "Ice Grey",
    hex: "#B0B8C4",
    bgClass: "bg-[hsl(var(--variant-grey))]",
    image: "https://blendras.in/cdn/shop/files/1_0c4f1fba-a9f8-46b7-b2cd-07e9c731f2e1.png?v=1735890178&width=800",
  },
  {
    id: "ruby-red",
    name: "Ruby Red",
    hex: "#DC2626",
    bgClass: "bg-[hsl(var(--variant-red))]",
    image: "https://blendras.in/cdn/shop/files/1_fc3aaeb9-9478-4b68-8bb3-51d5987d9ef3.png?v=1735890237&width=800",
  },
];

export const product: Product = {
  id: "blendras-portable-juicer",
  name: "BlendRas Portable Juicer",
  tagline: "Blend Anywhere, Anytime",
  price: 1999,
  originalPrice: 3999,
  currency: "₹",
  variants: colorVariants,
  features: [
    {
      icon: "Zap",
      title: "Portable & Lightweight",
      description: "Weighs just 385g. Take it to the gym, office, or on a trip — blend fresh juice anywhere.",
    },
    {
      icon: "Fan",
      title: "6-Blade Power",
      description: "304 stainless steel blades spin at high speed to crush ice and blend tough fruits effortlessly.",
    },
    {
      icon: "BatteryCharging",
      title: "USB-C Rechargeable",
      description: "2000mAh battery gives you 10-15 blends per charge. Recharge via any USB-C cable.",
    },
    {
      icon: "Droplets",
      title: "Easy Self-Cleaning",
      description: "Add water and a drop of soap, press blend, and it's clean in seconds.",
    },
  ],
  specs: [
    { label: "Capacity", value: "380ml / 13oz" },
    { label: "Blade Material", value: "304 Stainless Steel (6 blades)" },
    { label: "Motor Speed", value: "22,000 RPM" },
    { label: "Battery", value: "2000mAh Li-ion" },
    { label: "Charging", value: "USB Type-C" },
    { label: "Charge Time", value: "2-3 Hours" },
    { label: "Blends Per Charge", value: "10-15 uses" },
    { label: "Weight", value: "385g" },
    { label: "Dimensions", value: "86mm × 86mm × 232mm" },
    { label: "Material", value: "BPA-Free Tritan Plastic" },
  ],
};

export const reviews = [
  { name: "Priya S.", rating: 5, text: "Absolutely love it! I use it every morning for my protein shakes. So convenient and easy to clean.", location: "Mumbai" },
  { name: "Rahul M.", rating: 5, text: "Got the Ocean Blue one — looks amazing and blends everything perfectly. Battery lasts really long!", location: "Delhi" },
  { name: "Ananya K.", rating: 4, text: "Great value for money. Perfect for my gym routine. The USB-C charging is a huge plus.", location: "Bangalore" },
  { name: "Vikram T.", rating: 5, text: "Bought this for travel and it's been a game changer. Compact, powerful, and stylish.", location: "Pune" },
];

export const faqs = [
  { q: "Can it crush ice?", a: "Yes! The 6 stainless steel blades and powerful motor can handle small ice cubes. For best results, add some liquid along with the ice." },
  { q: "How long does the battery last?", a: "The 2000mAh battery provides 10-15 blends on a full charge, depending on what you're blending. A full charge takes about 2-3 hours via USB-C." },
  { q: "Is it safe to use?", a: "Absolutely. The BlendRas juicer has a magnetic safety switch — it only blends when the lid is properly secured. It's also made with BPA-free Tritan plastic." },
  { q: "What can I blend with it?", a: "Smoothies, protein shakes, fresh juices, baby food, salad dressings — pretty much anything! It handles soft fruits, leafy greens, and even small ice cubes." },
  { q: "How do I clean it?", a: "Self-cleaning mode! Just add warm water with a drop of dish soap, press the blend button, and rinse. It's that simple." },
  { q: "What's the warranty?", a: "Every BlendRas juicer comes with a 6-month manufacturer warranty covering any defects in materials or workmanship." },
  { q: "Do you ship across India?", a: "Yes! We offer free shipping across India. Orders are typically delivered within 5-7 business days." },
];
