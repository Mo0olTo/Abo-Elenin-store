import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { publicProductImages } from '../../models/product-form.model';

@Component({
  selector: 'app-image-uploader',
  imports: [NgOptimizedImage],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.scss',
})
export class ImageUploader {
  readonly images = input<string[]>([]);
  readonly disabled = input(false);
  readonly imagesChange = output<string[]>();

  protected readonly catalog = computed(() => {
    const extra = this.images().filter((image) => !publicProductImages.includes(image));
    return [...publicProductImages, ...extra];
  });

  protected isSelected(image: string): boolean {
    return this.images().includes(image);
  }

  protected toggle(image: string): void {
    if (this.disabled()) {
      return;
    }

    if (this.isSelected(image)) {
      this.imagesChange.emit(this.images().filter((item) => item !== image));
      return;
    }

    this.imagesChange.emit([...this.images(), image]);
  }
}
