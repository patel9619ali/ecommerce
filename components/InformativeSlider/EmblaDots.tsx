"use client";

import { motion } from "framer-motion";

type DotsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function EmblaDots({ count, activeIndex, onSelect }: DotsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="h-[3px]"
          >
            <motion.span
              layout
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
              }}
              className="block h-full rounded-full"
              style={{
                width: isActive ? 26 : 14,
                backgroundColor: isActive
                  ? "#ffffff"
                  : "rgba(255,255,255,0.35)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
