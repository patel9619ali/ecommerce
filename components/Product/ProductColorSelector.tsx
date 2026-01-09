"use client";
import Image from "next/image";

export function ProductColorSelector({
  product,
  activeKey,
  onHover,
  onLeave,
  onSelect,
}: any) {
  return (
    <div>
      <p className="text-white font-medium mb-2">
        Colour: <span className="font-semibold">{activeKey}</span>
      </p>

      <div className="flex gap-3">
        {product.variants.map((v: any) => (
          <button
            key={v.key}
            onMouseEnter={() => onHover(v.key)}
            onMouseLeave={onLeave}
            onClick={() => onSelect(v.key)}
            className={`border rounded-lg p-1 transition
              ${
                v.key === activeKey
                  ? "border-white"
                  : "border-white/30 hover:border-white"
              }`}
          >
            <Image
              src={v.images[0]}
              alt={v.name}
              width={60}
              height={60}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
