export const WHATSAPP_NUMBER = '2347065076565';

export function getWhatsAppOrderUrl(
  productName: string,
  priceStr?: string,
  color?: string,
  size?: string,
  quantity?: number,
  productUrl?: string
): string {
  const parts: string[] = [];
  if (priceStr) parts.push(`Price: ${priceStr}`);
  if (color && color.toLowerCase() !== 'default') parts.push(`Finish: ${color}`);
  if (size) parts.push(`Size: ${size}`);
  if (quantity && quantity > 1) parts.push(`Qty: ${quantity}`);

  const details = parts.length > 0 ? `\n${parts.join('\n')}` : '';
  const urlLine = productUrl ? `\n\n${productUrl}` : '';
  const message = `Hi OMO ESHO SIGNATURES, I would like to inquire about this product:\n\nProduct: ${productName}${details}${urlLine}\n\nCould you please share more details regarding availability and how to proceed?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppConciergeUrl(customMsg?: string): string {
  const message = customMsg || 'Hi OMO ESHO SIGNATURES, I would like to make an inquiry with the private client concierge.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
