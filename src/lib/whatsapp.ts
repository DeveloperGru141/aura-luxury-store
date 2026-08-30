export const WHATSAPP_NUMBER = '2347065076565';

export function getWhatsAppOrderUrl(
  productName: string,
  priceStr?: string,
  color?: string,
  size?: string,
  quantity?: number
): string {
  const parts: string[] = [];
  if (priceStr) parts.push(`Price: ${priceStr}`);
  if (color) parts.push(`Finish: ${color}`);
  if (size) parts.push(`Size: ${size}`);
  if (quantity && quantity > 1) parts.push(`Qty: ${quantity}`);

  const details = parts.length > 0 ? ` (${parts.join(' | ')})` : '';
  const message = `Hi TIMELESS, I would like to place an order for: ${productName}${details}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppConciergeUrl(customMsg?: string): string {
  const message = customMsg || 'Hi TIMELESS, I would like to make an inquiry with the private client concierge.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
