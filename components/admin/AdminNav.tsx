"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Seserahan" },
  { href: "/admin/products", label: "Produk Lain" },
  { href: "/admin/content", label: "Konten" },
];

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/admin" ? pathname === href : pathname?.startsWith(href);
  }

  async function handleLogout() {
    await signOut(getFirebaseAuth());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-gold-light/50 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/admin" className="font-serif-title text-lg text-ink">
          Hantaran
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "text-rose"
                  : "text-ink/70 transition hover:text-rose"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Buka menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-light/70 sm:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="hidden text-sm text-rose hover:underline sm:block"
        >
          Keluar
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-gold-light/50 px-5 py-3 text-sm font-medium text-ink sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                isActive(link.href)
                  ? "rounded-lg bg-blush/50 px-2 py-2 text-rose"
                  : "rounded-lg px-2 py-2 hover:bg-blush/40 hover:text-rose"
              }
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="rounded-lg px-2 py-2 text-left text-rose hover:bg-blush/40"
          >
            Keluar
          </button>
        </nav>
      )}
    </header>
  );
}
