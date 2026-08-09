import Link from "next/link";
import { Logo } from "./Logo";
import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 min-w-0 bg-cream/85 shadow-[0_1px_0_rgba(38,32,25,0.06)] backdrop-blur">
      <Container className="flex min-w-0 items-center justify-between gap-2 py-3">
        <Logo size={44} />
        <nav className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-ink/70 sm:gap-x-8 sm:text-xs sm:tracking-wider">
          <Link href="/katalog" className="shrink-0 transition-colors hover:text-ink">
            Seserahan
          </Link>
          <Link href="/produk-lainnya" className="shrink-0 transition-colors hover:text-ink">
            Produk Lain
          </Link>
          <Link
            href="/#syarat-ketentuan"
            className="hidden shrink-0 transition-colors hover:text-ink sm:inline"
          >
            Syarat &amp; Ketentuan
          </Link>
        </nav>
      </Container>
    </header>
  );
}
