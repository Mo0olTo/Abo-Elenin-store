import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { isOrderStatus, Order, orderStatuses, OrderStatus } from '../../../../core/models/order.model';
import { OrdersFacade } from '../../facade/orders.facade';
import { OrdersStore } from '../../store/orders.store';

@Component({
  selector: 'app-admin-orders',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet],
  providers: [OrdersStore, OrdersFacade],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  protected readonly facade = inject(OrdersFacade);
  protected readonly statuses = orderStatuses;

  protected onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.facade.setSearch(target.value);
  }

  protected onStatusChange(order: Order, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (!isOrderStatus(target.value)) {
      return;
    }

    this.facade.updateStatus(order.id, target.value);
  }

  protected statusClass(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'confirmed':
        return 'border-sky-200 bg-sky-50 text-sky-700';
      case 'shipped':
        return 'border-indigo-200 bg-indigo-50 text-indigo-700';
      case 'delivered':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'cancelled':
        return 'border-red-200 bg-red-50 text-red-700';
    }
  }
}
