export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface MediaImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: any | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  src: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ReturnsAndWarranty {
  id: number;
  documentId: string;
  label: string;
  images: MediaImage[];
}
export interface Benefits {
  id: number;
}

export interface Variant {
  id: number;
  documentId: string;
  ReturnsAndWarranty: ReturnsAndWarranty[];
  colorHex: string;
  colorName: string;
  images: MediaImage[];
  isDefault: boolean;
  discountPercent: number;
  sellingPrice: number;
  mrp: number;
  stock: number;
  sku: string;
  key: string;
  benefits:Benefits[];
}

export interface Product {
  id: number;
  documentId: string;
  title: string;
  subTitle: string;
  description: string;
  slug: string;

  rating: number;
  ratingCount: number;

  isReturnable: boolean;
  returnDays: number;

  warrantyText: string | null;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  brand: Brand;
  category: Category;
  variant: Variant[];
  variants: Variant[];
}
