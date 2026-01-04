"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type WhyChooseUsMobileHoverImageProps = {
  className?: string;
};

const slides = [
  {
    id: "crafted",
    title: "CRAFTED FOR THE SENSES",
    subtitle: "LESS EFFORT. MORE EMOTION.",
    description:
      "You can see it in the soft lambskin leather, picked and stitched with exacting attention to detail. You can feel it in the precision-cut aluminium frame that's robust yet beautiful.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop",
  },
  {
    id: "accessories",
    title: "STANDOUT ACCESSORIES",
    subtitle: "MUSIC AT YOUR FINGERTIPS",
    description:
      "Premium carrying case crafted from genuine leather. Magnetic closure ensures your headphones stay protected while maintaining that luxurious feel in your hands.",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=1000&fit=crop",
  },
  {
    id: "fidelity",
    title: "FIDELITY THAT FLEXES",
    subtitle: "ALMOST-UNREAL COMFORT",
    description:
      "Advanced acoustic engineering meets ergonomic design. Memory foam ear cups adapt to your unique ear shape, providing hours of fatigue-free listening pleasure.",
    image:
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=1000&fit=crop",
  },
  {
    id: "design",
    title: "TIMELESS DESIGN",
    subtitle: "MADE TO LAST",
    description:
      "Every component carefully selected for durability and aesthetics. From the brushed metal finish to the reinforced cables, these headphones are built for generations.",
    image:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=1000&fit=crop",
  },
  {
    id: "wireless",
    title: "WIRELESS FREEDOM",
    subtitle: "SEAMLESS CONNECTIVITY",
    description:
      "Latest Bluetooth technology ensures stable connection and all-day battery life with seamless multi-device pairing.",
    image:
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=1000&fit=crop",
  },
];

const WhyChooseUsMobileHoverImage = ({
  className,
}: WhyChooseUsMobileHoverImageProps) => {
  const [activeIndex, setActiveIndex] = useState(0); // first visible by default

  return (
    <section className={clsx("w-full bg-black/90 py-16", className)}>
      <div className="container mx-auto !px-3">
        <h2 className="text-[36px] text-white text-center font-semibold mb-12">
          WHY DYNASTY HEADPHONE
        </h2>

        <div className="bg-[#3a4149] rounded-lg">
          {slides.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div key={item.id} className="border-b border-white/10">
                {/* TITLE */}
                <button
                  onClick={() => setActiveIndex(index)}
                  className="w-full text-left px-4 py-4 transition-all duration-300"
                >
                  <h3
                    className={clsx(
                      isActive
                        ? "text-white text-[18px] font-[700]"
                        : "text-white/70 text-[14px] font-[500]"
                    )}
                  >
                    {item.title}
                  </h3>
                </button>

                {/* EXPANDED CONTENT */}
                {isActive && (
                  <div className="px-4 pb-6 animate-fadeIn">
                    <div className="text-white mb-4">
                      <h4 className="text-[14px] font-semibold mb-2">
                        {item.subtitle}
                      </h4>
                      <p className="text-white/70 leading-relaxed">
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
