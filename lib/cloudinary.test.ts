import { describe, expect, it } from "vitest";
import { extractPublicId } from "./cloudinary";

describe("extractPublicId", () => {
  it("extracts the public id from a versioned Cloudinary URL", () => {
    const url =
      "https://res.cloudinary.com/vb3jylbu/image/upload/v1786113943/hantaran-katalog/categories/box-mika/1.jpg";
    expect(extractPublicId(url)).toBe("hantaran-katalog/categories/box-mika/1");
  });

  it("extracts the public id from a URL without a version segment", () => {
    const url = "https://res.cloudinary.com/vb3jylbu/image/upload/hantaran-katalog/guide/return-box.jpg";
    expect(extractPublicId(url)).toBe("hantaran-katalog/guide/return-box");
  });

  it("returns null for a URL missing the /upload/ segment", () => {
    expect(extractPublicId("https://example.com/foo/bar.jpg")).toBeNull();
  });

  it("returns null for a URL with no file extension", () => {
    expect(extractPublicId("https://res.cloudinary.com/x/image/upload/v1/foo/bar")).toBeNull();
  });
});
