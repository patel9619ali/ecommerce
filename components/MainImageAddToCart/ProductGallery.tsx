import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsDown, ChevronsUp, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import img1 from "../../public/assets/cartImages/dynasty-headphone-blackgold-01.jpg";
import img2 from "../../public/assets/cartImages/dynasty-headphone-black-02.jpg";
import img3 from "../../public/assets/cartImages/dynasty-headphone-black-03.jpg";
import img4 from "../../public/assets/cartImages/dynasty-headphone-black-04.jpg";
import img5 from "../../public/assets/cartImages/dynasty-headphone-1.jpg";

const cartImages = [img1, img2, img3, img4, img5];

export const ProductGallery = () => {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const selected = mainApi.selectedScrollSnap();
    setSelectedIndex(selected);
    thumbApi.scrollTo(selected);
  }, [mainApi, thumbApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);

    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  const scrollPrev = useCallback(() => {
    mainApi?.scrollPrev();
  }, [mainApi]);

  const scrollNext = useCallback(() => {
    mainApi?.scrollNext();
  }, [mainApi]);

  return (
    <section className="w-full grid lg:grid-cols-[3fr_1fr] gap-4">
      {/* Main Carousel */}
      <div className="relative mb-3 group">
        <div className="overflow-hidden rounded-xl" ref={mainRef}>
          <div className="flex">
            {cartImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                <Dialog>
                    <DialogTrigger asChild>
                    <img
                        src={image.src}
                        alt="cart image"
                        className="w-full h-auto object-cover aspect-3/2 cursor-pointer"
                    />
                    </DialogTrigger>

                    <DialogContent className="bg-white p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[440px] max-w-full xs:h-auto fixed xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] border-none [&>button]:hidden z-200 gap-0">
                    <DialogHeader className="bg-[#053E54] items-center relative flex flex-row justify-between items-center xs:px-6 px-4 xs:py-5 py-2 gap-0">
                        <DialogTitle className="text-white text-start xs:text-[23px] text-md font-semibold break-all">Preview</DialogTitle>
                        <DialogClose className="text-white bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                                <X size={30} fill="#fff" />
                            </DialogClose>
                    </DialogHeader>
                    <div className="overflow-y-scroll p-3 space-y-3 custom-scroll h-full xs:h-[70vh]">
                        {cartImages.map((image, index) => (
                        <img key={index}
                            src={image.src}
                            alt="Cart Large"
                            className="w-full h-auto object-cover aspect-video rounded-lg"
                        />
                        ))}
                    </div>
                    </DialogContent>
                </Dialog>
                </div>
            ))}
            </div>
        </div>

        {/* Navigation Buttons */}
        <div onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bottom-0 w-12 h-12 flex items-center justify-center group w-8 rounded-full cursor-pointer bg-gradient-to-r from-white/60 to-white/60 ml-2 hover:bg-[#fff] transition-colors" >
          <ChevronLeft className="p-2 h-8 w-8 text-[#0005c] group-hover:text-[#fff5c] transition-colors" />
        </div>
        <div onClick={scrollNext} className="absolute rounded-full right-2 top-1/2 -translate-y-1/2 bottom-0 w-12 h-12 flex items-center justify-center group w-8 rounded-full cursor-pointer bg-gradient-to-r from-white/60 to-white/60 ml-2 hover:bg-[#fff] transition-colors" >
          <ChevronRight className="p-2 h-8 w-8 text-[#0005c] group-hover:text-[#fff5c] transition-colors" />
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative group bg-transparent rounded-md overflow-hidden" >
        <div className="overflow-hidden" ref={thumbRef}>
          <div className="flex flex-col gap-3 w-max-content">
            {cartImages.map((image, index) => (
              <button key={index} onClick={() => onThumbClick(index)} className={` w-[75px] h-[75px] rounded-[25%] border-[2px] overflow-hidden transition-colors duration-200 ${ index === selectedIndex ? "border-[#fff]" : "border-[#ffffff5c] hover:border-[#fff]" } `} >
                {/* INNER WRAPPER CONTROLS HOVER */}
                <div className="w-full h-full overflow-hidden rounded-[25%] hover:[&>img]:scale-110">
                  <img src={image.src} alt="Cart thumbnail" className={`cursor-pointer w-full h-full object-cover transition-transform duration-500 ease-out ${index === selectedIndex ? "scale-110" : "scale-100"} `} />
                </div>
              </button>
            ))}
          {/* Thumbnail Navigation Buttons */}
          <div className="flex gap-3 flex-col justify-between items-center">
            <div onClick={scrollPrev} className="group relative w-8 rounded-full cursor-pointer bg-gradient-to-r from-white/60 to-white/60 hover:bg-[#fff] transition-colors" >
                <ChevronsUp className="p-2 h-8 w-8 text-[#0005c] group-hover:text-[#fff5c] transition-colors" />
            </div>

            <div onClick={scrollNext} className="group relative w-8 rounded-full cursor-pointer bg-gradient-to-r from-white/60 to-white/60 hover:bg-[#fff] transition-colors" >
              <ChevronsDown className="p-2 h-8 w-8 text-[#0005c] group-hover:text-[#fff5c] transition-colors" />
            </div>
          </div>
          </div>
        </div>

      </div>

    </section>
  );
};
