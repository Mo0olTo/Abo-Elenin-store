import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CartAddResult, CartItem, cartSalePrice } from '../models/cart-item.model';

const STORAGE_KEY = 'abo-elenin-cart';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = this.itemsSignal.asReadonly();
  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + cartSalePrice(item.product) * item.quantity, 0),
  );
  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.itemsSignal.set(this.readStoredItems());

    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    });
  }

  add(product: Product): CartAddResult {
    if (product.stock <= 0) {
      return 'out-of-stock';
    }

    const current = this.items();
    const existing = current.find((item) => item.product.id === product.id);

    if (!existing) {
      this.itemsSignal.set([...current, { product, quantity: 1 }]);
      return 'added';
    }

    if (existing.quantity >= existing.product.stock) {
      return 'out-of-stock';
    }

    this.patchQuantity(product.id, existing.quantity + 1);
    return 'increased';
  }

  increment(productId: string): CartAddResult {
    const item = this.items().find((entry) => entry.product.id === productId);
    if (!item) {
      return 'added';
    }

    if (item.quantity >= item.product.stock) {
      return 'out-of-stock';
    }

    this.patchQuantity(productId, item.quantity + 1);
    return 'increased';
  }

  decrement(productId: string): void {
    const item = this.items().find((entry) => entry.product.id === productId);
    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      this.remove(productId);
      return;
    }

    this.patchQuantity(productId, item.quantity - 1);
  }

  remove(productId: string): void {
    this.itemsSignal.set(this.items().filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.itemsSignal.set([]);
  }

  private patchQuantity(productId: string, quantity: number): void {
    this.itemsSignal.set(
      this.items().map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  }

  private readStoredItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.flatMap((entry) => {
        if (typeof entry !== 'object' || entry === null) {
          return [];
        }

        const item = entry as Partial<CartItem>;
        const product = item.product;
        const quantity = item.quantity;

        if (!product || typeof product.id !== 'string' || typeof quantity !== 'number') {
          return [];
        }

        if (!Number.isInteger(quantity) || quantity < 1 || product.stock <= 0) {
          return [];
        }

        return [{ product, quantity: Math.min(quantity, product.stock) }];
      });
    } catch {
      return [];
    }
  }
}
