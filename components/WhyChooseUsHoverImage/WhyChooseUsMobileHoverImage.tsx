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
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = slides[activeIndex];

  const handleNavigate = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={clsx("w-full bg-black/90 py-16", className)}>
      <div className="container mx-auto !px-3">
        <h2 className="text-[36px] text-white text-center font-semibold mb-12">
          WHY DYNASTY HEADPHONE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-[#3a4149]">
          {/* LEFT – TITLES */}
          <div className="space-y-4">
            {slides.map((item, index) => (
              <button
                key={item.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleNavigate(item.id)}
                className={clsx(
                  "w-full text-left px-4 py-3 border-l-4 transition-all duration-300",
                  activeIndex === index
                    ? "border-white/5 bg-white/5"
                    : "border-transparent text-white/70 hover:text-white"
                )}
              >
                <h3 className={`${activeIndex === index ? "text-[#fff] text-[18px] font-[700]" : "text-[#fff30] text-[14px] font-[500]"}`}>
                  {item.title}
                </h3>
              </button>
            ))}
          </div>

          {/* RIGHT – IMAGE + CONTENT */}
          <div className="relative px-3">
             <div className="text-white">
              <h4 className="text-xl font-semibold mb-2">
                {activeItem.subtitle}
              </h4>
              <p className="text-white/70 leading-relaxed">
                {activeItem.description}
              </p>
            </div>
            <div className="mt-6 relative w-full h-[250px] rounded-xl overflow-hidden">
              <Image src={activeItem.image} alt={activeItem.title} fill className="object-cover transition-opacity duration-500 p-4" unoptimized />
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsMobileHoverImage;
