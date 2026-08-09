export interface CategoryPriceOption {
  id: string;
  label: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  featureBullets: string[];
  pricing: CategoryPriceOption[];
  coverNote?: string;
  images: string[];
  isActive: boolean;
}

export type CategoryInput = Omit<Category, "id">;
