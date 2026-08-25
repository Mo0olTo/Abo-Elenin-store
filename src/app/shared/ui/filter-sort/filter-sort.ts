import { Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';
import { ProductSort, productSortOptions } from '../../../core/models/product-sort.model';

@Component({
  selector: 'app-filter-sort',
  imports: [],
  templateUrl: './filter-sort.html',
  styleUrl: './filter-sort.scss',
  host: {
    '[class]': 'hostClass()',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class FilterSort {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly title = input('Sort');
  readonly layout = input<'list' | 'menu'>('list');
  readonly selected = input<ProductSort>('newest');
  readonly selectedChange = output<ProductSort>();

  protected readonly options = productSortOptions;
  protected readonly menuOpen = signal(false);

  protected readonly hostClass = computed(() =>
    this.layout() === 'menu' ? 'relative inline-flex' : 'block',
  );

  protected readonly selectedLabel = computed(() => {
    return this.options.find((option) => option.value === this.selected())?.label ?? 'Sort';
  });

  protected select(value: ProductSort): void {
    this.selectedChange.emit(value);
    this.menuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }

    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }
}
