import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';
import { environment } from '../../../../environments/environement';
import { OrderCustomer, OrderWriteData } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CartFacade } from '../../cart/facade/cart.facade';
import { buildWhatsAppMessage, toOrderWriteData } from '../models/checkout-order.model';
import { CheckoutStore } from '../store/checkout.store';

@Injectable()
export class CheckoutFacade {
  private readonly store = inject(CheckoutStore);
  private readonly cart = inject(CartFacade);
  private readonly orders = inject(OrderService);
  private readonly messages = inject(MessageService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly items = this.cart.items;
  readonly itemCount = this.cart.itemCount;
  readonly subtotal = this.cart.subtotal;
  readonly isEmpty = this.cart.isEmpty;
  readonly saving = this.store.saving;
  readonly error = this.store.error;
  readonly hasError = this.store.hasError;

  submit(customer: OrderCustomer): void {
    if (this.saving()) {
      return;
    }

    if (this.cart.isEmpty()) {
      this.messages.add({
        severity: 'warn',
        summary: 'Cart is empty',
        detail: 'Add frames before sending an order.',
        life: 3000,
      });
      return;
    }

    const data = toOrderWriteData(customer, this.cart.items(), this.cart.itemCount(), this.cart.subtotal());

    this.store.setSaving(true);
    this.store.setError(null);

    this.orders
      .createOrder(data)
      .pipe(
        take(1),
        tap(() => {
          this.cart.clear();
          this.messages.add({
            severity: 'success',
            summary: 'Order sent',
            detail: 'We saved your order and opened WhatsApp.',
            life: 3500,
          });
          this.openWhatsApp(customer, data);
        }),
        catchError((error: unknown) => {
          const message = this.orders.toUserMessage(error, 'Could not save the order.');
          this.store.setError(message);
          this.messages.add({
            severity: 'error',
            summary: 'Order failed',
            detail: message,
            life: 4500,
          });
          return EMPTY;
        }),
        finalize(() => this.store.setSaving(false)),
      )
      .subscribe();
  }

  private openWhatsApp(customer: OrderCustomer, data: OrderWriteData): void {
    if (!isPlatformBrowser(this.platformId) || !environment.whatsappNumber) {
      return;
    }

    const text = encodeURIComponent(buildWhatsAppMessage(customer, data.items, data.total));
    window.location.assign(`https://wa.me/${environment.whatsappNumber}?text=${text}`);
  }
}
