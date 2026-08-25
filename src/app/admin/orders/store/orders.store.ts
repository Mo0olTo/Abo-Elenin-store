import { computed, Injectable, signal } from '@angular/core';
import { Order } from '../../../core/models/order.model';

@Injectable()
export class OrdersStore {
  private readonly ordersSignal = signal<Order[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly savingSignal = signal(false);
  private readonly updatingIdSignal = signal<string | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly searchSignal = signal('');
  private readonly expandedIdSignal = signal<string | null>(null);

  readonly orders = this.ordersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly updatingId = this.updatingIdSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly search = this.searchSignal.asReadonly();
  readonly expandedId = this.expandedIdSignal.asReadonly();

  readonly filteredOrders = computed(() => {
    const query = this.search().trim().toLowerCase();
    const orders = this.orders();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const haystack = [
        order.status,
        order.customer.fullName,
        order.customer.phone,
        order.customer.governorate,
        order.customer.city,
        order.customer.address,
        ...order.items.map((item) => item.name),
        ...order.items.map((item) => item.brand),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  readonly isEmpty = computed(() => this.orders().length === 0);
  readonly hasError = computed(() => this.error() !== null);

  setOrders(orders: Order[]): void {
    this.ordersSignal.set(orders);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setSaving(id: string | null): void {
    this.savingSignal.set(id !== null);
    this.updatingIdSignal.set(id);
  }

  setError(message: string | null): void {
    this.errorSignal.set(message);
  }

  setSearch(query: string): void {
    this.searchSignal.set(query);
  }

  toggleExpanded(id: string): void {
    this.expandedIdSignal.update((current) => (current === id ? null : id));
  }
}
