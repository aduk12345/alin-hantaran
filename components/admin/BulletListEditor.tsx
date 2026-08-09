"use client";

import { TrashIcon } from "@/components/ui/icons";

export function BulletListEditor({
  items,
  onChange,
  placeholder = "Tulis poin...",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  function updateItem(i: number, value: string) {
    const next = [...items];
    next[i] = value;
    onChange(next);
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            title="Hapus poin"
            aria-label="Hapus poin"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink/60 hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-sm text-rose hover:underline"
      >
        + Tambah poin
      </button>
    </div>
  );
}
