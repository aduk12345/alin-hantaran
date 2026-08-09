import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, cartOrderMessage } from "./wa";

describe("buildWhatsAppLink", () => {
  it("builds a wa.me link with the default number and encoded message", () => {
    const link = buildWhatsAppLink("Halo, saya mau tanya-tanya");
    expect(link).toBe("https://wa.me/6281330247617?text=Halo%2C%20saya%20mau%20tanya-tanya");
  });

  it("strips non-digit characters and converts a leading 0 to the 62 country code", () => {
    const link = buildWhatsAppLink("Halo", "0813-3024-7617");
    expect(link).toBe("https://wa.me/6281330247617?text=Halo");
  });

  it("percent-encodes special characters in the message", () => {
    const link = buildWhatsAppLink("Pesan & tanya?");
    expect(link).toContain(encodeURIComponent("Pesan & tanya?"));
  });
});

describe("cartOrderMessage", () => {
  it("returns a greeting with no list for an empty cart", () => {
    expect(cartOrderMessage([])).toBe("Halo, saya mau pesan:\n");
  });

  it("lists a single item with a leading dash", () => {
    expect(cartOrderMessage([{ name: "Luxury Pearl — Sewa 5 Box" }])).toBe(
      "Halo, saya mau pesan:\n- Luxury Pearl — Sewa 5 Box"
    );
  });

  it("lists multiple items on separate lines", () => {
    const message = cartOrderMessage([{ name: "Item A" }, { name: "Item B" }]);
    expect(message).toBe("Halo, saya mau pesan:\n- Item A\n- Item B");
  });
});
