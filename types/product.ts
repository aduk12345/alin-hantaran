export type StandaloneProductCategory = "ring-jewelry" | "money-box" | "other";

export interface StandaloneProduct {
  id: string;
  name: string;
  price: number | null;
  image: string;
  category: StandaloneProductCategory;
  order: number;
  isActive: boolean;
}

export type StandaloneProductInput = Omit<StandaloneProduct, "id">;
