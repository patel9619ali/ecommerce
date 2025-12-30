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
      <div className="relative rounded-xl overflow-hidden bg-black cursor-pointer ">
        <Image src={src} alt={alt} width={400} height={400} className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      {/* MAIN IMAGE */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-xl bg-black cursor-crosshair"
        style={{ width: 500, height: 500 }} // 👈 control main image size here
      >
        <Image src={src} alt={alt} fill priority className="object-cover" />

        {/* LENS */}
        {isHovering && (
          <div
            className="cursor-pointer absolute pointer-events-none border border-white/60 bg-white/10"
            style={{
              width: 120,
              height: 120,
              left: `calc(${pos.x}% - 60px)`,
              top: `calc(${pos.y}% - 60px)`,
            }}
          />
        )}
      </div>

      {/* ZOOM PANEL */}
      <div
        className="relative overflow-hidden rounded-xl bg-black hidden lg:block"
        style={{ width: 350, height: 350 }} // 👈 zoom panel size here
      >
        {isHovering && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${zoomScale * 100}%`,
              backgroundPosition: `${pos.x}% ${pos.y}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
