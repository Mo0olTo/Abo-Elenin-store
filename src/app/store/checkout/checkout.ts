import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, Subject, take } from 'rxjs';
import { Button } from '../../shared/ui/button/button';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog/confirm-dialog';
import { CanLeaveCheckout } from '../../core/guards/checkout.guard';
import { CartItem, cartItemImage, cartSalePrice } from '../cart/models/cart-item.model';
import { CheckoutFacade } from './facade/checkout.facade';
import { egyptGovernorates } from './models/egypt-governorates.model';
import { CheckoutStore } from './store/checkout.store';

@Component({
  selector: 'app-checkout',
  imports: [Button, ConfirmDialog, CurrencyPipe, ReactiveFormsModule, RouterLink],
  providers: [CheckoutStore, CheckoutFacade],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements CanLeaveCheckout {
  private readonly formBuilder = inject(FormBuilder);
  private readonly leaveDecision = new Subject<boolean>();
  protected readonly facade = inject(CheckoutFacade);
  protected readonly governorates = egyptGovernorates;
  protected readonly discardOpen = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    governorate: ['', Validators.required],
    city: ['', [Validators.required, Validators.minLength(2)]],
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

  canDeactivate(): Observable<boolean> | true {
    if (this.facade.allowLeave()) {
      return true;
    }

    this.discardOpen.set(true);
    return this.leaveDecision.pipe(take(1));
  }

  protected stayOnCheckout(): void {
    this.discardOpen.set(false);
    this.leaveDecision.next(false);
  }

  protected discardCheckout(): void {
    this.discardOpen.set(false);
    this.leaveDecision.next(true);
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
      governorate: value.governorate,
      city: value.city.trim(),
      address: value.address.trim(),
      notes: value.notes.trim(),
    });
  }
}
