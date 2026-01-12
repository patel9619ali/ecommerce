"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  X,
  ZoomInIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

type Props = {
  variant: any;
};

export const ProductGallery = ({ variant }: Props) => {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  // ✅ MOBILE thumbnails (horizontal)
  const [thumbXRef, thumbXApi] = useEmblaCarousel({
    axis: "x",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  // ✅ DESKTOP thumbnails (vertical)
  const [thumbYRef, thumbYApi] = useEmblaCarousel({
    axis: "y",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);

    thumbXApi?.scrollTo(index);
    thumbYApi?.scrollTo(index);
  }, [mainApi, thumbXApi, thumbYApi]);

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

  const scrollPrev = () => mainApi?.scrollPrev();
  const scrollNext = () => mainApi?.scrollNext();

  return (
    <section className="w-full grid lg:grid-cols-[4fr_1fr] gap-4">
      {/* ================= MAIN CAROUSEL ================= */}
      <div className="relative">
        <div
          ref={mainRef}
          className="overflow-hidden relative cursor-pointer"
        >
          <div className="flex">
            {variant.images.map((image: any, index: number) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
                  <DialogTrigger asChild>
                    <img
                      src={image.src}
                      alt={variant.name}
                      className="w-full lg:h-[550px] h-full object-cover select-none cursor-pointer"
                    />
                  </DialogTrigger>

                  {/* ================= ZOOM MODAL ================= */}
                  <DialogContent className="bg-white p-0 overflow-hidden xs:rounded-[20px] rounded-none bottom-[0] border-none [&>button]:hidden z-200 gap-0 w-full xs:w-auto xs:max-h-[90vh] h-full !max-w-[100vw] xs:max-w-[100vw] z-999">
                    <DialogHeader className="bg-transparent items-center absolute w-full flex flex-row justify-end items-center lg:top-5 lg:right-5 xs:px-6 px-4 xs:py-5 py-2 gap-0">
                        <DialogTitle className="text-white hidden text-start xs:text-[23px] text-md font-semibold break-all">Preview</DialogTitle>
                        <DialogClose className="group lg:bg-[#fff] bg:transparent text-white hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                                <X size={30} fill="#fff" stroke="#000" className="troke-black transition-colors duration-200 group-hover:stroke-white"/>
                            </DialogClose>
                    </DialogHeader>

                    <div className="lg:bg-transparent bg-[#000] overflow-y-scroll lg:p-0 p-0 lg:space-y-0 space-y-0 custom-scroll h-full xs:h-[70vh]">
                      {variant.images.map((img: any, i: number) => (
                        <img
                          key={i}
                          src={img.src}
                          alt={variant.name}
                          className="w-full h-auto object-cover aspect-video rounded-none"
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>

          {/* ================= NAV BUTTONS ================= */}
          <div
            onClick={scrollPrev}
            className="absolute right-[43px] bottom-1 w-[43px] h-[43px] flex items-center justify-center cursor-pointer bg-black/60 hover:bg-white group z-10"
          >
            <ChevronLeft className="text-white group-hover:text-black" />
          </div>

          <div
            onClick={scrollNext}
            className="absolute right-0 bottom-1 w-[43px] h-[43px] flex items-center justify-center cursor-pointer bg-black/60 hover:bg-white group z-10"
          >
            <ChevronRight className="text-white group-hover:text-black" />
          </div>
        </div>

        {/* ================= MOBILE ZOOM ICON ================= */}
        <div
          className="absolute top-3 right-3 z-30 bg-black/80 p-2 rounded-full cursor-pointer"
          onClick={() => setZoomOpen(true)}
        >
          <ZoomInIcon width={24} height={24} className="text-white" />
        </div>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <div className="relative w-max">
        <div className="lg:hidden" ref={thumbXRef}>
          <div className="flex lg:flex-col gap-3">
            <div className="flex lg:flex-col gap-3 lg:h-[450px] overflow-y-auto custom-scroll">
              {variant.images.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => onThumbClick(index)}
                  className={`lg:w-[100px] lg:h-[150px] w-[60px] h-[60px] rounded-[8px] border-2 overflow-hidden transition-colors ${
                    index === selectedIndex
                      ? "border-white"
                      : "border-white/40 hover:border-white"
                  }`}
                >
                  <img
                    src={image.src}
                    alt="Thumbnail"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      index === selectedIndex ? "scale-110" : "scale-100"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* THUMB NAV */}
            <div className="hidden lg:flex gap-3 justify-center">
              <div
                onClick={scrollPrev}
                className="w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center cursor-pointer group"
              >
                <ChevronsUp className="text-white group-hover:text-black" />
              </div>

              <div
                onClick={scrollNext}
                className="w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center cursor-pointer group"
              >
                <ChevronsDown className="text-white group-hover:text-black" />
              </div>
            </div>
          </div>
        </div>
        <div  className="hidden lg:block" ref={thumbYRef}>
          <div className="flex lg:flex-col gap-3">
            <div className="flex lg:flex-col gap-3 lg:h-[450px] overflow-y-auto custom-scroll">
              {variant.images.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => onThumbClick(index)}
                  className={`lg:w-[100px] lg:h-[150px] w-[60px] h-[60px] rounded-[8px] border-2 overflow-hidden transition-colors ${
                    index === selectedIndex
                      ? "border-white"
                      : "border-white/40 hover:border-white"
                  }`}
                >
                  <img
                    src={image.src}
                    alt="Thumbnail"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      index === selectedIndex ? "scale-110" : "scale-100"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* THUMB NAV */}
            <div className="hidden lg:flex gap-3 justify-center">
              <div
                onClick={scrollPrev}
                className="w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center cursor-pointer group"
              >
                <ChevronsUp className="text-white group-hover:text-black" />
              </div>

              <div
                onClick={scrollNext}
                className="w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center cursor-pointer group"
              >
                <ChevronsDown className="text-white group-hover:text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
