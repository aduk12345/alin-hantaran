"use client";

import { FormEvent, useState } from "react";
import {
  StandaloneProduct,
  StandaloneProductCategory,
  StandaloneProductInput,
} from "@/types/product";
import {
  createStandaloneProduct,
  getStandaloneProducts,
  updateStandaloneProduct,
} from "@/lib/firestore";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/Button";

export function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: StandaloneProduct;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState<string>(initial?.price?.toString() ?? "");
  const [category, setCategory] = useState<StandaloneProductCategory>(
    initial?.category ?? "ring-jewelry"
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [images, setImages] = useState<string[]>(initial?.image ? [initial.image] : []);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const order = initial ? initial.order : (await getStandaloneProducts()).length;
    const input: StandaloneProductInput = {
      name,
      price: price === "" ? null : Number(price),
      category,
      order,
      isActive,
      image: images[0] ?? "",
    };
    try {
      if (initial) {
        await updateStandaloneProduct(initial.id, input);
      } else {
        await createStandaloneProduct(input);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gold-light bg-white p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-ink/70">Nama Produk</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Harga (kosongkan jika belum ada)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as StandaloneProductCategory)}
            className="mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
          >
            <option value="ring-jewelry">Ring Box & Jewelry</option>
            <option value="money-box">Money Box</option>
            <option value="other">Produk Lainnya</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Foto</p>
        <ImageUploader images={images} onChange={setImages} pathPrefix="products" multiple={false} />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Tampilkan di halaman publik
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
