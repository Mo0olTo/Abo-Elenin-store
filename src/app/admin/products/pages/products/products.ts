import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductColor, ProductGender } from '../../../../core/models/product.model';
import { Button } from '../../../../shared/ui/button/button';
import { ColorPalette } from '../../components/color-palette/color-palette';
import { ImageUploader } from '../../components/image-uploader/image-uploader';
import { ProductsFacade } from '../../facade/products.facade';
import {
  emptyProductForm,
  formToWriteData,
  productGenders,
  productToForm,
  requireItems,
} from '../../models/product-form.model';
import { ProductsStore } from '../../store/products.store';

@Component({
  selector: 'app-admin-products',
  imports: [Button, ColorPalette, CurrencyPipe, ImageUploader, ReactiveFormsModule],
  providers: [ProductsStore, ProductsFacade],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly facade = inject(ProductsFacade);
  protected readonly genders = productGenders;

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    brand: [''],
    categoryId: [''],
    gender: ['unisex' as ProductGender, Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    discount: [0 as number | null, [Validators.min(0)]],
    stock: [0 as number | null, [Validators.min(0)]],
    frameMaterial: [''],
    lensType: [''],
    description: [''],
    isActive: [true],
    colors: this.formBuilder.nonNullable.control<ProductColor[]>([]),
    images: this.formBuilder.nonNullable.control<string[]>([], { validators: [requireItems] }),
  });

  constructor() {
    effect(() => {
      if (!this.facade.formOpen()) {
        return;
      }

      const product = this.facade.editingProduct();
      this.form.reset(product ? productToForm(product) : emptyProductForm);
    });

    effect(() => {
      if (this.facade.saving()) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
    });
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();

    const data = formToWriteData(this.form.getRawValue());
    if (!data) {
      return;
    }

    this.facade.save(data);
  }

  protected onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.facade.setSearch(target.value);
  }

  protected onColorsChange(colors: ProductColor[]): void {
    this.form.controls.colors.setValue(colors);
    this.form.controls.colors.markAsDirty();
  }

  protected onImagesChange(images: string[]): void {
    this.form.controls.images.setValue(images);
    this.form.controls.images.markAsDirty();
    this.form.controls.images.updateValueAndValidity();
  }

  protected onEdit(product: Product): void {
    this.facade.startEdit(product);
  }

  protected onDelete(product: Product): void {
    this.facade.requestDelete(product);
  }

  protected onToggleActive(product: Product): void {
    this.facade.toggleActive(product);
  }
}
