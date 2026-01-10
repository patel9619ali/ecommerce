"use client";

import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";

type ImageHoverZoomProps = {
  src: string | StaticImageData;
  alt: string;
  zoomScale?: number;
};

export default function ImageHoverZoom({
  src,
  alt,
  zoomScale = 2.5,
}: ImageHoverZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  const imageUrl = typeof src === "string" ? src : src.src;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  if (isTouch) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-black cursor-pointer z-999">
        <Image src={src} alt={alt} width={400} height={400} className="w-full object-cover" />
      </div>
    );
  }

return (
  <div className="relative flex">
    {/* MAIN IMAGE */}
    <div ref={containerRef} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onMouseMove={handleMouseMove} className="relative overflow-hidden rounded-xl bg-black w-full aspect-square lg:max-w-full lg:mx-auto" >
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover" />
      {/* LENS */}
      {isHovering && (
        <div
          className="absolute pointer-events-none border border-white/60 bg-white/10"
          style={{
            width: 120,
            height: 120,
            left: `calc(${pos.x}% - 100px)`,
            top: `calc(${pos.y}% - 60px)`,
          }}
        />
      )}
    </div>




    {/* ZOOM PANEL (ABSOLUTE – NO LAYOUT SHIFT) */}
    {isHovering && (
      <div
        className="absolute top-0 2xl:left-[600px] xl:left-[500px] lg:left-[200px] hidden lg:block rounded-xl overflow-hidden bg-black"
        style={{ width: "100%", height: "100%", zIndex: "999" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      </div>
    )}
  </div>
);

}
