import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, output, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { interval, timer } from 'rxjs';
import { Product, productSalePrice } from '../../../core/models/product.model';
import { Button } from '../button/button';

@Component({
  selector: 'app-product-card',
  imports: [Button, CurrencyPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  host: {
    class: 'block h-full',
  },
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly activeIndex = signal(0);
  protected readonly hovered = signal(false);
  protected readonly adding = signal(false);

  protected readonly images = computed(() => this.product().images ?? []);
  protected readonly colors = computed(() => this.product().colors ?? []);
  protected readonly hasColors = computed(() => this.colors().length > 0);
  protected readonly hasDiscount = computed(() => this.product().discount > 0);
  protected readonly salePrice = computed(() => productSalePrice(this.product()));
  protected readonly isOutOfStock = computed(() => this.product().stock <= 0);

  constructor() {
    effect(() => {
      this.product().id;
      this.activeIndex.set(0);
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    interval(2000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.hovered()) {
          return;
        }

        const count = this.images().length;
        if (count < 2) {
          return;
        }

        this.activeIndex.update((index) => (index + 1) % count);
      });
  }

  protected onAddToCart(): void {
    if (this.isOutOfStock() || this.adding()) {
      return;
    }

    this.adding.set(true);
    this.addToCart.emit(this.product());

    if (!isPlatformBrowser(this.platformId)) {
      this.adding.set(false);
      return;
    }

    timer(500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.adding.set(false));
  }
}
