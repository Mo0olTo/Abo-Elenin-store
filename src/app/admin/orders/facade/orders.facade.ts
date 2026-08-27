import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, finalize, switchMap, take, tap } from 'rxjs';
import { isOrderStatus, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { OrdersStore } from '../store/orders.store';

@Injectable()
export class OrdersFacade {
  private readonly store = inject(OrdersStore);
  private readonly orderService = inject(OrderService);
  private readonly messages = inject(MessageService);

  readonly orders = this.store.filteredOrders;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly updatingId = this.store.updatingId;
  readonly error = this.store.error;
  readonly search = this.store.search;
  readonly expandedId = this.store.expandedId;
  readonly isEmpty = this.store.isEmpty;
  readonly hasError = this.store.hasError;

  constructor() {
    this.load();
  }

  load(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.orderService
      .getOrders()
      .pipe(
        take(1),
        tap((orders) => this.store.setOrders(orders)),
        catchError((error: unknown) => {
          this.store.setError(this.orderService.toUserMessage(error, 'Orders could not be loaded.'));
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  setSearch(query: string): void {
    this.store.setSearch(query);
  }

  toggleExpanded(id: string): void {
    this.store.toggleExpanded(id);
  }

  updateStatus(id: string, status: OrderStatus): void {
    if (this.saving() || !isOrderStatus(status)) {
      return;
    }

    const current = this.store.orders().find((order) => order.id === id);
    if (!current || current.status === status) {
      return;
    }

    this.store.setSaving(id);
    this.store.setError(null);

    this.orderService
      .updateOrderStatus(id, status)
      .pipe(
        take(1),
        switchMap(() => this.orderService.getOrders()),
        tap((orders) => {
          this.store.setOrders(orders);
          this.messages.add({
            severity: 'success',
            summary: 'Order updated',
            detail: this.statusMessage(status, current.stockApplied),
            life: 2500,
          });
        }),
        catchError((error: unknown) => {
          const message = this.orderService.toUserMessage(error, 'Order status could not be updated.');
          this.store.setError(message);
          this.messages.add({
            severity: 'error',
            summary: 'Update failed',
            detail: message,
            life: 4500,
          });
          return EMPTY;
        }),
        finalize(() => this.store.setSaving(null)),
      )
      .subscribe();
  }

  private statusMessage(status: OrderStatus, stockApplied: boolean): string {
    if (!stockApplied && (status === 'confirmed' || status === 'shipped' || status === 'delivered')) {
      return `Status changed to ${status} and stock was deducted.`;
    }

    if (stockApplied && (status === 'cancelled' || status === 'pending')) {
      return `Status changed to ${status} and stock was restored.`;
    }

    return `Status changed to ${status}.`;
  }
}
