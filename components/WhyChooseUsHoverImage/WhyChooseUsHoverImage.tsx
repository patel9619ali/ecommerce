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
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop"
    },
    {
      title: "STANDOUT ACCESSORIES",
      subtitle: "MUSIC AT YOUR FINGERTIPS",
      description: "Premium carrying case crafted from genuine leather. Magnetic closure ensures your headphones stay protected while maintaining that luxurious feel in your hands.",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=1000&fit=crop"
    },
    {
      title: "FIDELITY THAT FLEXES",
      subtitle: "ALMOST-UNREAL COMFORT",
      description: "Advanced acoustic engineering meets ergonomic design. Memory foam ear cups adapt to your unique ear shape, providing hours of fatigue-free listening pleasure.",
      image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=1000&fit=crop"
    },
    {
      title: "TIMELESS DESIGN",
      subtitle: "MADE TO LAST",
      description: "Every component carefully selected for durability and aesthetics. From the brushed metal finish to the reinforced cables, these headphones are built for generations.",
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=1000&fit=crop"
    },
    {
      title: "WIRELESS FREEDOM",
      subtitle: "SEAMLESS CONNECTIVITY",
      description: "Latest Bluetooth 5.0 technology ensures stable connection up to 30 feet. Quick pairing with all your devices, and battery life that lasts all day long.",
      image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=1000&fit=crop"
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
    <section className={`w-full bg-[#000000e6] py-10 ${className}`}>
      <div className='container mx-auto'>
          <h2 className='text-[40px] text-[#fff] text-center font-[600] mb-5'>WHY DYNASTY HEADPHONE</h2>
          
            <div className="h-[600px] flex gap-8">
              {/* Left Side - Text Items */}
              <div className="flex flex-col w-1/2 justify-center">
                {slides.map((slide, index) => (
                  <div key={index} onMouseEnter={() => scrollTo(index)} className={`p-6 rounded-lg cursor-pointer transition-all duration-500 ${ selectedIndex === index ? 'bg-[#000]' : 'bg-transparent hover:bg-white/5' }`} >
                    <h3
                      className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                        selectedIndex === index ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {slide.title}
                    </h3>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        selectedIndex === index ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {slide.subtitle}
                    </p>
                    <div
                      className={`mt-3 text-sm leading-relaxed transition-all duration-500 overflow-hidden ${
                        selectedIndex === index
                          ? 'max-h-40 opacity-100 text-gray-300'
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
                          ? 'h-12 bg-amber-500'
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