export type ProductSort = 'newest' | 'lowest-price' | 'highest-price';

export interface ProductSortOption {
  readonly value: ProductSort;
  readonly label: string;
}

export const productSortOptions: readonly ProductSortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'lowest-price', label: 'Lowest price' },
  { value: 'highest-price', label: 'Highest price' },
];
