"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type WhyChooseUsMobileHoverImageProps = {
  className?: string;
};

const slides = [
  {
    id: "powerful",
    title: "POWERFUL 304 STAINLESS STEEL BLADES",
    subtitle: "BLEND ANYTHING. ANYWHERE.",
    description:
      "Engineered with sharp, food-grade 304 stainless steel blades that effortlessly crush ice, frozen fruits, and hard vegetables. Built to deliver smooth, consistent results every single time.",
    image: "/assets/Blender/BlackBlender/black1.jpg",
  },
  {
    id: "portable",
    title: "TRULY PORTABLE DESIGN",
    subtitle: "YOUR KITCHEN IN YOUR POCKET",
    description:
      "Compact and lightweight, BlendRas fits in your bag, gym kit, or car cupholder. Whether you're at the office, gym, or hiking trail — fresh juice is always within reach.",
    image: "/assets/Blender/BlueBlender/royal_blue_1.jpg",
  },
  {
    id: "battery",
    title: "LONG-LASTING BATTERY LIFE",
    subtitle: "BLEND ALL DAY. WORRY-FREE.",
    description:
      "Powered by a high-capacity rechargeable battery, BlendRas delivers up to 20+ blending cycles on a single charge. USB-C fast charging means you're never out of juice — literally.",
    image: "/assets/Blender/CoconotBlender/coconot-1.jpg",
  },
  {
    id: "design",
    title: "SLEEK & DURABLE BUILD",
    subtitle: "BUILT TO LAST. DESIGNED TO IMPRESS.",
    description:
      "Crafted from BPA-free, food-grade materials with a premium finish. The leak-proof seal and shatter-resistant body ensure your blender handles everyday life without missing a beat.",
    image: "/assets/Blender/IceBlender/ice_blender_1.jpg",
  },
  {
    id: "easy",
    title: "EFFORTLESS CLEAN & USE",
    subtitle: "BLEND. RINSE. REPEAT.",
    description:
      "Self-cleaning in seconds — just add water, blend, and rinse. No complicated parts, no mess. BlendRas is designed for real people living real, busy lives.",
    image: "/assets/Blender/RubyBlender/Ruby_1.jpg",
  },
];

const WhyChooseUsMobileHoverImage = ({
  className,
}: WhyChooseUsMobileHoverImageProps) => {
  const [activeIndex, setActiveIndex] = useState(0); // first visible by default

  return (
    <section className={clsx("w-full py-16 bg-[#fff] dark:bg-[#fff]", className)}>
      <div className="container mx-auto !px-3">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">Why BlendRas  <span className="text-gradient-accent">Portable Juicer</span></h2>
        <div className="bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)] rounded-lg border-[2px] border-[#eae8ee] hover:border-[#7c3bed33] hover:shadow-xl transition-all duration-500">
          {slides.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div key={item.id} className="border-b border-black/10">
                {/* TITLE */}
                <button
                  onClick={() => setActiveIndex(index)}
                  className="w-full text-left px-4 py-4 transition-all duration-300"
                >
                  <h3
                    className={clsx(
                      isActive
                        ? "text-black text-[18px] font-[700]"
                        : "text-black/70 text-[14px] font-[500]"
                    )}
                  >
                    {item.title}
                  </h3>
                </button>

                {/* EXPANDED CONTENT */}
                {isActive && (
                  <div className="px-4 pb-6 animate-fadeIn">
                    <div className="text-black mb-4">
                      <h4 className="text-[14px] font-semibold mb-2">
                        {item.subtitle}
                      </h4>
                      <p className="text-black/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="relative w-full h-[250px] rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover p-3"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsMobileHoverImage;
