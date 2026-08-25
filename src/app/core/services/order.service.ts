import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  runTransaction,
  serverTimestamp,
  Timestamp,
  Transaction,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import {
  isOrderStatus,
  Order,
  OrderCustomer,
  OrderLine,
  orderReservesStock,
  OrderStatus,
  OrderUpdateError,
  OrderWriteData,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly firestore = inject(Firestore);

  getOrders(): Observable<Order[]> {
    return from(getDocs(collection(this.firestore, 'orders'))).pipe(
      map((snapshot) =>
        snapshot.docs
          .map((document) => this.toOrder(document.id, document.data() as Record<string, unknown>))
          .sort((left, right) => right.createdAt - left.createdAt),
      ),
    );
  }

  createOrder(data: OrderWriteData): Observable<string> {
    return from(
      addDoc(collection(this.firestore, 'orders'), {
        customer: {
          fullName: data.customer.fullName,
          phone: data.customer.phone,
          governorate: data.customer.governorate,
          city: data.customer.city,
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
        stockApplied: false,
        createdAt: serverTimestamp(),
      }),
    ).pipe(map((reference) => reference.id));
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
    return from(this.commitStatus(id, status));
  }

  toUserMessage(error: unknown, fallback: string): string {
    console.error(error);

    if (error instanceof OrderUpdateError) {
      return error.message;
    }

    switch (this.firebaseErrorCode(error)) {
      case 'permission-denied':
        return 'Firestore blocked this action (permission-denied). Allow signed-in reads/updates on orders and products.';
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

  private async commitStatus(id: string, status: OrderStatus): Promise<void> {
    const orderRef = doc(this.firestore, 'orders', id);

    await runTransaction(this.firestore, async (transaction) => {
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) {
        throw new OrderUpdateError('This order no longer exists.');
      }

      const order = this.toOrder(orderSnap.id, orderSnap.data() as Record<string, unknown>);
      const shouldApply =
        !order.stockApplied && orderReservesStock(status) && !orderReservesStock(order.status);
      const shouldRestore =
        order.stockApplied && !orderReservesStock(status) && orderReservesStock(order.status);

      if (shouldApply) {
        await this.adjustStock(transaction, order.items, -1);
      } else if (shouldRestore) {
        await this.adjustStock(transaction, order.items, 1);
      }

      transaction.update(orderRef, {
        status,
        stockApplied: shouldApply ? true : shouldRestore ? false : order.stockApplied,
        updatedAt: serverTimestamp(),
      });
    });
  }

  private async adjustStock(
    transaction: Transaction,
    items: readonly OrderLine[],
    direction: -1 | 1,
  ): Promise<void> {
    const needed = new Map<string, { quantity: number; name: string }>();

    for (const item of items) {
      if (!item.productId || item.quantity <= 0) {
        continue;
      }

      const current = needed.get(item.productId);
      needed.set(item.productId, {
        quantity: (current?.quantity ?? 0) + item.quantity,
        name: item.name || current?.name || 'this product',
      });
    }

    const snapshots: Array<{
      ref: ReturnType<typeof doc>;
      quantity: number;
      name: string;
      snap: Awaited<ReturnType<Transaction['get']>>;
    }> = [];

    for (const [productId, info] of needed) {
      const productRef = doc(this.firestore, 'products', productId);
      snapshots.push({
        ref: productRef,
        quantity: info.quantity,
        name: info.name,
        snap: await transaction.get(productRef),
      });
    }

    for (const entry of snapshots) {
      if (!entry.snap.exists()) {
        throw new OrderUpdateError(`${entry.name} was not found in the catalog.`);
      }

      const data = entry.snap.data() as Record<string, unknown>;
      const stock = this.readNumber(data['stock']);
      const next = stock + direction * entry.quantity;

      if (direction < 0 && next < 0) {
        throw new OrderUpdateError(`Not enough stock for ${entry.name}.`);
      }

      transaction.update(entry.ref, {
        stock: next,
        updatedAt: serverTimestamp(),
      });
    }
  }

  private toOrder(id: string, data: Record<string, unknown>): Order {
    return {
      id,
      customer: this.toCustomer(data['customer']),
      items: this.toLines(data['items']),
      itemCount: this.readNumber(data['itemCount']),
      total: this.readNumber(data['total']),
      status: this.readStatus(data['status']),
      createdAt: this.toMillis(data['createdAt']),
      stockApplied: data['stockApplied'] === true,
    };
  }

  private toCustomer(value: unknown): OrderCustomer {
    if (typeof value !== 'object' || value === null) {
      return {
        fullName: '',
        phone: '',
        governorate: '',
        city: '',
        address: '',
        notes: '',
      };
    }

    const customer = value as Record<string, unknown>;

    return {
      fullName: this.readString(customer['fullName']),
      phone: this.readString(customer['phone']),
      governorate: this.readString(customer['governorate']),
      city: this.readString(customer['city']),
      address: this.readString(customer['address']),
      notes: this.readString(customer['notes']),
    };
  }

  private toLines(value: unknown): OrderLine[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.flatMap((item) => {
      if (typeof item !== 'object' || item === null) {
        return [];
      }

      const line = item as Record<string, unknown>;

      return [
        {
          productId: this.readString(line['productId']),
          name: this.readString(line['name']),
          brand: this.readString(line['brand']),
          quantity: this.readNumber(line['quantity']),
          unitPrice: this.readNumber(line['unitPrice']),
          lineTotal: this.readNumber(line['lineTotal']),
          imageUrl: this.readString(line['imageUrl']),
        },
      ];
    });
  }

  private readString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private readNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  private readStatus(value: unknown): OrderStatus {
    return isOrderStatus(value) ? value : 'pending';
  }

  private toMillis(value: unknown): number {
    if (value instanceof Timestamp) {
      return value.toMillis();
    }

    return this.readNumber(value);
  }
}
