import { describe, expect, it } from "vitest";
import { formatIDR, formatPrice } from "./format";

describe("formatIDR", () => {
  it("formats a number using Indonesian thousands separators", () => {
    expect(formatIDR(1000000)).toBe("1.000.000");
  });

  it("formats zero as 0", () => {
    expect(formatIDR(0)).toBe("0");
  });

  it("returns fallback text for null", () => {
    expect(formatIDR(null)).toBe("Hubungi kami");
  });

  it("returns fallback text for undefined", () => {
    expect(formatIDR(undefined)).toBe("Hubungi kami");
  });
});

describe("formatPrice", () => {
  it("prefixes formatted amount with Rp", () => {
    expect(formatPrice(75000)).toBe("Rp75.000");
  });

  it("returns fallback text for null", () => {
    expect(formatPrice(null)).toBe("Hubungi kami");
  });

  it("returns fallback text for undefined", () => {
    expect(formatPrice(undefined)).toBe("Hubungi kami");
  });

  it("formats zero as Rp0, not the fallback", () => {
    expect(formatPrice(0)).toBe("Rp0");
  });
});
