"use client";

import Image from "next/image";
import { useState } from "react";
import { StandaloneProduct } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";
import { ZoomIcon } from "./icons";
import { ImageLightbox } from "./ImageLightbox";

export function ProductCard({ product }: { product: StandaloneProduct }) {
  const { isInCart, toggleItem } = useCart();
  const [zoomOpen, setZoomOpen] = useState(false);
  const cartId = `product:${product.id}`;
  const inCart = isInCart(cartId);

  function handleToggle() {
    toggleItem({
      id: cartId,
      kind: "product",
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-pressed={inCart}
        aria-label={
          inCart ? `Hapus ${product.name} dari keranjang` : `Tambah ${product.name} ke keranjang`
        }
        className={`group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-xl bg-blush ring-2 transition-shadow ${
          inCart ? "ring-rose" : "ring-transparent"
        }`}
      >
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

        {product.image && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomOpen(true);
            }}
            aria-label={`Lihat gambar ${product.name} lebih besar`}
            className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-105"
          >
            <ZoomIcon className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
          <p className="text-sm font-semibold leading-tight">{product.name}</p>
          <p className="mt-0.5 text-xs text-white/80">{formatPrice(product.price)}</p>
        </div>
      </div>

      {zoomOpen && product.image && (
        <ImageLightbox
          images={[product.image]}
          index={0}
          alt={product.name}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </>
  );
}
