import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog/confirm-dialog';
import { CartFacade } from './facade/cart.facade';
import { CartItem, cartItemImage, cartSalePrice } from './models/cart-item.model';

@Component({
  selector: 'app-cart',
  imports: [Button, ConfirmDialog, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private readonly router = inject(Router);
  protected readonly facade = inject(CartFacade);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.facade.cancelRemove());
  }

  protected imageFor(item: CartItem): string {
    return cartItemImage(item);
  }

  protected unitPrice(item: CartItem): number {
    return cartSalePrice(item.product);
  }

  protected lineTotal(item: CartItem): number {
    return cartSalePrice(item.product) * item.quantity;
  }

  protected goToCheckout(): void {
    void this.router.navigateByUrl('/store/checkout');
  }
}
