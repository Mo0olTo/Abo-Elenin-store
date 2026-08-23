import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', {
      id: '1',
      name: 'Classic frame',
      brand: 'Abo Elenin',
      categoryId: 'sunglasses',
      gender: 'unisex',
      price: 1200,
      discount: 0,
      description: '',
      imageUrl: '/images/hero/man-1.webp',
      images: ['/images/hero/man-1.webp'],
      colors: [],
      stock: 10,
      frameColor: '',
      frameMaterial: '',
      lensType: '',
      isActive: true,
      createdAt: 0,
      updatedAt: 0,
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
