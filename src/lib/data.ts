export interface ColorImages {
  color: string;       // hex code e.g. "#000000"
  images: string[];    // 1 to 5 image URLs for this color
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "men" | "women" | "oversized" | "graphic";
  colors: string[];
  colorImages: ColorImages[];  // per-color images
  sizes: string[];
  images: string[];            // fallback / first color images
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const products: Product[] = [];

export const reviews: { id: number; name: string; rating: number; comment: string; product: string; avatar: string }[] = [];
