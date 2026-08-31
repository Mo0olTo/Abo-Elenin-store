export type ProductGender = 'men' | 'women' | 'kids' | 'unisex';

export interface ProductColor {
  readonly name: string;
  readonly hex: string;
}

export interface ProductWriteData {
  readonly name: string;
  readonly brand: string;
  readonly categoryId: string;
  readonly gender: ProductGender;
  readonly price: number;
  /** Discount as a percentage of price, from 0 to 100. */
  readonly discount: number;
  readonly description: string;
  readonly imageUrl: string;
  readonly images: string[];
  readonly colors: ProductColor[];
  readonly stock: number;
  readonly frameColor: string;
  readonly frameMaterial: string;
  readonly isActive: boolean;
}

export interface Product extends ProductWriteData {
  readonly id: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export function productSalePrice(product: Pick<ProductWriteData, 'price' | 'discount'>): number {
  const percent = Math.min(100, Math.max(0, product.discount || 0));
  return Math.max(0, Math.round(product.price * (1 - percent / 100) * 100) / 100);
}
