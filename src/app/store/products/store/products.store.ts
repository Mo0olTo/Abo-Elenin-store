import { computed, Injectable, signal } from '@angular/core';
import { Product, ProductColor, ProductGender, productSalePrice } from '../../../core/models/product.model';
import { ProductSort } from '../../../core/models/product-sort.model';
import { collections } from '../../categories/models/collection.model';

export interface PriceRange {
  readonly min: number;
  readonly max: number;
}

@Injectable()
export class ProductsStore {
  private readonly productsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal(true);
  private readonly errorSignal = signal<string | null>(null);
  private readonly categorySlugSignal = signal<string | null>(null);
  private readonly filtersOpenSignal = signal(false);
  private readonly selectedGendersSignal = signal<ProductGender[]>([]);
  private readonly selectedBrandsSignal = signal<string[]>([]);
  private readonly selectedColorsSignal = signal<string[]>([]);
  private readonly priceRangeSignal = signal<PriceRange>({ min: 0, max: 0 });
  private readonly sortSignal = signal<ProductSort>('newest');

  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly categorySlug = this.categorySlugSignal.asReadonly();
  readonly filtersOpen = this.filtersOpenSignal.asReadonly();
  readonly selectedGenders = this.selectedGendersSignal.asReadonly();
  readonly selectedBrands = this.selectedBrandsSignal.asReadonly();
  readonly selectedColors = this.selectedColorsSignal.asReadonly();
  readonly priceRange = this.priceRangeSignal.asReadonly();
  readonly sort = this.sortSignal.asReadonly();

  readonly heading = computed(() => {
    const slug = this.categorySlug();
    if (!slug) {
      return 'Products';
    }

    return collections.find((collection) => collection.slug === slug)?.title ?? 'Products';
  });

  readonly brandOptions = computed(() =>
    [...new Set(this.products().map((product) => product.brand).filter(Boolean))].sort(),
  );

  readonly colorOptions = computed(() => {
    const byHex = new Map<string, ProductColor>();
    for (const product of this.products()) {
      for (const color of product.colors ?? []) {
        byHex.set(color.hex, color);
      }
    }
    return [...byHex.values()];
  });

  readonly priceBounds = computed(() => {
    const prices = this.products().map((product) => this.salePrice(product));
    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }
    return { min: Math.min(...prices), max: Math.max(...prices) };
  });

  readonly visibleProducts = computed(() => {
    const slug = this.categorySlug();
    const genders = this.selectedGenders();
    const brands = this.selectedBrands();
    const colors = this.selectedColors();
    const range = this.priceRange();
    const sort = this.sort();

    const filtered = this.products().filter((product) => {
      if (slug && !this.matchesCollection(product, slug)) {
        return false;
      }
      if (genders.length > 0 && !genders.includes(product.gender)) {
        return false;
      }
      if (brands.length > 0 && !brands.includes(product.brand)) {
        return false;
      }
      if (colors.length > 0 && !(product.colors ?? []).some((color) => colors.includes(color.hex))) {
        return false;
      }

      const salePrice = this.salePrice(product);
      if (salePrice < range.min || salePrice > range.max) {
        return false;
      }

      return true;
    });

    return filtered.slice().sort((left, right) => {
      if (sort === 'lowest-price') {
        return this.salePrice(left) - this.salePrice(right);
      }

      if (sort === 'highest-price') {
        return this.salePrice(right) - this.salePrice(left);
      }

      return right.createdAt - left.createdAt;
    });
  });

  readonly isEmpty = computed(() => this.products().length === 0);
  readonly hasError = computed(() => this.error() !== null);

  readonly activeFilterCount = computed(() => {
    const range = this.priceRange();
    const bounds = this.priceBounds();
    let count = 0;

    if (this.selectedGenders().length > 0) {
      count += 1;
    }
    if (this.selectedBrands().length > 0) {
      count += 1;
    }
    if (this.selectedColors().length > 0) {
      count += 1;
    }
    if (range.min !== bounds.min || range.max !== bounds.max) {
      count += 1;
    }

    return count;
  });

  readonly hasActiveFilters = computed(() => this.activeFilterCount() > 0);

  setProducts(products: Product[]): void {
    this.productsSignal.set(products);
    this.priceRangeSignal.set(this.priceBounds());
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(message: string | null): void {
    this.errorSignal.set(message);
  }

  setCategorySlug(slug: string | null): void {
    this.categorySlugSignal.set(slug);
  }

  setFiltersOpen(open: boolean): void {
    this.filtersOpenSignal.set(open);
  }

  setSelectedGenders(genders: ProductGender[]): void {
    this.selectedGendersSignal.set(genders);
  }

  setSelectedBrands(brands: string[]): void {
    this.selectedBrandsSignal.set(brands);
  }

  setSelectedColors(colors: string[]): void {
    this.selectedColorsSignal.set(colors);
  }

  setPriceRange(range: PriceRange): void {
    this.priceRangeSignal.set(range);
  }

  setSort(sort: ProductSort): void {
    this.sortSignal.set(sort);
  }

  clearFilters(): void {
    this.selectedGendersSignal.set([]);
    this.selectedBrandsSignal.set([]);
    this.selectedColorsSignal.set([]);
    this.priceRangeSignal.set(this.priceBounds());
  }

  private matchesCollection(product: Product, slug: string): boolean {
    const gender = product.gender;
    const category = product.categoryId.trim().toLowerCase();

    if (slug === 'kids') {
      return gender === 'kids' || category === 'kids';
    }

    if (slug === 'women' || slug === 'men') {
      return gender === slug || gender === 'unisex' || category === slug || category === 'unisex';
    }

    return gender === slug || category === slug;
  }

  private salePrice(product: Product): number {
    return productSalePrice(product);
  }
}
