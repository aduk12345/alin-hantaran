"use client";

import { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { CartWidget } from "./CartWidget";

export function CartRoot({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartWidget />
    </CartProvider>
  );
}
