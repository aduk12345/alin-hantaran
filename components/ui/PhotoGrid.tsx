"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIcon } from "./icons";
import { ImageLightbox } from "./ImageLightbox";

export function PhotoGrid({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-blush"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 768px) 40vw, 45vw"
              className="object-cover"
            />
            <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow-md transition-transform group-hover:scale-105">
              <ZoomIcon className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>

      {openIndex != null && (
        <ImageLightbox
          images={images}
          index={openIndex}
          alt={alt}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
