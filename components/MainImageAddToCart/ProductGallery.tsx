import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsDown, ChevronsUp, ChevronUp, X, ZoomInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
type Props = {
  variant: any;
};


export const ProductGallery = ({ variant }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    axis: "y",
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
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

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



useEffect(() => {
  const container = containerRef.current;
  const cursor = cursorRef.current;

  if (!container || !cursor) return;

  const move = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    cursor.style.left = `${e.clientX - rect.left}px`;
    cursor.style.top = `${e.clientY - rect.top}px`;
  };

  const show = () => (cursor.style.opacity = "1");
  const hide = () => (cursor.style.opacity = "0");

  container.addEventListener("mousemove", move);
  container.addEventListener("mouseenter", show);
  container.addEventListener("mouseleave", hide);

  return () => {
    container.removeEventListener("mousemove", move);
    container.removeEventListener("mouseenter", show);
    container.removeEventListener("mouseleave", hide);
  };
}, []);
const [zoomOpen, setZoomOpen] = useState(false);
  return (
    <section className="w-full grid lg:grid-cols-[4fr_1fr] gap-4">
      {/* Main Carousel */}
      <div ref={containerRef} className="relative">
        <span ref={cursorRef} className="pointer-events-none absolute hidden lg:flex items-center justify-center w-18 h-18 rounded-full bg-black/60 text-white -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 z-50" id="zoom-cursor"><PlusIcon width={45} strokeWidth={1} height={45}/></span>
        <div className="overflow-hidden rounded-[0] relative cursor-none" ref={mainRef}>
          <div className="flex relative group cursor-none">
            {variant.images.map((image:any, index:any) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 hidden-cursor">
                <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
                    <DialogTrigger asChild>
                      <img src={image.src} alt={variant.name} className="w-full h-auto object-cover select-none cursor-pointer lg:cursor-none" />
                    </DialogTrigger>

                    <DialogContent className="bg-white p-0 overflow-hidden xs:rounded-[20px] rounded-none bottom-[0] border-none [&>button]:hidden z-200 gap-0 w-full xs:w-auto xs:max-h-[90vh] h-full !max-w-[100vw] xs:max-w-[100vw] z-999">
                    <DialogHeader className="lg:bg-[#000] bg-transparent items-center lg:relative absolute w-full flex flex-row justify-end items-center xs:px-6 px-4 xs:py-5 py-2 gap-0">
                        <DialogTitle className="text-white hidden text-start xs:text-[23px] text-md font-semibold break-all">Preview</DialogTitle>
                        <DialogClose className="lg:bg-[#000] bg:transparent text-white hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                                <X size={30} fill="#fff" />
                            </DialogClose>
                    </DialogHeader>
                    <div className="lg:bg-transparent bg-[#000] overflow-y-scroll lg:p-3 p-0 lg:space-y-3 space-y-0 custom-scroll h-full xs:h-[70vh]">
                        {variant.images.map((image:any, index:any) => (
                        <img key={index}
                            src={image.src}
                            alt={variant.name}
                            className="w-full h-auto object-cover aspect-video lg:rounded-lg rounded-none"
                        />
                        ))}
                    </div>
                    </DialogContent>
                </Dialog>
                </div>
            ))}
            </div>
            {/* Navigation Buttons */}
        <div
          onMouseEnter={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
          }}
          onMouseLeave={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "1";
          }}
          onClick={scrollPrev}
          className="
            group absolute right-10 bottom-1
            w-12 h-12
            flex items-center justify-center
            cursor-pointer
            bg-black hover:bg-white
            transition-colors
          "
        >
          <ChevronLeft
            className="h-6 w-6 text-white group-hover:text-black transition-colors"
            stroke="currentColor"
          />
        </div>

        <div
          onMouseEnter={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
          }}
          onMouseLeave={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "1";
          }} onClick={scrollNext} className=" group absolute right-0 bottom-1 w-12 h-12 flex items-center justify-center cursor-pointer bg-black hover:bg-white transition-colors " >
          <ChevronRight
            className="h-6 w-6 text-white group-hover:text-black transition-colors"
            stroke="currentColor"
          />
        </div>
        </div>
        {/* MOBILE ZOOM BUTTON (FIXED) */}
        <div className="lg:hidden absolute top-3 right-3 z-30 bg-black/80 p-2 rounded-full cursor-pointer" onClick={() => setZoomOpen(true)} >
          <ZoomInIcon width={24} height={24} className="text-white" />
        </div>

      </div>

       


      {/* Thumbnail Carousel */}
    <div className="relative bg-transparent rounded-[0] overflow-x-auto">
      <div ref={thumbRef}>
        <div className="flex lg:flex-col flex-row gap-3 w-max ">
          
          {/* ✅ SCROLL CONTAINER */}
          <div className="flex lg:flex-col flex-row gap-3 lg:h-[300px] h-full overflow-y-auto custom-scroll cursor-pointer">
            {variant.images.map((image:any, index:any) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`cursor-pointer
                  lg:w-[75px] lg:h-[75px] w-[60px] h-[60px] rounded-[25%]
                  border-[2px] overflow-hidden
                  transition-colors duration-200 lg:mb-0 mb-5
                  ${
                    index === selectedIndex
                      ? "border-[#fff]"
                      : "border-[#ffffff5c] hover:border-[#fff]"
                  }
                `}
              >
                <div className="w-full h-full overflow-hidden rounded-[25%] hover:[&>img]:scale-110">
                  <img
                    src={image.src}
                    alt="Cart thumbnail"
                    className={`
                      w-full h-full object-cover
                      transition-transform duration-500 ease-out
                      ${index === selectedIndex ? "scale-110" : "scale-100"}
                    `}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="lg:flex gap-3 justify-center items-center hidden">
            <div
              onClick={scrollPrev}
              className="cursor-pointer group w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center transition-colors"
            >
              <ChevronsUp className="text-white group-hover:text-black" />
            </div>

            <div
              onClick={scrollNext}
              className="cursor-pointer group w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center transition-colors"
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
