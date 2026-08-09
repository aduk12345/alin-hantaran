import { getStandaloneProducts, getContact } from "@/lib/firestore";
import { Container } from "@/components/ui/Container";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import { StandaloneProduct } from "@/types/product";

export const dynamic = "force-dynamic";

const SECTION_DEFS: { key: StandaloneProduct["category"]; title: string }[] = [
  { key: "ring-jewelry", title: "Ring Box & Jewelry" },
  { key: "money-box", title: "Money Box" },
  { key: "other", title: "Lainnya" },
];

export default async function ProdukLainPage() {
  const [products, contact] = await Promise.all([getStandaloneProducts(), getContact()]);
  const active = products.filter((p) => p.isActive);

  const sections = SECTION_DEFS.map((def) => ({
    ...def,
    items: active.filter((p) => p.category === def.key),
  })).filter((s) => s.items.length > 0);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-10">
          <h1 className="font-serif-title text-2xl text-ink sm:text-3xl">Produk Lain</h1>
          <p className="mt-1 text-sm text-ink/70">
            Ring box, jewelry set, money box, dan produk lainnya.
          </p>
          <p className="mt-6 text-sm text-ink/60">
            Klik produk untuk menambah ke keranjang, lalu kirim daftarnya sekaligus via WhatsApp
            lewat tombol keranjang.
          </p>

          <div className="mt-6 space-y-12 pb-8">
            {sections.map((section) => (
              <div key={section.key}>
                <h2 className="font-serif-title text-xl text-ink">{section.title}</h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
                  {section.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-center text-sm text-ink/60">Belum ada produk yang ditambahkan.</p>
            )}
          </div>
        </Container>
      </main>
      <SiteFooter contact={contact} />
    </>
  );
}
