import { Component, input, output } from '@angular/core';
import { ProductColor } from '../../../../core/models/product.model';
import { frameColorPalette } from '../../models/product-form.model';

@Component({
  selector: 'app-color-palette',
  imports: [],
  templateUrl: './color-palette.html',
  styleUrl: './color-palette.scss',
})
export class ColorPalette {
  readonly selected = input<ProductColor[]>([]);
  readonly disabled = input(false);
  readonly selectedChange = output<ProductColor[]>();

  protected readonly palette = frameColorPalette;
  protected customHex = '#111111';

  protected isSelected(color: ProductColor): boolean {
    return this.selected().some((item) => item.hex.toLowerCase() === color.hex.toLowerCase());
  }

  protected toggle(color: ProductColor): void {
    if (this.disabled()) {
      return;
    }

    if (this.isSelected(color)) {
      this.selectedChange.emit(
        this.selected().filter((item) => item.hex.toLowerCase() !== color.hex.toLowerCase()),
      );
      return;
    }

    this.selectedChange.emit([...this.selected(), color]);
  }

  protected onCustomHexChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.customHex = target.value;
  }

  protected addCustomColor(): void {
    if (this.disabled()) {
      return;
    }

    const hex = this.customHex.toUpperCase();
    const color: ProductColor = { name: hex, hex };

    if (this.isSelected(color)) {
      return;
    }

    this.selectedChange.emit([...this.selected(), color]);
  }

  protected remove(color: ProductColor): void {
    this.toggle(color);
  }
}
