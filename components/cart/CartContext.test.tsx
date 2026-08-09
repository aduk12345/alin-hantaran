import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartItem, CartProvider, useCart } from "./CartContext";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

const itemA: CartItem = { id: "a", kind: "product", name: "Item A", price: 10000, image: "a.jpg" };
const itemB: CartItem = { id: "b", kind: "category", name: "Item B", price: null, image: "b.jpg" };

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useCart", () => {
  it("throws when used outside a CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within CartProvider"
    );
  });

  it("starts empty", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));
  });

  it("addItem appends a new item", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.addItem(itemA));

    expect(result.current.items).toEqual([itemA]);
  });

  it("addItem is a no-op when the id is already present", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.addItem(itemA));
    act(() => result.current.addItem({ ...itemA, name: "Renamed" }));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("Item A");
  });

  it("removeItem filters out the matching id", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.addItem(itemA));
    act(() => result.current.addItem(itemB));
    act(() => result.current.removeItem(itemA.id));

    expect(result.current.items).toEqual([itemB]);
  });

  it("toggleItem adds the item when absent", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.toggleItem(itemA));

    expect(result.current.items).toEqual([itemA]);
  });

  it("toggleItem removes the item when present", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.toggleItem(itemA));
    act(() => result.current.toggleItem(itemA));

    expect(result.current.items).toEqual([]);
  });

  it("isInCart reflects current membership", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    expect(result.current.isInCart(itemA.id)).toBe(false);
    act(() => result.current.addItem(itemA));
    expect(result.current.isInCart(itemA.id)).toBe(true);
  });

  it("clear empties the cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.addItem(itemA));
    act(() => result.current.addItem(itemB));
    act(() => result.current.clear());

    expect(result.current.items).toEqual([]);
  });

  it("persists items to localStorage after hydration", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => result.current.addItem(itemA));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("hantaran-cart") ?? "[]")).toEqual([itemA]);
    });
  });

  it("hydrates initial items from localStorage", async () => {
    localStorage.setItem("hantaran-cart", JSON.stringify([itemA]));

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.items).toEqual([itemA]));
  });

  it("falls back to an empty cart when localStorage contains corrupt JSON", async () => {
    localStorage.setItem("hantaran-cart", "{not valid json");

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.items).toEqual([]));
  });
});
