import { Component, inject } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { FilterBrand } from '../../shared/ui/filter-brand/filter-brand';
import { FilterColor } from '../../shared/ui/filter-color/filter-color';
import { FilterGender } from '../../shared/ui/filter-gender/filter-gender';
import { FilterPrice } from '../../shared/ui/filter-price/filter-price';
import { FilterSort } from '../../shared/ui/filter-sort/filter-sort';
import { ProductCard } from '../../shared/ui/product-card/product-card';
import { CartFacade } from '../cart/facade/cart.facade';
import { ProductsFacade } from './facade/products.facade';
import { ProductsStore } from './store/products.store';

@Component({
  selector: 'app-products',
  imports: [FilterBrand, FilterColor, FilterGender, FilterPrice, FilterSort, ProductCard],
  providers: [ProductsStore, ProductsFacade],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class Products {
  protected readonly facade = inject(ProductsFacade);
  private readonly cart = inject(CartFacade);

  protected onAddToCart(product: Product): void {
    this.cart.addToCart(product);
  }

  protected onEscape(): void {
    this.facade.closeFilters();
  }
}
