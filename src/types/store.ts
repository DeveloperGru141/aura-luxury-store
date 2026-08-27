export type ProductCategory = 'all' | 'bags' | 'apparel' | 'shoes' | 'watches' | 'jewelry';

export type ProductBadge = 'NEW' | 'LIMITED' | 'BESTSELLER' | 'SALE' | 'EXCLUSIVE' | 'TRENDING';


export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  primaryImage: string;
  secondaryImage: string;
  badge?: ProductBadge;
  badgeColor?: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  materials: string[];
  inStock: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  specs: { label: string; value: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface LookbookHotspot {
  id: string;
  productId: string;
  xPercent: number; // coordinate % on image
  yPercent: number; // coordinate % on image
  title: string;
  category: string;
  price: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  productName: string;
  productImage: string;
  date: string;
  verified: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
}
