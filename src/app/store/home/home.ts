import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { HeroSection } from '../../shared/ui/hero-section/hero-section';
import { HomeSectionTitle } from '../../shared/ui/home-section-title/home-section-title';
import { ProductsCarousel } from '../../shared/ui/products-carousel/products-carousel';
import { CartFacade } from '../cart/facade/cart.facade';
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
  private readonly cart = inject(CartFacade);

  protected readonly latestProducts = signal<Product[]>([]);

  constructor() {
    this.productService
      .getLatestProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => this.latestProducts.set(products));
  }

  protected onAddToCart(product: Product): void {
    this.cart.addToCart(product);
  }
}
