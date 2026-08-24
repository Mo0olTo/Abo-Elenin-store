import { Component, input, output } from '@angular/core';
import { ProductGender } from '../../../core/models/product.model';

@Component({
  selector: 'app-filter-gender',
  imports: [],
  templateUrl: './filter-gender.html',
  styleUrl: './filter-gender.scss',
  host: {
    class: 'block',
  },
})
export class FilterGender {
  readonly title = input('Gender');
  readonly options = input<readonly ProductGender[]>(['men', 'women', 'kids', 'unisex']);
  readonly selected = input<readonly ProductGender[]>([]);
  readonly selectedChange = output<ProductGender[]>();

  protected isSelected(option: ProductGender): boolean {
    return this.selected().includes(option);
  }

  protected labelFor(option: ProductGender): string {
    return option.charAt(0).toUpperCase() + option.slice(1);
  }

  protected toggle(option: ProductGender): void {
    const current = this.selected();
    const next = current.includes(option)
      ? current.filter((gender) => gender !== option)
      : [...current, option];

    this.selectedChange.emit(next);
  }
}
