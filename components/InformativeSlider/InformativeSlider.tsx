'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EmblaOptionsType } from 'embla-carousel'
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
      <div className="absolute top-0 left-[calc(15%)] z-20 flex gap-0 bg-white rounded-none shadow-lg overflow-hidden">
        <button onClick={scrollPrev} disabled={!canPrev} aria-label="Previous slide" className=" group relative h-12 w-12 flex items-center justify-center overflow-hidden border-r border-gray-200 disabled:opacity-40 " >
            {/* Hover background */}
            <span
                className="
                absolute inset-0 bg-black
                translate-y-full
                transition-transform duration-300 ease-out
                group-hover:translate-y-0
                "
            />

            {/* Icon */}
            <ArrowLeft className=" relative z-10 h-6 w-6 text-black transition-colors duration-300 group-hover:text-white " />
        </button>

        <button
            onClick={scrollNext}
            disabled={!canNext}
            aria-label="Next slide"
            className=" group relative h-12 w-12 flex items-center justify-center overflow-hidden disabled:opacity-40 "
            >
            {/* Hover background */}
            <span
                className="
                absolute inset-0 bg-black
                translate-y-full
                transition-transform duration-300 ease-out
                group-hover:translate-y-0
                "
            />

            {/* Icon */}
            <ArrowRight
                className="
                relative z-10 h-6 w-6
                text-black
                transition-colors duration-300
                group-hover:text-white
                "
            />
        </button>

      </div>

      {/* Carousel */}
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex">
          {sliderContent.map((slide, index) => {
            const isActive = index === selectedIndex

            return (
              <div key={index} className="flex-[0_0_85%] min-w-0">
                {/* Animated content wrapper */}
                <div className={`relative transition-all duration-500 ease-out bg-[#000] flex items-center h-full`}>
                  <img 
                    src={slide.img.src} 
                    alt={slide.heading} 
                    className={`w-full ${isActive ? 'h-[100vh]' : 'h-[75vh]'} object-cover aspect-3/2`} 
                  />
                  <div className={`py-10 px-5 bg-[#000000bd] w-[350px] absolute transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-[#fff] text-[14px] font-[500] mb-1">{slide.heading}</p>
                    <h2 className="text-[#fff] text-[28px] font-[700] leading-[38px] mb-2">{slide.subHeading}</h2>
                    <p className="text-[#fff] text-[14px] font-[500] mb-2">{slide.information}</p>
                    <Link className='bg-[#fff] py-2 mx-auto text-center text-[#000] inline-block w-[150px] px-3 my-3' href={`${slide.href}`}>
                      Shop now
                    </Link>
                  </div>
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