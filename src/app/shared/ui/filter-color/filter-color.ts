import { Component, input, output } from '@angular/core';
import { ProductColor } from '../../../core/models/product.model';

@Component({
  selector: 'app-filter-color',
  imports: [],
  templateUrl: './filter-color.html',
  styleUrl: './filter-color.scss',
  host: {
    class: 'block',
  },
})
export class FilterColor {
  readonly title = input('Color');
  readonly options = input<readonly ProductColor[]>([]);
  readonly selected = input<readonly string[]>([]);
  readonly selectedChange = output<string[]>();

  protected isSelected(hex: string): boolean {
    return this.selected().includes(hex);
  }

  protected toggle(hex: string): void {
    const current = this.selected();
    const next = current.includes(hex)
      ? current.filter((color) => color !== hex)
      : [...current, hex];

    this.selectedChange.emit(next);
  }
}
