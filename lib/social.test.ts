import { describe, expect, it } from "vitest";
import { buildGoogleMapsLink, buildInstagramLink, buildTikTokLink } from "./social";

describe("buildInstagramLink", () => {
  it("builds a profile link from a plain handle", () => {
    expect(buildInstagramLink("alin.hantaran")).toBe("https://instagram.com/alin.hantaran");
  });

  it("strips a leading @", () => {
    expect(buildInstagramLink("@alin.hantaran")).toBe("https://instagram.com/alin.hantaran");
  });

  it("trims surrounding whitespace", () => {
    expect(buildInstagramLink("  alin.hantaran  ")).toBe("https://instagram.com/alin.hantaran");
  });
});

describe("buildTikTokLink", () => {
  it("builds a profile link prefixed with @", () => {
    expect(buildTikTokLink("alinhantaran")).toBe("https://www.tiktok.com/@alinhantaran");
  });

  it("strips an existing leading @ instead of doubling it", () => {
    expect(buildTikTokLink("@alinhantaran")).toBe("https://www.tiktok.com/@alinhantaran");
  });

  it("removes internal whitespace from a display-name-style value", () => {
    expect(buildTikTokLink("alin hantaran")).toBe("https://www.tiktok.com/@alinhantaran");
  });
});

describe("buildGoogleMapsLink", () => {
  it("builds a maps search URL with the query encoded", () => {
    expect(buildGoogleMapsLink("Morowudi RT 1 RW 3 Cerme Gresik")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Morowudi%20RT%201%20RW%203%20Cerme%20Gresik"
    );
  });

  it("encodes special characters like & and #", () => {
    const link = buildGoogleMapsLink("A & B #12");
    expect(link).toBe("https://www.google.com/maps/search/?api=1&query=A%20%26%20B%20%2312");
  });
});
