const DEFAULT_WHATSAPP_NUMBER = "6281330247617";

export function buildWhatsAppLink(message: string, phone: string = DEFAULT_WHATSAPP_NUMBER): string {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}

export function cartOrderMessage(items: { name: string }[]): string {
  const list = items.map((item) => `- ${item.name}`).join("\n");
  return `Halo, saya mau pesan:\n${list}`;
}
