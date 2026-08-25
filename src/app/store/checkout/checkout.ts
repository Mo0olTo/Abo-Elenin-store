import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { CartItem, cartItemImage, cartSalePrice } from '../cart/models/cart-item.model';
import { CheckoutFacade } from './facade/checkout.facade';
import { CheckoutStore } from './store/checkout.store';

@Component({
  selector: 'app-checkout',
  imports: [Button, CurrencyPipe, ReactiveFormsModule, RouterLink],
  providers: [CheckoutStore, CheckoutFacade],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly facade = inject(CheckoutFacade);

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    notes: [''],
  });

  constructor() {
    effect(() => {
      if (this.facade.saving()) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
    });
  }

  protected imageFor(item: CartItem): string {
    return cartItemImage(item);
  }

  protected lineTotal(item: CartItem): number {
    return cartSalePrice(item.product) * item.quantity;
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.facade.submit({
      fullName: value.fullName.trim(),
      phone: value.phone.trim(),
      address: value.address.trim(),
      notes: value.notes.trim(),
    });
  }
}
