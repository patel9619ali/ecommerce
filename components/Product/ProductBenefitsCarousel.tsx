"use client";
import useEmblaCarousel from "embla-carousel-react";

export function ProductBenefitsCarousel({ benefits }: any) {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false });

  return (
    <div ref={emblaRef} className="overflow-hidden py-2">
      <div className="flex gap-4">
        {benefits.map((b: any) => (
          <div key={b.id} className="text-center border rounded-lg p-3 text-white" >
            <div className="text-[10px] font-semibold">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
