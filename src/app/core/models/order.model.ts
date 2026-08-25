export interface OrderCustomer {
  readonly fullName: string;
  readonly phone: string;
  readonly governorate: string;
  readonly city: string;
  readonly address: string;
  readonly notes: string;
}

export interface OrderLine {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly lineTotal: number;
  readonly imageUrl: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export const orderStatuses: readonly OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return orderStatuses.includes(value as OrderStatus);
}

export function orderReservesStock(status: OrderStatus): boolean {
  return status === 'confirmed' || status === 'shipped' || status === 'delivered';
}

export class OrderUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderUpdateError';
  }
}

export interface OrderWriteData {
  readonly customer: OrderCustomer;
  readonly items: OrderLine[];
  readonly itemCount: number;
  readonly total: number;
  readonly status: OrderStatus;
}

export interface Order extends OrderWriteData {
  readonly id: string;
  readonly createdAt: number;
  readonly stockApplied: boolean;
}
