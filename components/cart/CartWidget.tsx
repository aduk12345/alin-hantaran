"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartContext";
import { CartIcon, CloseIcon, TrashIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink, cartOrderMessage } from "@/lib/wa";
import { formatPrice } from "@/lib/format";

export function CartWidget() {
  const { items, removeItem, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [orderDate, setOrderDate] = useState("");
  const pathname = usePathname();

  if (items.length === 0 || pathname?.startsWith("/admin")) return null;

  const waLink = buildWhatsAppLink(cartOrderMessage(items, orderDate || undefined));

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(38,32,25,0.3)] transition-transform hover:scale-105"
        >
          <span className="relative">
            <CartIcon className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-rose text-[10px] font-bold text-white">
              {items.length}
            </span>
          </span>
          Keranjang
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Tutup keranjang"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="font-serif-title text-lg text-ink">
                Keranjang <span className="font-sans text-sm text-ink/50">({items.length})</span>
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clear}
                  className="px-2 text-xs font-medium text-ink/50 hover:text-rose"
                >
                  Kosongkan
                </button>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-ink/60 hover:bg-blush"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto px-5 py-3">
              <ul className="divide-y divide-ink/10">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-blush">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-ink/60">{formatPrice(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Hapus ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 rounded-full p-2 text-ink/40 hover:bg-blush hover:text-rose"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 px-5 py-4">
              <label className="mb-3 block text-sm text-ink/70">
                Tanggal pesanan <span className="text-ink/40">(opsional)</span>
                <div className="mt-1 flex w-full min-w-0 items-center overflow-hidden rounded-lg border border-ink/15 focus-within:border-ink/40">
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full min-w-0 border-0 bg-transparent py-2 pl-3 pr-2 text-sm text-ink focus:outline-none"
                  />
                  {orderDate && (
                    <button
                      type="button"
                      aria-label="Hapus tanggal pesanan"
                      onClick={() => setOrderDate("")}
                      className="grid h-8 w-8 shrink-0 place-items-center text-ink/40 hover:text-rose"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </label>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Kirim {items.length} Item via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
