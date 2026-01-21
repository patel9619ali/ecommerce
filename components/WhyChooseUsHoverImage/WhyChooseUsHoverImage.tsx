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
      title: "CRAFTED FOR THE SENSES",
      subtitle: "LESS EFFORT. MORE EMOTION.",
      description: "You can see it in the soft lambskin leather, picked and stitched with exacting attention to detail. You can feel it in the precision-cut aluminium frame that's robust yet beautiful.",
      image: "/assets/Blender/BlackBlender/black1.jpg",
    },
    {
      title: "STANDOUT ACCESSORIES",
      subtitle: "MUSIC AT YOUR FINGERTIPS",
      description: "Premium carrying case crafted from genuine leather. Magnetic closure ensures your headphones stay protected while maintaining that luxurious feel in your hands.",
      image: "/assets/Blender/BlueBlender/royal_blue_1.jpg",
    },
    {
      title: "FIDELITY THAT FLEXES",
      subtitle: "ALMOST-UNREAL COMFORT",
      description: "Advanced acoustic engineering meets ergonomic design. Memory foam ear cups adapt to your unique ear shape, providing hours of fatigue-free listening pleasure.",
      image: "/assets/Blender/CoconotBlender/coconot-1.jpg",
    },
    {
      title: "TIMELESS DESIGN",
      subtitle: "MADE TO LAST",
      description: "Every component carefully selected for durability and aesthetics. From the brushed metal finish to the reinforced cables, these headphones are built for generations.",
      image: "/assets/Blender/IceBlender/ice_blender_1.jpg",
    },
    {
      title: "WIRELESS FREEDOM",
      subtitle: "SEAMLESS CONNECTIVITY",
      description: "Latest Bluetooth 5.0 technology ensures stable connection up to 30 feet. Quick pairing with all your devices, and battery life that lasts all day long.",
      image: "/assets/Blender/RubyBlender/Ruby_1.jpg",
    }
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
          <h2 className='text-[40px] text-[#000] text-center font-[600] mb-5'>Why BlendRas Portable Juicer</h2>
          
            <div className="h-[600px] flex gap-8">
              {/* Left Side - Text Items */}
              <div className="flex flex-col w-1/2 justify-center">
                {slides.map((slide, index) => (
                  <div key={index} onMouseEnter={() => scrollTo(index)} className={`p-6 rounded-lg cursor-pointer transition-all duration-500 ${ selectedIndex === index ? 'bg-[#dbd4d463]' : 'bg-transparent hover:bg-white/5' }`} >
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