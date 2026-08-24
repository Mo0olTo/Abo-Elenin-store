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
