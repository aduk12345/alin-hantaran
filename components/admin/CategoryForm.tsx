"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Category, CategoryInput, CategoryPriceOption } from "@/types/category";
import { createCategory, getCategories, updateCategory } from "@/lib/firestore";
import { slugify } from "@/lib/slug";
import { ImageUploader } from "./ImageUploader";
import { BulletListEditor } from "./BulletListEditor";
import { Button } from "@/components/ui/Button";

type PriceRow = { id: string; label: string; price: string };

function toPriceRows(pricing: CategoryPriceOption[]): PriceRow[] {
  return pricing.map((p) => ({ id: p.id, label: p.label, price: String(p.price) }));
}

export function CategoryForm({ initial }: { initial?: Category }) {
  const router = useRouter();
  const nextRowId = useRef(0);

  function newRowId() {
    nextRowId.current += 1;
    return `row-${nextRowId.current}`;
  }

  const [name, setName] = useState(initial?.name ?? "");
  const [coverNote, setCoverNote] = useState(initial?.coverNote ?? "");
  const [featureBullets, setFeatureBullets] = useState<string[]>(initial?.featureBullets ?? []);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [priceRows, setPriceRows] = useState<PriceRow[]>(() =>
    initial?.pricing?.length
      ? toPriceRows(initial.pricing)
      : [
          { id: newRowId(), label: "", price: "" },
          { id: newRowId(), label: "", price: "" },
        ]
  );
  const [saving, setSaving] = useState(false);

  function updatePriceRow(id: string, field: "label" | "price", value: string) {
    setPriceRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addPriceRow() {
    setPriceRows((prev) => [...prev, { id: newRowId(), label: "", price: "" }]);
  }

  function removePriceRow(id: string) {
    setPriceRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const pricing: CategoryPriceOption[] = priceRows
      .filter((r) => r.label.trim() !== "" && r.price !== "")
      .map((r) => ({ id: r.id, label: r.label.trim(), price: Number(r.price) }));
    const order = initial ? initial.order : (await getCategories()).length;
    const input: CategoryInput = {
      name,
      slug: initial?.slug || slugify(name),
      order,
      coverNote,
      featureBullets: featureBullets.filter((b) => b.trim() !== ""),
      images,
      isActive,
      pricing,
    };
    try {
      if (initial) {
        await updateCategory(initial.id, input);
      } else {
        await createCategory(input);
      }
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="text-sm text-ink/70">Nama Kategori</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
        />
      </div>

      <div>
        <label className="text-sm text-ink/70">Catatan Cover (opsional, mis. &quot;tutup akrilik lengkung&quot;)</label>
        <input
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Harga</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {priceRows.map((row) => (
            <div key={row.id} className="relative rounded-lg border border-gold-light/50 p-2.5">
              <button
                type="button"
                onClick={() => removePriceRow(row.id)}
                aria-label="Hapus harga"
                className="absolute right-2 top-2 text-xs text-ink/40 hover:text-red-600"
              >
                ×
              </button>
              <label className="text-xs text-ink/60">Label</label>
              <input
                value={row.label}
                onChange={(e) => updatePriceRow(row.id, "label", e.target.value)}
                placeholder="Contoh: Sewa 5 Box"
                className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
              />
              <label className="mt-2 block text-xs text-ink/60">Harga</label>
              <input
                type="number"
                value={row.price}
                onChange={(e) => updatePriceRow(row.id, "price", e.target.value)}
                placeholder="Contoh: 335000"
                className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPriceRow}
          className="mt-3 rounded-lg border border-dashed border-gold-light px-4 py-2 text-sm text-ink/70 hover:bg-blush/40"
        >
          + Tambah Harga
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Fitur / Bullet Points</p>
        <BulletListEditor items={featureBullets} onChange={setFeatureBullets} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Foto Produk</p>
        <ImageUploader images={images} onChange={setImages} pathPrefix="categories" />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Tampilkan di katalog publik
      </label>

      <Button type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
