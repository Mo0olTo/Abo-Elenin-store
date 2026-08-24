import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Product, ProductColor, ProductGender, ProductWriteData } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly firestore = inject(Firestore);

  getProducts(): Observable<Product[]> {
    return from(getDocs(collection(this.firestore, 'products'))).pipe(
      map((snapshot) => snapshot.docs.map((document) => this.toProduct(document.id, document.data()))),
    );
  }

  getActiveProducts(): Observable<Product[]> {
    return this.getProducts().pipe(map((products) => products.filter((product) => product.isActive)));
  }

  getLatestProducts(count = 8): Observable<Product[]> {
    return this.getActiveProducts().pipe(
      map((products) =>
        products
          .slice()
          .sort((left, right) => right.createdAt - left.createdAt)
          .slice(0, count),
      ),
    );
  }

  createProduct(data: ProductWriteData): Observable<string> {
    return from(
      addDoc(collection(this.firestore, 'products'), {
        ...this.toFirestorePayload(data),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ).pipe(map((reference) => reference.id));
  }

  updateProduct(id: string, data: ProductWriteData): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, 'products', id), {
        ...this.toFirestorePayload(data),
        updatedAt: serverTimestamp(),
      }),
    );
  }

  deleteProduct(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'products', id)));
  }

  toUserMessage(error: unknown, fallback: string): string {
    console.error(error);

    switch (this.firebaseErrorCode(error)) {
      case 'permission-denied':
        return 'Firestore blocked this action (permission-denied). Allow writes on the products collection and stay signed in.';
      case 'unauthenticated':
        return 'You are not signed in. Please sign in again.';
      case 'unavailable':
      case 'deadline-exceeded':
        return 'Unable to connect to Firestore. Check your network and try again.';
      case 'invalid-argument':
        return 'Firestore rejected the product data (invalid-argument). Check the images and required fields.';
      default: {
        const code = this.firebaseErrorCode(error);
        return code ? `${fallback} (${code})` : fallback;
      }
    }
  }

  private firebaseErrorCode(error: unknown): string | null {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
      return null;
    }

    const code = error.code;
    if (typeof code !== 'string') {
      return null;
    }

    return code.replace(/^firestore\//, '');
  }

  private toFirestorePayload(data: ProductWriteData): ProductWriteData {
    return {
      name: data.name,
      brand: data.brand,
      categoryId: data.categoryId,
      gender: data.gender,
      price: data.price,
      discount: data.discount,
      description: data.description,
      imageUrl: data.imageUrl,
      images: data.images,
      colors: data.colors,
      stock: data.stock,
      frameColor: data.frameColor,
      frameMaterial: data.frameMaterial,
      isActive: data.isActive,
    };
  }

  private toProduct(id: string, data: Record<string, unknown>): Product {
    const images = this.readImages(data);
    const colors = this.readColors(data['colors']);

    return {
      id,
      name: this.readString(data['name']),
      brand: this.readString(data['brand']),
      categoryId: this.readString(data['categoryId']),
      gender: this.readGender(data['gender']),
      price: this.readNumber(data['price']),
      discount: this.readNumber(data['discount']),
      description: this.readString(data['description']),
      imageUrl: this.readString(data['imageUrl']) || images[0] || '',
      images,
      colors,
      stock: this.readNumber(data['stock']),
      frameColor: this.readString(data['frameColor']) || colors[0]?.name || '',
      frameMaterial: this.readString(data['frameMaterial']),
      isActive: data['isActive'] === true,
      createdAt: this.toMillis(data['createdAt']),
      updatedAt: this.toMillis(data['updatedAt']),
    };
  }

  private readString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private readNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  private readImages(data: Record<string, unknown>): string[] {
    const images = this.readStringArray(data['images']);
    const imageUrl = this.readString(data['imageUrl']);

    if (images.length > 0) {
      return images;
    }

    return imageUrl ? [imageUrl] : [];
  }

  private readColors(value: unknown): ProductColor[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.flatMap((item) => {
      if (typeof item !== 'object' || item === null) {
        return [];
      }

      const color = item as Record<string, unknown>;
      const name = this.readString(color['name']);
      const hex = this.readString(color['hex']);

      if (!name || !hex) {
        return [];
      }

      return [{ name, hex }];
    });
  }

  private readStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  }

  private readGender(value: unknown): ProductGender {
    if (value === 'men' || value === 'women' || value === 'kids' || value === 'unisex') {
      return value;
    }

    return 'unisex';
  }

  private toMillis(value: unknown): number {
    if (value instanceof Timestamp) {
      return value.toMillis();
    }

    return this.readNumber(value);
  }
}
