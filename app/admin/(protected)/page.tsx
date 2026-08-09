import Link from "next/link";
import { ReactNode } from "react";
import { getCategories, getStandaloneProducts } from "@/lib/firestore";

export const dynamic = "force-dynamic";

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8h18v4H3V8Zm1 4h16v9H4v-9Zm8-4V6a2.5 2.5 0 1 0-2.5 2.5m2.5-2.5A2.5 2.5 0 1 1 14.5 8.5M12 8v13"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.5 7.5 8.5-4 8.5 4-8.5 4-8.5-4Zm0 0v9l8.5 4m-8.5-13 8.5 4m0 9 8.5-4v-9m-8.5 13v-9"
      />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Zm7 0v4h4M9 12h6m-6 4h6m-6-8h2"
      />
    </svg>
  );
}

function StatCard({
  href,
  icon,
  value,
  label,
  detail,
}: {
  href: string;
  icon: ReactNode;
  value: number;
  label: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-gold-light bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-rose">
          {icon}
        </div>
        <span className="text-3xl font-semibold text-rose">{value}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-ink">{label}</p>
      <p className="mt-0.5 text-xs text-ink/50">{detail}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [categories, products] = await Promise.all([getCategories(), getStandaloneProducts()]);

  const activeCategories = categories.filter((c) => c.isActive).length;
  const activeProducts = products.filter((p) => p.isActive).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif-title text-2xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">Ringkasan katalog dan konten toko Anda.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          href="/admin/categories"
          icon={<GiftIcon />}
          value={categories.length}
          label="Seserahan"
          detail={`${activeCategories} aktif · ${categories.length - activeCategories} nonaktif`}
        />
        <StatCard
          href="/admin/products"
          icon={<BoxIcon />}
          value={products.length}
          label="Produk Lain"
          detail={`${activeProducts} aktif · ${products.length - activeProducts} nonaktif`}
        />
        <Link
          href="/admin/content"
          className="group relative overflow-hidden rounded-2xl border border-gold-light bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-rose">
            <DocIcon />
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Konten</p>
          <p className="mt-0.5 text-xs text-ink/50">Syarat & Ketentuan, Panduan, Kontak</p>
        </Link>
      </div>

      <div className="rounded-2xl border border-gold-light bg-white p-5">
        <h2 className="text-sm font-medium text-ink">Aksi cepat</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/categories/new"
            className="rounded-full bg-rose px-4 py-2 text-sm font-medium text-white hover:bg-rose/90"
          >
            + Tambah Seserahan
          </Link>
          <Link
            href="/admin/products"
            className="rounded-full border border-gold-light px-4 py-2 text-sm font-medium text-ink hover:bg-blush/40"
          >
            Kelola Produk Lain
          </Link>
          <Link
            href="/admin/content"
            className="rounded-full border border-gold-light px-4 py-2 text-sm font-medium text-ink hover:bg-blush/40"
          >
            Edit Konten
          </Link>
        </div>
      </div>
    </div>
  );
}
