"use client";

import { CategoryPriceOption } from "@/types/category";
import { formatIDR } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";

export function PriceTable({
  pricing,
  categoryId,
  categoryName,
  categoryImage,
}: {
  pricing: CategoryPriceOption[];
  categoryId: string;
  categoryName: string;
  categoryImage: string;
}) {
  const { isInCart, toggleItem } = useCart();

  return (
    <div className="flex flex-wrap gap-3">
      {pricing.map((option) => {
        const cartId = `category:${categoryId}:${option.id}`;
        const inCart = isInCart(cartId);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              toggleItem({
                id: cartId,
                kind: "category",
                name: `${categoryName} — ${option.label}`,
                price: option.price,
                image: categoryImage,
              })
            }
            className={`min-w-[9.5rem] flex-1 rounded-xl px-4 py-3 text-center ring-2 transition-colors sm:flex-none ${
              inCart ? "bg-rose/10 ring-rose" : "bg-blush/60 ring-transparent hover:bg-blush"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-rose">
              {option.label}
            </p>
            <p className="mt-1 font-serif-title text-xl text-ink sm:text-2xl">
              Rp{formatIDR(option.price)}
            </p>
            <p className="mt-1 text-[10px] font-medium text-ink/50">
              {inCart ? "✓ Di keranjang" : "+ Tambah ke keranjang"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
