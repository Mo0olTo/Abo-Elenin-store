import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, serverTimestamp } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { OrderWriteData } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly firestore = inject(Firestore);

  createOrder(data: OrderWriteData): Observable<string> {
    return from(
      addDoc(collection(this.firestore, 'orders'), {
        customer: {
          fullName: data.customer.fullName,
          phone: data.customer.phone,
          address: data.customer.address,
          notes: data.customer.notes,
        },
        items: data.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          brand: item.brand,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          imageUrl: item.imageUrl,
        })),
        itemCount: data.itemCount,
        total: data.total,
        status: data.status,
        createdAt: serverTimestamp(),
      }),
    ).pipe(map((reference) => reference.id));
  }

  toUserMessage(error: unknown, fallback: string): string {
    console.error(error);

    switch (this.firebaseErrorCode(error)) {
      case 'permission-denied':
        return 'Firestore blocked this order (permission-denied). Allow public creates on the orders collection.';
      case 'unauthenticated':
        return 'You are not signed in. Please sign in again.';
      case 'unavailable':
      case 'deadline-exceeded':
        return 'Unable to connect to Firestore. Check your network and try again.';
      case 'invalid-argument':
        return 'Firestore rejected the order data (invalid-argument). Check the customer details and cart items.';
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
}
