'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EmblaOptionsType } from 'embla-carousel'
import { motion, AnimatePresence } from "framer-motion"
const options: EmblaOptionsType = { align: 'end', loop: true }

import img1 from "../../public/assets/Blender/blackblender.jpg";
import img2 from "../../public/assets/Blender/blueblender.jpg";
import img3 from "../../public/assets/Blender/coconatblender.jpg";
import img4 from "../../public/assets/Blender/iceblender.jpg";
import img5 from "../../public/assets/Blender/redblender.jpg";
import Link from 'next/link'

export const sliderContent = [
  {
    img: img1,
    heading: "BlendRas",
    subHeading: "Portable Juicer – Carbon Black",
    information:
      "Powerful portable juicer for smoothies, shakes, and fresh juices anywhere. Compact, rechargeable, and easy to clean.",
    href: "/products/portable-juicer?variant=black",
  },
  {
    img: img2,
    heading: "BlendRas",
    subHeading: "Portable Juicer – Ocean Blue",
    information:
      "Blend on the go with a high-speed motor and long-lasting battery. Perfect for gym, travel, and office.",
    href: "/products/portable-juicer?variant=blue",
  },
  {
    img: img3,
    heading: "BlendRas",
    subHeading: "Portable Juicer – Coconut White",
    information:
      "Minimal design with maximum power. Crush fruits and ice effortlessly in seconds.",
    href: "/products/portable-juicer?variant=Coconot",
  },
  {
    img: img4,
    heading: "BlendRas",
    subHeading: "Portable Juicer – Ice Grey",
    information:
      "Sharp stainless-steel blades with leak-proof design for everyday blending.",
    href: "/products/portable-juicer?variant=ice",
  },
  {
    img: img5,
    heading: "BlendRas",
    subHeading: "Portable Juicer – Ruby Red",
    information:
      "Stylish, powerful, and portable. Your daily nutrition companion.",
    href: "/products/portable-juicer?variant=ruby",
  },
];

type InformativeSliderProps = {
  className?: string;
};

const InformativeSlider = ({ className }: InformativeSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, ...options },
    // [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const updateButtons = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateButtons()
    emblaApi.on('select', updateButtons)
    emblaApi.on('reInit', updateButtons)

    return () => {
      emblaApi.off('select', updateButtons)
      emblaApi.off('reInit', updateButtons)
    }
  }, [emblaApi, updateButtons])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
    emblaApi?.plugins()?.autoplay?.reset()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
    emblaApi?.plugins()?.autoplay?.reset()
  }, [emblaApi])

  return (
    <section className={`${className} relative w-full`}>
      {/* Navigation Arrows - Positioned at top left */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="absolute top-[2px] left-[calc(15%)] z-20 flex gap-0 bg-white rounded-none shadow-lg overflow-hidden">
        <button onClick={scrollPrev} disabled={!canPrev} aria-label="Previous slide" className=" group relative cursor-pointer h-12 w-12 flex items-center justify-center overflow-hidden border-r border-gray-200 disabled:opacity-40 " >
            {/* Hover background */}
            <span className=" absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 " />

            {/* Icon */}
            <ArrowLeft className=" relative z-10 h-6 w-6 text-black transition-colors duration-300 group-hover:text-white " />
        </button>

        <button onClick={scrollNext} disabled={!canNext} aria-label="Next slide" className=" group relative cursor-pointer h-12 w-12 flex items-center justify-center overflow-hidden disabled:opacity-40 " >
            {/* Hover background */}
            <span className=" absolute inset-0 bg-black translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 " />

            {/* Icon */}
            <ArrowRight className=" relative z-10 h-6 w-6 text-black transition-colors duration-300 group-hover:text-white " />
        </button>

      </motion.div>

      {/* Carousel */}
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex">
          {sliderContent.map((slide, index) => {
            const isActive = index === selectedIndex

            return (
              <div key={index} className="flex-[0_0_85%] min-w-0 -mr-px">
                {/* Animated content wrapper */}
                <div className={`relative transition-all duration-500 ease-out bg-[#fff] flex items-center h-full`}>
                {isActive ? (
                  /* Active slide: 15% image + 85% content */
                  <div className="relative grid grid-cols-[350px_1fr] h-screen w-full">
                    <AnimatePresence mode="wait">
                      <motion.div className={`py-10 px-5 w-[350px] backdrop-blur-md bg-white/90 top-1/2 -translate-y-1/2 z-200 absolute transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        <motion.p key={`content-${index}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-[#000] text-[14px] font-[500] mb-1">{slide.heading}</motion.p>
                        <motion.h2 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  className="text-[#000] text-[28px] font-[700] leading-[38px] mb-2">{slide.subHeading}</motion.h2>
                        <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  className="text-[#000] text-[14px] font-[500] mb-2">{slide.information}</motion.p>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  >
                          <Link
                            className="backdrop-blur-md bg-white/90 py-2 mx-auto text-center text-black inline-block w-[150px] px-3 my-3 hover:bg-gray-200 transition-colors duration-300 border-[#000] hover:font-[700] border-[1px] rounded-[4px]"
                            href={slide.href}
                          >
                            Shop now
                          </Link>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>

                    <motion.div key={`image-${index}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: "easeOut" }} className="absolute left-[15%] top-0 w-[85%] h-full">
                      <img 
                        src={slide.img.src} 
                        alt={slide.heading} 
                        className={`w-full ${isActive ? 'h-[100vh]' : 'h-[75vh]'} object-cover aspect-3/2`}
                      />
                    </motion.div>
                  </div>
                ) : (
                    <motion.img initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease: "easeOut" }}
                      src={slide.img.src} 
                      alt={slide.heading} 
                      className={`w-full ${isActive ? 'h-[100vh]' : 'h-[75vh]'} object-cover aspect-3/2`} 
                    />
                )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default InformativeSlider