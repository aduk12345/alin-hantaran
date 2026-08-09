export function buildInstagramLink(handle: string): string {
  const clean = handle.trim().replace(/^@/, "");
  return `https://instagram.com/${encodeURIComponent(clean)}`;
}

export function buildTikTokLink(handle: string): string {
  const clean = handle.trim().replace(/^@/, "").replace(/\s+/g, "");
  return `https://www.tiktok.com/@${encodeURIComponent(clean)}`;
}

export function buildGoogleMapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
