import { describe, expect, it } from "vitest";
import { clampNumber, contentResourceTypeToFormat } from "@/utils/content-resource";

describe("clampNumber", () => {
  it("returns value unchanged when it is inside bounds", () => {
    expect(clampNumber(5, 1, 10)).toBe(5);
  });

  it("clamps to min when value is below min", () => {
    expect(clampNumber(-3, 0, 10)).toBe(0);
  });

  it("clamps to max when value is above max", () => {
    expect(clampNumber(11, 0, 10)).toBe(10);
  });

  it("supports one-sided bounds", () => {
    expect(clampNumber(2, 5)).toBe(5);
    expect(clampNumber(9, undefined, 6)).toBe(6);
  });
});

describe("contentResourceTypeToFormat", () => {
  it("contains supported IIIF media formats", () => {
    expect(contentResourceTypeToFormat.Image).toBe("image/jpeg");
    expect(contentResourceTypeToFormat.Model).toBe("model/gltf-binary");
  });
});
