import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Product, productSalePrice } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { Button } from '../../shared/ui/button/button';
import { CartFacade } from '../cart/facade/cart.facade';
import { ProductDetailsState } from './models/product-details.model';

@Component({
  selector: 'app-product-details',
  imports: [AsyncPipe, Button, CurrencyPipe, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartFacade);

  protected product$!: Observable<ProductDetailsState>;
  protected readonly activeImageIndex = signal(0);
  protected readonly selectedColorIndex = signal(0);

  ngOnInit(): void {
    this.loadProductDetails();
  }

  private loadProductDetails(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') ?? '';
        this.activeImageIndex.set(0);
        this.selectedColorIndex.set(0);

        return this.productService.getActiveProducts().pipe(
          map(
            (products): ProductDetailsState => ({
              loading: false,
              product: products.find((item) => item.id === id) ?? null,
            }),
          ),
          startWith({ loading: true, product: null } satisfies ProductDetailsState),
          catchError(() => of({ loading: false, product: null } satisfies ProductDetailsState)),
        );
      }),
    );
  }

  protected salePrice(product: Product): number {
    return productSalePrice(product);
  }

  protected selectImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  protected selectColor(index: number): void {
    this.selectedColorIndex.set(index);
  }

  protected onAddToCart(product: Product): void {
    this.cart.addToCart(product);
  }
}
