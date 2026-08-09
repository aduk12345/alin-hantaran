import Link from "next/link";
import { getCategories, getStandaloneProducts } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categories, products] = await Promise.all([getCategories(), getStandaloneProducts()]);

  return (
    <div className="space-y-6">
      <h1 className="font-serif-title text-2xl text-ink">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/categories"
          className="rounded-2xl border border-gold-light bg-white p-5 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-semibold text-rose">{categories.length}</p>
          <p className="mt-1 text-sm text-ink/70">Seserahan</p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-2xl border border-gold-light bg-white p-5 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-semibold text-rose">{products.length}</p>
          <p className="mt-1 text-sm text-ink/70">Produk Lain</p>
        </Link>
        <Link
          href="/admin/content"
          className="rounded-2xl border border-gold-light bg-white p-5 shadow-sm hover:shadow-md"
        >
          <p className="text-sm text-ink/70">Kelola Syarat & Ketentuan, Panduan, Kontak</p>
        </Link>
      </div>
    </div>
  );
}
