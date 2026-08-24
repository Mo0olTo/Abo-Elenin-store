import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { HeroSection } from '../../shared/ui/hero-section/hero-section';
import { HomeSectionTitle } from '../../shared/ui/home-section-title/home-section-title';
import { ProductsCarousel } from '../../shared/ui/products-carousel/products-carousel';
import { AboutUs } from './components/about-us/about-us';
import { TrendingStyles } from './components/trending-styles/trending-styles';
import { WhyUs } from './components/why-us/why-us';

@Component({
  selector: 'app-home',
  imports: [AboutUs, HeroSection, HomeSectionTitle, ProductsCarousel, TrendingStyles, WhyUs],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly productService = inject(ProductService);

  protected readonly latestProducts = signal<Product[]>([]);

  constructor() {
    this.productService
      .getLatestProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => this.latestProducts.set(products));
  }

  protected onAddToCart(_product: Product): void {
    // Cart service will handle this next.
  }
}
