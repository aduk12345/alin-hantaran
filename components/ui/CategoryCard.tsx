"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Category } from "@/types/category";
import { formatIDR } from "@/lib/format";
import { ZoomIcon } from "./icons";
import { ImageLightbox } from "./ImageLightbox";

export function CategoryCard({ category }: { category: Category }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const startingPrice =
    category.pricing.length > 0
      ? Math.min(...category.pricing.map((p) => p.price))
      : null;

  return (
    <>
      <div className="group relative">
        <Link href={`/katalog/${category.slug}`} className="block">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-blush">
            {category.images[0] && (
              <Image
                src={category.images[0]}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
              <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
              {startingPrice != null && (
                <p className="mt-0.5 text-xs text-white/80">mulai Rp{formatIDR(startingPrice)}</p>
              )}
            </div>
          </div>
        </Link>

        {category.images[0] && (
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label={`Lihat gambar ${category.name} lebih besar`}
            className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-105"
          >
            <ZoomIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {zoomOpen && category.images[0] && (
        <ImageLightbox
          images={[category.images[0]]}
          index={0}
          alt={category.name}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </>
  );
}
