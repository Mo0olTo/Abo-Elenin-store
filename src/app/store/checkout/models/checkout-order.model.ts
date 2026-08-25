import { OrderCustomer, OrderLine, OrderWriteData } from '../../../core/models/order.model';
import { CartItem, cartItemImage, cartSalePrice } from '../../cart/models/cart-item.model';

export function toOrderWriteData(
  customer: OrderCustomer,
  items: readonly CartItem[],
  itemCount: number,
  total: number,
): OrderWriteData {
  return {
    customer,
    items: items.map((item) => toOrderLine(item)),
    itemCount,
    total,
    status: 'pending',
  };
}

export function buildWhatsAppMessage(
  customer: OrderCustomer,
  items: readonly OrderLine[],
  total: number,
): string {
  const lines = items.map(
    (item) => `• ${item.name} (${item.brand}) × ${item.quantity} — ${item.lineTotal} EGP`,
  );
  const noteLine = customer.notes ? [`Notes: ${customer.notes}`] : [];

  return [
    'New order from Abo Elenin Glasses',
    '',
    `Name: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    `Governorate: ${customer.governorate}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    ...noteLine,
    '',
    'Items:',
    ...lines,
    '',
    `Total: ${total} EGP`,
  ].join('\n');
}

function toOrderLine(item: CartItem): OrderLine {
  const unitPrice = cartSalePrice(item.product);

  return {
    productId: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    quantity: item.quantity,
    unitPrice,
    lineTotal: unitPrice * item.quantity,
    imageUrl: cartItemImage(item),
  };
}
