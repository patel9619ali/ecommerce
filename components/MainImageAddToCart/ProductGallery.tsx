import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

import img1 from "../../public/assets/cartImages/dynasty-headphone-1.jpg";
import img2 from "../../public/assets/cartImages/dynasty-headphone-black-02.jpg";
import img3 from "../../public/assets/cartImages/dynasty-headphone-black-03.jpg";
import img4 from "../../public/assets/cartImages/dynasty-headphone-black-04.jpg";

const cartImages = [img1, img2, img3, img4];

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
    <section className="w-full">
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
        <div
        onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bottom-0 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer bg-gradient-to-r from-white/60 to-white/60"
        >
          <ChevronLeft className="h-8 w-8 text-[#053E54] rounded-md"/>
        </div>
        <div
        onClick={scrollNext}
        className="absolute rounded-full right-2 top-1/2 -translate-y-1/2  bottom-0 w-12 h-12 flex items-center justify-center cursor-pointer bg-gradient-to-l from-white/60 to-white/60"
        >
        <ChevronRight className="h-8 w-8 text-[#053E54] rounded-md" />
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="relative group bg-transparent rounded-md overflow-hidden" >
        <div className="overflow-hidden" ref={thumbRef}>
          <div className="flex gap-3">
            {cartImages.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`flex-[0_0_22.4%] overflow-hidden ${
                  index === selectedIndex
                    ? "border-[2px] border-[#053E54] rounded-md"
                    : "border-[2px] border-[#C9C9C9] rounded-md hover:opacity-100"
                }`}
              >
                <img
                  src={image.src}
                  alt='Cart thumbnail'
                  className="w-full h-auto object-cover aspect-3/2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation Buttons */}
        <div onClick={scrollPrev} className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/100 to-transparent flex items-center justify-start cursor-pointer rounded-md" >
            <ChevronLeft className="h-6 w-6 text-[#053E54]" />
        </div>

        <div onClick={scrollNext} className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/100 to-transparent flex items-center justify-end cursor-pointer rounded-md" >
            <ChevronRight className="h-6 w-6 text-[#053E54]" />
        </div>

      </div>

      {/* Image Counter */}
      {/* <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Click on Image to enlarge • {selectedIndex + 1} / {carImages.length}
        </p>
      </div> */}
    </section>
  );
};
