"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category } from "@/types/category";
import { deleteCategory, getCategories, reorderCategories } from "@/lib/firestore";
import { formatIDR } from "@/lib/format";
import { ActiveBadge } from "@/components/admin/ActiveBadge";
import { EditIconButton, DeleteIconButton } from "@/components/admin/IconButtons";

function SortableCategoryCard({
  category,
  onDelete,
}: {
  category: Category;
  onDelete: (id: string, name: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  const startingPrice = category.pricing.length
    ? Math.min(...category.pricing.map((p) => p.price))
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-2xl border border-gold-light bg-white p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Geser untuk atur urutan"
        className="absolute left-2 top-2 z-10 flex h-7 w-7 touch-none cursor-grab items-center justify-center rounded-lg bg-white/90 text-ink/50 shadow hover:bg-blush/60 active:cursor-grabbing"
      >
        ⠿
      </button>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-blush">
        {category.images[0] && (
          <Image
            src={category.images[0]}
            alt={category.name}
            fill
            sizes="200px"
            className="object-cover"
          />
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{category.name}</p>
      <p className="text-xs text-rose">
        {startingPrice != null ? `mulai Rp${formatIDR(startingPrice)}` : "Belum ada harga"}
      </p>
      <div className="mt-2 flex items-center gap-1">
        <ActiveBadge active={category.isActive} />
        <div className="ml-auto flex gap-1">
          <EditIconButton href={`/admin/categories/${category.id}`} />
          <DeleteIconButton onClick={() => onDelete(category.id, category.name)} />
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function refresh() {
    setLoading(true);
    setCategories(await getCategories());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    await deleteCategory(id);
    refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);
    await reorderCategories(reordered.map((c) => c.id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif-title text-2xl text-ink">Seserahan</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose/90"
        >
          + Tambah Seserahan
        </Link>
      </div>

      {loading && <p className="text-sm text-ink/60">Memuat...</p>}

      {!loading && categories.length === 0 && (
        <p className="rounded-2xl border border-gold-light bg-white p-6 text-center text-sm text-ink/60">
          Belum ada kategori.
        </p>
      )}

      {!loading && categories.length > 0 && (
        <>
          <p className="text-xs text-ink/50">Geser ikon ⠿ untuk mengatur urutan tampil di katalog.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {categories.map((c) => (
                  <SortableCategoryCard key={c.id} category={c} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
