export interface OrderCustomer {
  readonly fullName: string;
  readonly phone: string;
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

export interface OrderWriteData {
  readonly customer: OrderCustomer;
  readonly items: OrderLine[];
  readonly itemCount: number;
  readonly total: number;
  readonly status: 'pending';
}

export interface Order extends OrderWriteData {
  readonly id: string;
  readonly createdAt: number;
}
