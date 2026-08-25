import { describe, expect, it } from "vitest";
import { resolveThumbnailSrc } from "../src/lib/thumbnail";

describe("resolveThumbnailSrc", () => {
  it("keeps absolute paths and urls as-is", () => {
    expect(resolveThumbnailSrc("/cover.png")).toBe("/cover.png");
    expect(resolveThumbnailSrc("https://cdn.example.com/cover.png")).toBe(
      "https://cdn.example.com/cover.png",
    );
  });

  it("normalizes bare filenames to public paths", () => {
    expect(resolveThumbnailSrc("cover.png")).toBe("/cover.png");
  });
});
