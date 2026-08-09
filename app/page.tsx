import Image from "next/image";
import { getContact, getContentBlocks, getHero } from "@/lib/firestore";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Accordion } from "@/components/ui/Accordion";
import { LinkButton } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { WhatsAppIcon } from "@/components/ui/icons";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { buildWhatsAppLink } from "@/lib/wa";

export const dynamic = "force-dynamic";

const DEFAULT_HERO = {
  tagline: "Catalog & Pricelist",
  title: "Hantaran",
  subtitle: "Sewa box seserahan pernikahan.",
  catalogButtonLabel: "Lihat Katalog",
  whatsappButtonLabel: "Hubungi Kami",
  whatsappMessage: "Halo, saya mau tanya-tanya soal Hantaran",
};

export default async function HomePage() {
  const [contact, contentBlocks, heroData] = await Promise.all([
    getContact(),
    getContentBlocks(),
    getHero(),
  ]);
  const hero = heroData ?? DEFAULT_HERO;

  return (
    <main className="flex-1">
      <section className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-ink via-[#332619] to-ink sm:min-h-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(164,127,62,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(232,226,214,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

        <Container className="relative z-10 flex min-h-[46vh] flex-col items-center justify-center gap-5 py-16 text-center sm:min-h-[58vh] sm:gap-7 sm:py-24">
          <Logo size={64} />
          <OrnamentDivider />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose">
              {hero.tagline}
            </p>
            <h1 className="mt-3 font-serif-title text-4xl leading-[1.05] text-cream sm:text-5xl md:text-6xl">
              {hero.title}
            </h1>
          </div>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-cream/70">
            {hero.subtitle}
          </p>
          <OrnamentDivider />
          <div className="mt-1 flex flex-col gap-2.5 sm:mt-2 sm:flex-row sm:gap-3">
            <LinkButton href="/katalog" className="bg-gold text-cream hover:bg-gold/90">
              {hero.catalogButtonLabel}
            </LinkButton>
            {contact && (
              <a
                href={buildWhatsAppLink(hero.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold-light/40 px-6 py-3 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-white/5"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {hero.whatsappButtonLabel}
              </a>
            )}
          </div>
        </Container>

        {contentBlocks.length > 0 && (
          <Container id="syarat-ketentuan" className="relative z-10 scroll-mt-20 pb-14 sm:pb-20">
            <div className="space-y-3">
              {contentBlocks.map((block) => (
                <Accordion key={block.id} title={block.title} highlight>
                  {block.image && (
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <Image
                        src={block.image}
                        alt={block.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <ol className="list-decimal space-y-3 pl-4">
                    {block.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ol>
                </Accordion>
              ))}
            </div>
          </Container>
        )}
      </section>

      <SiteFooter contact={contact} noTopMargin />
    </main>
  );
}
