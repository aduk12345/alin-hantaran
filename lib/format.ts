export function formatIDR(amount: number | null | undefined): string {
  if (amount == null) return "Hubungi kami";
  return new Intl.NumberFormat("id-ID").format(amount);
}

export function formatPrice(amount: number | null | undefined): string {
  return amount == null ? "Hubungi kami" : `Rp${formatIDR(amount)}`;
}
