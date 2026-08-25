import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product.model';
import { CartStore } from '../store/cart.store';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly store = inject(CartStore);
  private readonly messages = inject(MessageService);

  readonly items = this.store.items;
  readonly itemCount = this.store.itemCount;
  readonly subtotal = this.store.subtotal;
  readonly isEmpty = this.store.isEmpty;

  addToCart(product: Product): void {
    const result = this.store.add(product);
    if (result === 'out-of-stock') {
      this.warnNoStock(product.name);
      return;
    }

    this.messages.add({
      severity: 'success',
      summary: 'Added to cart',
      detail: `${product.name} was added to your cart.`,
      life: 3000,
    });
  }

  increment(productId: string): void {
    const item = this.items().find((entry) => entry.product.id === productId);
    const result = this.store.increment(productId);
    if (result === 'out-of-stock') {
      this.warnNoStock(item?.product.name);
    }
  }

  decrement(productId: string): void {
    this.store.decrement(productId);
  }

  remove(productId: string): void {
    this.store.remove(productId);
  }

  clear(): void {
    this.store.clear();
  }

  private warnNoStock(name?: string): void {
    this.messages.add({
      severity: 'warn',
      summary: 'No stock',
      detail: name
        ? `${name} has no more stock.`
        : 'There is no more stock for this frame.',
      life: 3500,
    });
  }
}
