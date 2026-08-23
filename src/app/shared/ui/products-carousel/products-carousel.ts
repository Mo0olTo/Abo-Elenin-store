import { Component, effect, input, output, signal, viewChild } from '@angular/core';
import { EmblaCarouselDirective, EmblaEventType, EmblaOptionsType } from 'embla-carousel-angular';
import { Product } from '../../../core/models/product.model';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-products-carousel',
  imports: [ProductCard, EmblaCarouselDirective],
  templateUrl: './products-carousel.html',
  styleUrl: './products-carousel.scss',
})
export class ProductsCarousel {
  readonly products = input<Product[]>([]);
  readonly addToCart = output<Product>();

  private readonly emblaRef = viewChild(EmblaCarouselDirective);

  protected readonly canScrollPrev = signal(false);
  protected readonly canScrollNext = signal(false);

  protected readonly options: EmblaOptionsType = {
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    slidesToScroll: 1,
  };

  protected readonly emblaEvents: EmblaEventType[] = ['init', 'reInit', 'select'];

  constructor() {
    effect(() => {
      this.products();
      this.emblaRef()?.reInit();
      this.onEmblaChange();
    });
  }

  protected onEmblaChange(): void {
    const api = this.emblaRef()?.emblaApi;
    if (!api) {
      return;
    }

    this.canScrollPrev.set(api.canScrollPrev());
    this.canScrollNext.set(api.canScrollNext());
  }

  protected scrollPrev(): void {
    this.emblaRef()?.scrollPrev();
  }

  protected scrollNext(): void {
    this.emblaRef()?.scrollNext();
  }
}
