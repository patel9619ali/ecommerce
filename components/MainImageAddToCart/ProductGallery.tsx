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
type Props = {
  variant: any;
};


export const ProductGallery = ({ variant }: Props) => {
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

  return (
    <section className="w-full grid lg:grid-cols-[4fr_1fr] gap-4">
      {/* Main Carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-[0]" ref={mainRef}>
          <div className="flex">
            {variant.images.map((image:any, index:any) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 cursor-zoom-in">
                <Dialog>
                    <DialogTrigger asChild>
                    <img
                        src={image.src}
                        alt={variant.name}
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
                        {variant.images.map((image:any, index:any) => (
                        <img key={index}
                            src={image.src}
                            alt={variant.name}
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

        <div onClick={scrollNext} className=" group absolute right-0 bottom-1 w-12 h-12 flex items-center justify-center cursor-pointer bg-black hover:bg-white transition-colors " >
          <ChevronRight
            className="h-6 w-6 text-white group-hover:text-black transition-colors"
            stroke="currentColor"
          />
        </div>

      </div>

      {/* Thumbnail Carousel */}
    <div className="relative bg-transparent rounded-[0]">
      <div ref={thumbRef}>
        <div className="flex flex-col gap-3 w-max ">
          
          {/* ✅ SCROLL CONTAINER */}
          <div className="flex flex-col gap-3 h-[300px] overflow-y-auto custom-scroll  cursor-pointer">
            {variant.images.map((image:any, index:any) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`cursor-pointer
                  w-[75px] h-[75px] rounded-[25%]
                  border-[2px] overflow-hidden
                  transition-colors duration-200
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
          <div className="flex gap-3 justify-center items-center cursor-pointer">
            <div
              onClick={scrollPrev}
              className="group w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center transition-colors"
            >
              <ChevronsUp className="text-white group-hover:text-black" />
            </div>

            <div
              onClick={scrollNext}
              className="group w-8 h-8 bg-black/60 hover:bg-white flex items-center justify-center transition-colors"
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
