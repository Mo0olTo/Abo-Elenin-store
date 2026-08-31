import { Product, productSalePrice } from '../../../core/models/product.model';

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}

export type CartAddResult = 'added' | 'increased' | 'out-of-stock';

export function cartSalePrice(product: Product): number {
  return productSalePrice(product);
}

export function cartItemImage(item: CartItem): string {
  return item.product.images[0] || item.product.imageUrl || '';
}
