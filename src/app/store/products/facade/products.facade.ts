import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';
import { ProductGender } from '../../../core/models/product.model';
import { ProductSort } from '../../../core/models/product-sort.model';
import { ProductService } from '../../../core/services/product.service';
import { PriceRange, ProductsStore } from '../store/products.store';

@Injectable()
export class ProductsFacade {
  private readonly store = inject(ProductsStore);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  readonly products = this.store.visibleProducts;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly heading = this.store.heading;
  readonly filtersOpen = this.store.filtersOpen;
  readonly selectedGenders = this.store.selectedGenders;
  readonly selectedBrands = this.store.selectedBrands;
  readonly selectedColors = this.store.selectedColors;
  readonly priceRange = this.store.priceRange;
  readonly sort = this.store.sort;
  readonly brandOptions = this.store.brandOptions;
  readonly colorOptions = this.store.colorOptions;
  readonly priceBounds = this.store.priceBounds;
  readonly isEmpty = this.store.isEmpty;
  readonly hasError = this.store.hasError;
  readonly activeFilterCount = this.store.activeFilterCount;
  readonly hasActiveFilters = this.store.hasActiveFilters;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.store.setCategorySlug(params.get('category'));
    });

    this.load();
  }

  load(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.productService
      .getActiveProducts()
      .pipe(
        take(1),
        tap((products) => this.store.setProducts(products)),
        catchError((error: unknown) => {
          this.store.setError(
            this.productService.toUserMessage(error, 'Products could not be loaded.'),
          );
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  openFilters(): void {
    this.store.setFiltersOpen(true);
  }

  closeFilters(): void {
    this.store.setFiltersOpen(false);
  }

  setSelectedGenders(genders: ProductGender[]): void {
    this.store.setSelectedGenders(genders);
  }

  setSelectedBrands(brands: string[]): void {
    this.store.setSelectedBrands(brands);
  }

  setSelectedColors(colors: string[]): void {
    this.store.setSelectedColors(colors);
  }

  setPriceRange(range: PriceRange): void {
    this.store.setPriceRange(range);
  }

  setSort(sort: ProductSort): void {
    this.store.setSort(sort);
  }

  clearFilters(): void {
    this.store.clearFilters();
  }
}
