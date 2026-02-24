'use client';
import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
type WhyChooseUsHoverImageProps = {
  className?: string;
};

const WhyChooseUsHoverImage = ({ className }: WhyChooseUsHoverImageProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    axis: 'y',
    loop: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index:any) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className={`w-full bg-[#fff] py-10 ${className}`}>
      <div className='container mx-auto'>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 block text-center">
            Why BlendRas <span className="text-gradient"> Portable Juicer</span>
          </h2>
            <div className="h-[600px] flex gap-8">
              {/* Left Side - Text Items */}
              <div className="flex flex-col w-1/2 justify-center">
                {slides.map((slide, index) => (
                  <div key={index} onMouseEnter={() => scrollTo(index)} className={`p-6 rounded-lg cursor-pointer transition-all duration-500 ${ selectedIndex === index ? 'bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)]' : 'bg-transparent hover:border-[#7c3bed33] hover:bg-white/5 hover:shadow-xl' }`} >
                    <h3
                      className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                        selectedIndex === index ? 'text-black dark:text-black' : 'dark:text-black text-white-400'
                      }`}
                    >
                      {slide.title}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        selectedIndex === index ? 'text-black-700 dark:text-black' : 'text-gray-500 dark:text-black'
                      }`}
                    >
                      {slide.subtitle}
                    </p>
                    <div
                      className={`mt-3 text-sm leading-relaxed transition-all duration-500 overflow-hidden ${
                        selectedIndex === index
                          ? 'max-h-40 opacity-100 text-black-700 dark:text-black'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {slide.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side - Image Carousel */}
              <div className="w-1/2 relative flex justify-center items-center">
                <div className="overflow-hidden h-full rounded-2xl" ref={emblaRef}>
                  <div className="flex flex-col h-full">
                    {slides.map((slide, index) => (
                      <div key={index} className="flex-[0_0_100%] min-h-0">
                        <div className="relative h-full w-full overflow-hidden rounded-2xl">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`w-2 rounded-full transition-all duration-300 ${
                        selectedIndex === index
                          ? 'h-12 bg-[#3a4149]'
                          : 'h-2 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
        
      </div>
    </section>
    
  );
};

export default WhyChooseUsHoverImage;