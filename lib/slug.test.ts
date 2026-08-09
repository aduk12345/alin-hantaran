import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Luxury Pearl")).toBe("luxury-pearl");
  });

  it("trims leading and trailing whitespace before slugifying", () => {
    expect(slugify("  Classic White  ")).toBe("classic-white");
  });

  it("collapses runs of non-alphanumeric characters into a single hyphen", () => {
    expect(slugify("Box Mika (Beli/Hak Milik)")).toBe("box-mika-beli-hak-milik");
  });

  it("strips leading and trailing hyphens produced by punctuation", () => {
    expect(slugify("--Hello World!!")).toBe("hello-world");
  });

  it("preserves numbers", () => {
    expect(slugify("Sewa 5 Box")).toBe("sewa-5-box");
  });

  it("returns an empty string for input with no alphanumeric characters", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("returns an empty string for an empty input", () => {
    expect(slugify("")).toBe("");
  });
});
