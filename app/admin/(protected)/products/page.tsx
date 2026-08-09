"use client";

import Image from "next/image";
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
import { StandaloneProduct } from "@/types/product";
import { deleteStandaloneProduct, getStandaloneProducts, reorderStandaloneProducts } from "@/lib/firestore";
import { formatPrice } from "@/lib/format";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import { ActiveBadge } from "@/components/admin/ActiveBadge";
import { EditIconButton, DeleteIconButton } from "@/components/admin/IconButtons";

function SortableProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: StandaloneProduct;
  onEdit: (p: StandaloneProduct) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

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
        {product.image && (
          <Image src={product.image} alt={product.name} fill sizes="200px" className="object-cover" />
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{product.name}</p>
      <p className="text-xs text-rose">{formatPrice(product.price)}</p>
      <div className="mt-2 flex items-center gap-1">
        <ActiveBadge active={product.isActive} />
        <div className="ml-auto flex gap-1">
          <EditIconButton onClick={() => onEdit(product)} />
          <DeleteIconButton onClick={() => onDelete(product.id, product.name)} />
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<StandaloneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StandaloneProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function refresh() {
    setLoading(true);
    setProducts(await getStandaloneProducts());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    await deleteStandaloneProduct(id);
    refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(products, oldIndex, newIndex);
    setProducts(reordered);
    await reorderStandaloneProducts(reordered.map((p) => p.id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif-title text-2xl text-ink">Produk Lain</h1>
        {!creating && !editing && (
          <Button onClick={() => setCreating(true)}>+ Tambah Produk</Button>
        )}
      </div>

      {creating && (
        <ProductForm
          onSaved={() => {
            setCreating(false);
            refresh();
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {editing && (
        <ProductForm
          initial={editing}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading && <p className="text-sm text-ink/60">Memuat...</p>}

      {!creating && !editing && products.length > 0 && (
        <>
          <p className="text-xs text-ink/50">Geser ikon ⠿ untuk mengatur urutan tampil.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={products.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products.map((p) => (
                  <SortableProductCard
                    key={p.id}
                    product={p}
                    onEdit={setEditing}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
      {!loading && !creating && !editing && products.length === 0 && (
        <p className="text-sm text-ink/60">Belum ada produk.</p>
      )}
    </div>
  );
}
