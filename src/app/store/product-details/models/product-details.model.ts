import { Product } from '../../../core/models/product.model';

export interface ProductDetailsState {
  readonly loading: boolean;
  readonly product: Product | null;
}
