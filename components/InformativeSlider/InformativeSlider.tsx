'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EmblaOptionsType } from 'embla-carousel'
import { motion, AnimatePresence } from "framer-motion"
const options: EmblaOptionsType = { align: 'end', loop: true }
import { Product } from '@/data/types'
import Link from 'next/link'

type InformativeSliderProps = {
  className?: string;
  productData?: Product[];
};

const InformativeSlider = ({ className,productData }: InformativeSliderProps) => {
  const productDataType =  productData?.[0];
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
          {productDataType?.variant.map((variantData, index) => {
            const isActive = index === selectedIndex
            const variantImage = variantData.images?.[0];
            return (
              <div key={index} className="flex-[0_0_85%] min-w-0 -mr-px">
                {/* Animated content wrapper */}
                <div className={`relative transition-all duration-500 ease-out bg-[#fff] flex items-center h-full`}>
                {isActive ? (
                  /* Active slide: 15% image + 85% content */
                  <div className="relative grid grid-cols-[350px_1fr] h-screen w-full">
                    <AnimatePresence mode="wait">
                      <motion.div className={`py-10 px-5 w-[350px] backdrop-blur-md bg-white/90 top-1/2 -translate-y-1/2 z-200 absolute transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        <motion.p key={`content-${index}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-[#000] text-[14px] font-[500] mb-1">{productDataType.title}</motion.p>
                        <motion.h2 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  className="text-[#000] text-[28px] font-[700] leading-[38px] mb-2">{`Portable Juicer - ${variantData.colorName}`}</motion.h2>
                        <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  className="text-[#000] text-[14px] font-[500] mb-2">{productDataType.description}</motion.p>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, delay: 0.3 }}  >
                          <Link
                            className="backdrop-blur-md bg-white/90 py-2 mx-auto text-center text-black inline-block w-[150px] px-3 my-3 hover:bg-gray-200 transition-colors duration-300 border-[#000] hover:font-[700] border-[1px] rounded-[4px]"
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/products/${productDataType?.slug}?variant=${variantData?.sku}`}
                          >
                            Shop now
                          </Link>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>

                    <motion.div key={`image-${index}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: "easeOut" }} className="absolute left-[15%] top-0 w-[85%] h-full">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_CMS_URL}${variantImage?.url}`}
                        alt={variantImage?.name} 
                        className={`w-full ${isActive ? 'h-[100vh]' : 'h-[75vh]'} object-cover aspect-3/2`}
                      />
                    </motion.div>
                  </div>
                ) : (
                    <motion.img initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease: "easeOut" }}
                      src={`${process.env.NEXT_PUBLIC_CMS_URL}${variantImage?.url}`}
                      alt={variantImage?.name}
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