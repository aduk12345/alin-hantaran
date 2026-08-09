"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Category } from "@/types/category";
import { getCategoryById } from "@/lib/firestore";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null | undefined>(undefined);

  useEffect(() => {
    getCategoryById(params.id).then(setCategory);
  }, [params.id]);

  if (category === undefined) return <p className="text-sm text-ink/60">Memuat...</p>;
  if (category === null) return <p className="text-sm text-ink/60">Seserahan tidak ditemukan.</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-serif-title text-2xl text-ink">Edit Seserahan</h1>
      <CategoryForm initial={category} />
    </div>
  );
}
