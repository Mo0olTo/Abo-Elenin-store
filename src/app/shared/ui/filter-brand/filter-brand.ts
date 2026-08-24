import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-brand',
  imports: [],
  templateUrl: './filter-brand.html',
  styleUrl: './filter-brand.scss',
  host: {
    class: 'block',
  },
})
export class FilterBrand {
  readonly title = input('Brand');
  readonly options = input<readonly string[]>([]);
  readonly selected = input<readonly string[]>([]);
  readonly selectedChange = output<string[]>();

  protected isSelected(option: string): boolean {
    return this.selected().includes(option);
  }

  protected toggle(option: string): void {
    const current = this.selected();
    const next = current.includes(option)
      ? current.filter((brand) => brand !== option)
      : [...current, option];

    this.selectedChange.emit(next);
  }
}
