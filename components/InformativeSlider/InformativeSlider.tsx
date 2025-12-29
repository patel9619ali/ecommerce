'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EmblaOptionsType } from 'embla-carousel'
import { motion, AnimatePresence } from "framer-motion"
const options: EmblaOptionsType = { align: 'end', loop: true }

import img1 from "../../public/assets/images/HeadPhone/slider-img-01.jpg";
import img2 from "../../public/assets/images/HeadPhone/slider-img-02.jpg";
import img3 from "../../public/assets/images/HeadPhone/slider-img-03.jpg";
import img4 from "../../public/assets/images/HeadPhone/slider-img-02.jpg";
import img5 from "../../public/assets/images/HeadPhone/slider-img-01.jpg";
import Link from 'next/link'

export const sliderContent = [
    {
        img: img1,
        heading: "DYNASTY HEADPHONE",
        subHeading: "Like nothing you've heard before",
        information:
        "Depth, detail and delight. Dialed up beyond expectation. This is, quite simply, our finest headphone experience.",
        href: "/products/dynasty-headphone",
    },
    {
        img: img2,
        heading: "IMMERSIVE SOUND",
        subHeading: "Feel every beat",
        information:
        "Precision-tuned acoustics deliver deep bass, crisp mids, and ultra-clear highs for a powerful listening experience.",
        href: "/products/immersive-sound",
    },
    {
        img: img3,
        heading: "PREMIUM DESIGN",
        subHeading: "Built for comfort",
        information:
        "Crafted with premium materials and ergonomic design to ensure comfort during long listening sessions.",
        href: "/products/premium-design",
    },
    {
        img: img4,
        heading: "WIRELESS FREEDOM",
        subHeading: "No wires. No limits.",
        information:
        "Seamless Bluetooth connectivity with ultra-low latency and long-lasting battery performance.",
        href: "/products/wireless-freedom",
    },
    {
        img: img5,
        heading: "STUDIO QUALITY",
        subHeading: "Hear it as it was meant to be",
        information:
        "Studio-grade audio engineered for professionals and audiophiles alike.",
        href: "/products/studio-quality",
    },
];

const InformativeSlider: React.FC = () => {
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
    <section className="relative w-full">
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
                <div className={`relative transition-all duration-500 ease-out bg-[#000] flex items-center h-full`}>
                {isActive ? (
                  /* Active slide: 15% image + 85% content */
                  <div className="relative grid grid-cols-[350px_1fr] h-screen w-full">
                    <AnimatePresence mode="wait">
                      <motion.div className={`py-10 px-5 w-[350px] bg-[#000000bd] top-1/2 -translate-y-1/2 z-200 absolute transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        <motion.p key={`content-${index}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-[#fff] text-[14px] font-[500] mb-1">{slide.heading}</motion.p>
                        <motion.h2 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  className="text-[#fff] text-[28px] font-[700] leading-[38px] mb-2">{slide.subHeading}</motion.h2>
                        <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  className="text-[#fff] text-[14px] font-[500] mb-2">{slide.information}</motion.p>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  >
                          <Link
                            className="bg-white py-2 mx-auto text-center text-black inline-block w-[150px] px-3 my-3 hover:bg-gray-200 transition-colors duration-300"
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