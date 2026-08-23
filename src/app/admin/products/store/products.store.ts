import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Injectable()
export class ProductsStore {
  private readonly productsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly savingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly searchSignal = signal('');
  private readonly formOpenSignal = signal(false);
  private readonly editingProductSignal = signal<Product | null>(null);
  private readonly pendingDeleteSignal = signal<Product | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly search = this.searchSignal.asReadonly();
  readonly formOpen = this.formOpenSignal.asReadonly();
  readonly editingProduct = this.editingProductSignal.asReadonly();
  readonly pendingDelete = this.pendingDeleteSignal.asReadonly();

  readonly filteredProducts = computed(() => {
    const query = this.search().trim().toLowerCase();
    const products = this.products();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.categoryId.toLowerCase().includes(query)
      );
    });
  });

  readonly isEditing = computed(() => this.editingProduct() !== null);
  readonly isEmpty = computed(() => this.products().length === 0);
  readonly hasError = computed(() => this.error() !== null);

  setProducts(products: Product[]): void {
    this.productsSignal.set(products);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setSaving(saving: boolean): void {
    this.savingSignal.set(saving);
  }

  setError(message: string | null): void {
    this.errorSignal.set(message);
  }

  setSearch(query: string): void {
    this.searchSignal.set(query);
  }

  openCreateForm(): void {
    this.formOpenSignal.set(true);
    this.editingProductSignal.set(null);
    this.errorSignal.set(null);
  }

  openEditForm(product: Product): void {
    this.formOpenSignal.set(true);
    this.editingProductSignal.set(product);
    this.errorSignal.set(null);
  }

  closeForm(): void {
    this.formOpenSignal.set(false);
    this.editingProductSignal.set(null);
  }

  requestDelete(product: Product): void {
    this.pendingDeleteSignal.set(product);
  }

  cancelDelete(): void {
    this.pendingDeleteSignal.set(null);
  }
}
