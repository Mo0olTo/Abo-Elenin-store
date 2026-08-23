import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, finalize, map, switchMap, take, tap } from 'rxjs';
import { Product, ProductWriteData } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductsStore } from '../store/products.store';

@Injectable()
export class ProductsFacade {
  private readonly store = inject(ProductsStore);
  private readonly productService = inject(ProductService);

  readonly products = this.store.filteredProducts;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly error = this.store.error;
  readonly search = this.store.search;
  readonly formOpen = this.store.formOpen;
  readonly editingProduct = this.store.editingProduct;
  readonly isEditing = this.store.isEditing;
  readonly isEmpty = this.store.isEmpty;
  readonly hasError = this.store.hasError;
  readonly pendingDelete = this.store.pendingDelete;

  constructor() {
    this.load();
  }

  load(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.productService
      .getProducts()
      .pipe(
        take(1),
        tap((products) => this.store.setProducts(products)),
        catchError((error: unknown) => {
          this.store.setError(this.productService.toUserMessage(error, 'Products could not be loaded.'));
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setSearch(query: string): void {
    this.store.setSearch(query);
  }

  startCreate(): void {
    this.store.openCreateForm();
  }

  startEdit(product: Product): void {
    this.store.openEditForm(product);
  }

  cancelForm(): void {
    this.store.closeForm();
  }

  save(data: ProductWriteData): void {
    const editingId = this.editingProduct()?.id ?? null;
    this.store.setSaving(true);
    this.store.setError(null);

    const save$ = editingId
      ? this.productService.updateProduct(editingId, data)
      : this.productService.createProduct(data).pipe(map(() => undefined));

    save$
      .pipe(
        take(1),
        tap(() => this.store.closeForm()),
        switchMap(() => this.productService.getProducts()),
        tap((products) => this.store.setProducts(products)),
        catchError((error: unknown) => {
          this.store.setError(
            this.productService.toUserMessage(
              error,
              editingId ? 'Product could not be updated.' : 'Product could not be created.',
            ),
          );
          return EMPTY;
        }),
        finalize(() => this.store.setSaving(false)),
      )
      .subscribe();
  }

  requestDelete(product: Product): void {
    this.store.requestDelete(product);
  }

  cancelDelete(): void {
    this.store.cancelDelete();
  }

  confirmDelete(): void {
    const product = this.pendingDelete();
    if (!product) {
      return;
    }

    this.store.setSaving(true);
    this.store.setError(null);

    this.productService
      .deleteProduct(product.id)
      .pipe(
        take(1),
        tap(() => this.store.cancelDelete()),
        switchMap(() => this.productService.getProducts()),
        tap((products) => this.store.setProducts(products)),
        catchError((error: unknown) => {
          this.store.setError(this.productService.toUserMessage(error, 'Product could not be deleted.'));
          return EMPTY;
        }),
        finalize(() => this.store.setSaving(false)),
      )
      .subscribe();
  }

  toggleActive(product: Product): void {
    this.store.setSaving(true);
    this.store.setError(null);

    this.productService
      .updateProduct(product.id, {
        name: product.name,
        brand: product.brand,
        categoryId: product.categoryId,
        gender: product.gender,
        price: product.price,
        discount: product.discount,
        description: product.description,
        imageUrl: product.imageUrl,
        images: product.images,
        colors: product.colors,
        stock: product.stock,
        frameColor: product.frameColor,
        frameMaterial: product.frameMaterial,
        isActive: !product.isActive,
      })
      .pipe(
        take(1),
        switchMap(() => this.productService.getProducts()),
        tap((products) => this.store.setProducts(products)),
        catchError((error: unknown) => {
          this.store.setError(this.productService.toUserMessage(error, 'Product could not be updated.'));
          return EMPTY;
        }),
        finalize(() => this.store.setSaving(false)),
      )
      .subscribe();
  }
}
