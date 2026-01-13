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

const MOBILE_THUMB_LIMIT = 4;

export const ProductGallery = ({ variant }: Props) => {
  /* ================= EMBLA ================= */
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });

  const [thumbXRef, thumbXApi] = useEmblaCarousel({
    axis: "x",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [thumbYRef, thumbYApi] = useEmblaCarousel({
    axis: "y",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  /* ================= STATE ================= */
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [thumbDialogOpen, setThumbDialogOpen] = useState(false);

  /* ================= HELPERS ================= */
  const mobileThumbs = variant.images.slice(0, MOBILE_THUMB_LIMIT);
  const extraCount = variant.images.length - MOBILE_THUMB_LIMIT;

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

  /* ================= JSX ================= */
  return (
    <section className="w-full grid lg:grid-cols-[4fr_1fr] gap-4">
      {/* ================= MAIN CAROUSEL ================= */}
      <div className="relative">
        <div ref={mainRef} className="overflow-hidden relative cursor-pointer">
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

                  {/* ZOOM MODAL */}
                  <DialogContent className="bg-white p-0 overflow-hidden xs:rounded-[20px] rounded-none bottom-[0] border-none [&>button]:hidden z-200 gap-0 w-full xs:w-auto xs:max-h-[90vh] h-full !max-w-[100vw] xs:max-w-[100vw] z-999">
                    <DialogHeader className="bg-transparent items-center absolute w-full flex flex-row justify-end items-center lg:top-5 lg:right-5 xs:px-6 px-4 xs:py-5 py-2 gap-0">
                        <DialogTitle className="text-white hidden text-start xs:text-[23px] text-md font-semibold break-all">Preview</DialogTitle>
                        <DialogClose className="group lg:bg-[#fff] bg:transparent text-white hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                                <X size={30} fill="#fff" stroke="#000" className="troke-black transition-colors duration-200 group-hover:stroke-white"/>
                            </DialogClose>
                    </DialogHeader>

                    <div className="bg-black h-full overflow-y-auto">
                      {variant.images.map((img: any, i: number) => (
                        <img
                          key={i}
                          src={img.src}
                          alt={variant.name}
                          className="w-full object-cover"
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>

          {/* NAV */}
          <div
            onClick={scrollPrev}
            className="absolute right-[43px] bottom-1 w-[43px] h-[43px] bg-black/60 flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="text-white" />
          </div>

          <div
            onClick={scrollNext}
            className="absolute right-0 bottom-1 w-[43px] h-[43px] bg-black/60 flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="text-white" />
          </div>
        </div>

        {/* MOBILE ZOOM ICON */}
        <div
          onClick={() => setZoomOpen(true)}
          className="absolute top-3 right-3 bg-black/80 p-2 rounded-full cursor-pointer lg:hidden"
        >
          <ZoomInIcon className="text-white" />
        </div>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <div className="relative w-full lg:w-max">
        {/* ---------- MOBILE (Amazon Style) ---------- */}
        <div className="lg:hidden mt-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {mobileThumbs.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`w-[60px] h-[60px] rounded-lg border-2 overflow-hidden ${
                  index === selectedIndex
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={image.src}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}

            {extraCount > 0 && (
              <button
                onClick={() => setThumbDialogOpen(true)}
                className="w-[60px] h-[60px] rounded-lg border-2 border-dashed border-gray-400 bg-black/70 text-white text-sm font-semibold"
              >
                +{extraCount}
              </button>
            )}
          </div>
        </div>

        {/* ---------- DESKTOP (UNCHANGED) ---------- */}
        <div className="hidden lg:block" ref={thumbYRef}>
          <div className="flex flex-col gap-3 h-[450px] overflow-y-auto">
            {variant.images.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`w-[100px] h-[150px] rounded-lg border-2 overflow-hidden ${
                  index === selectedIndex
                    ? "border-white"
                    : "border-white/40"
                }`}
              >
                <img
                  src={image.src}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={scrollPrev}
              className="w-8 h-8 bg-black/60 flex items-center justify-center"
            >
              <ChevronsUp className="text-white" />
            </button>
            <button
              onClick={scrollNext}
              className="w-8 h-8 bg-black/60 flex items-center justify-center"
            >
              <ChevronsDown className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE THUMB DIALOG ================= */}
      <Dialog open={thumbDialogOpen} onOpenChange={setThumbDialogOpen}>
        <DialogContent className=" bottom-0 top-auto rounded-t-2xl p-0 max-h-[75vh] w-full">
          <DialogHeader className="p-4 flex flex-row justify-between items-center border-b">
              <DialogTitle className="text-[#000] text-start xs:text-[23px] text-md font-semibold break-all">All Images</DialogTitle>
              <DialogClose className="group lg:bg-[#fff] bg:transparent text-white hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                <X size={30} fill="#fff" stroke="#000" className="troke-black transition-colors duration-200 group-hover:stroke-white"/>
              </DialogClose>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-3 px-4 pb-6 overflow-y-auto">
            {variant.images.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  onThumbClick(index);
                  setThumbDialogOpen(false);
                }}
                className={`aspect-square rounded-md overflow-hidden border-2 ${
                  index === selectedIndex
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={image.src}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
