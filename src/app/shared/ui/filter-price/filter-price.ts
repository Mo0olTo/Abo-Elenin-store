import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface FilterPriceRange {
  readonly min: number;
  readonly max: number;
}

@Component({
  selector: 'app-filter-price',
  imports: [CurrencyPipe],
  templateUrl: './filter-price.html',
  styleUrl: './filter-price.scss',
  host: {
    class: 'block',
  },
})
export class FilterPrice {
  readonly title = input('Price');
  readonly min = input(0);
  readonly max = input(0);
  readonly range = input<FilterPriceRange>({ min: 0, max: 0 });
  readonly rangeChange = output<FilterPriceRange>();

  protected readonly canSlide = computed(() => this.max() > this.min());

  protected onMinInput(event: Event): void {
    const value = this.readNumber(event);
    const nextMin = Math.min(this.range().max, Math.max(this.min(), value));
    this.rangeChange.emit({ min: nextMin, max: this.range().max });
  }

  protected onMaxInput(event: Event): void {
    const value = this.readNumber(event);
    const nextMax = Math.max(this.range().min, Math.min(this.max(), value));
    this.rangeChange.emit({ min: this.range().min, max: nextMax });
  }

  private readNumber(event: Event): number {
    const value = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(value) ? value : this.min();
  }
}
