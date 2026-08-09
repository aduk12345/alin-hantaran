import { ContactContent } from "@/types/content";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { WhatsAppIcon, InstagramIcon, TikTokIcon, MapPinIcon, ClockIcon } from "./icons";
import { buildWhatsAppLink } from "@/lib/wa";
import { buildGoogleMapsLink, buildInstagramLink, buildTikTokLink } from "@/lib/social";

export function SiteFooter({
  contact,
  noTopMargin = false,
}: {
  contact: ContactContent | null;
  noTopMargin?: boolean;
}) {
  if (!contact) return null;

  return (
    <footer className={`${noTopMargin ? "" : "mt-16"} bg-blush/60 py-12`}>
      <Container className="flex flex-col items-center gap-3 text-center text-sm text-ink/80">
        <Logo size={70} />
        <p className="flex items-center gap-1.5">
          <ClockIcon className="h-4 w-4 text-gold" />
          {contact.hours}
        </p>
        <a
          href={buildWhatsAppLink("Halo, saya mau tanya-tanya", contact.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-rose hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {contact.whatsapp}
        </a>
        <p className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildInstagramLink(contact.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline"
          >
            <InstagramIcon className="h-4 w-4 text-gold" />
            {contact.instagram}
          </a>
          <a
            href={buildTikTokLink(contact.tiktok)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline"
          >
            <TikTokIcon className="h-4 w-4 text-gold" />
            {contact.tiktok}
          </a>
        </p>
        <a
          href={contact.mapsUrl || buildGoogleMapsLink(`${contact.mapsLabel} ${contact.address}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start justify-center gap-1.5 hover:underline"
        >
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span>
            {contact.mapsLabel}
            <br />
            {contact.address}
          </span>
        </a>
      </Container>
    </footer>
  );
}
