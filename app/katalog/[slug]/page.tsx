import { notFound } from "next/navigation";
import { getCategoryBySlug, getContact } from "@/lib/firestore";
import { Container } from "@/components/ui/Container";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { PhotoGrid } from "@/components/ui/PhotoGrid";
import { PriceTable } from "@/components/ui/PriceTable";

export const dynamic = "force-dynamic";

export default async function KategoriDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, contact] = await Promise.all([getCategoryBySlug(slug), getContact()]);

  if (!category || !category.isActive) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-10">
          <h1 className="font-serif-title text-2xl text-ink sm:text-3xl">{category.name}</h1>
          {category.coverNote && (
            <p className="mt-1 text-sm text-ink/60">{category.coverNote}</p>
          )}

          <p className="mt-4 text-sm text-ink/60">
            Pilih paket untuk menambah ke keranjang, lalu kirim sekaligus via WhatsApp lewat
            tombol keranjang.
          </p>

          <div className="mt-4">
            <PriceTable
              pricing={category.pricing}
              categoryId={category.id}
              categoryName={category.name}
              categoryImage={category.images[0] ?? ""}
            />
          </div>

          <div className="mt-8">
            <PhotoGrid images={category.images} alt={category.name} />
          </div>

          {category.featureBullets.length > 0 && (
            <ul className="mt-8 space-y-2 text-sm text-ink/80">
              {category.featureBullets.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold">•</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </main>
      <SiteFooter contact={contact} />
    </>
  );
}
