export interface ContentBlock {
  id: string;
  title: string;
  points: string[];
  image?: string;
  order: number;
}

export type ContentBlockInput = Omit<ContentBlock, "id">;

export interface ContactContent {
  whatsapp: string;
  instagram: string;
  tiktok: string;
  address: string;
  mapsLabel: string;
  mapsUrl?: string;
  hours: string;
}

export interface HeroContent {
  tagline: string;
  title: string;
  subtitle: string;
  catalogButtonLabel: string;
  whatsappButtonLabel: string;
  whatsappMessage: string;
}
