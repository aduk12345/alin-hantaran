import { getCategories, getContact } from "@/lib/firestore";
import { Container } from "@/components/ui/Container";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { CategoryCard } from "@/components/ui/CategoryCard";

export const dynamic = "force-dynamic";

export default async function KatalogPage() {
  const [categories, contact] = await Promise.all([getCategories(), getContact()]);
  const active = categories.filter((c) => c.isActive);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-10">
          <h1 className="font-serif-title text-2xl text-ink sm:text-3xl">Seserahan</h1>
          <p className="mt-1 text-sm text-ink/70">
            Semua harga sudah termasuk jasa hias, sewa box, bunga, dan aksesoris.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-5">
            {active.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          {active.length === 0 && (
            <p className="mt-10 text-center text-sm text-ink/60">
              Belum ada kategori yang ditambahkan.
            </p>
          )}
        </Container>
      </main>
      <SiteFooter contact={contact} />
    </>
  );
}
