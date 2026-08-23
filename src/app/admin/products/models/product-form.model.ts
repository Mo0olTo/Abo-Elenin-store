import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Product, ProductColor, ProductGender, ProductWriteData } from '../../../core/models/product.model';

export interface ProductFormValue {
  readonly name: string;
  readonly brand: string;
  readonly categoryId: string;
  readonly gender: ProductGender;
  readonly price: number | null;
  readonly discount: number | null;
  readonly stock: number | null;
  readonly frameMaterial: string;
  readonly lensType: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly colors: ProductColor[];
  readonly images: string[];
}

export const emptyProductForm: ProductFormValue = {
  name: '',
  brand: '',
  categoryId: '',
  gender: 'unisex',
  price: null,
  discount: 0,
  stock: 0,
  frameMaterial: '',
  lensType: '',
  description: '',
  isActive: true,
  colors: [],
  images: [],
};

export const frameColorPalette: readonly ProductColor[] = [
  { name: 'Black', hex: '#111111' },
  { name: 'Gold', hex: '#C9A227' },
  { name: 'Tortoise', hex: '#8B5A2B' },
  { name: 'Brown', hex: '#4A2C12' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gunmetal', hex: '#4B4F54' },
  { name: 'Crystal', hex: '#E8E6E1' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Burgundy', hex: '#8B1E1E' },
  { name: 'Forest', hex: '#2F4F3E' },
  { name: 'Rose gold', hex: '#B76E79' },
  { name: 'White', hex: '#F5F5F5' },
];

export const productGenders: readonly ProductGender[] = ['men', 'women', 'unisex'];

export const publicProductImages: readonly string[] = [
  '/images/products/1.jpg',
  '/images/products/2.jpg',
  '/images/products/3.jpg',
];

export function requireItems(control: AbstractControl<unknown[]>): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}

export function productToForm(product: Product): ProductFormValue {
  return {
    name: product.name,
    brand: product.brand,
    categoryId: product.categoryId,
    gender: product.gender,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    frameMaterial: product.frameMaterial,
    lensType: '',
    description: product.description,
    isActive: product.isActive,
    colors: product.colors ?? [],
    images: product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [],
  };
}

export function formToWriteData(form: ProductFormValue): ProductWriteData | null {
  const name = form.name.trim();
  const price = Number(form.price);
  const discount = Number(form.discount ?? 0);
  const stock = Number(form.stock ?? 0);
  const images = form.images.filter((image) => image.trim().length > 0);

  if (!name || images.length === 0 || !Number.isFinite(price) || price <= 0) {
    return null;
  }

  if (!Number.isFinite(discount) || discount < 0 || !Number.isFinite(stock) || stock < 0) {
    return null;
  }

  return {
    name,
    brand: form.brand.trim(),
    categoryId: form.categoryId.trim(),
    gender: form.gender,
    price,
    discount,
    description: form.description.trim(),
    imageUrl: images[0],
    images,
    colors: form.colors,
    stock,
    frameColor: form.colors[0]?.name ?? '',
    frameMaterial: form.frameMaterial.trim(),
    isActive: form.isActive,
  };
}
