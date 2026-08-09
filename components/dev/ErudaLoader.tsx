"use client";

import Script from "next/script";

export function ErudaLoader() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-expect-error eruda is loaded globally from the CDN script
        window.eruda?.init();
      }}
    />
  );
}
