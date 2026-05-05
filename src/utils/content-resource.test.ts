import { describe, expect, it } from "vitest";
import {
  clampNumber,
  contentResourceTypeToFormat,
  lightContentResourceTypes,
  cameraContentResourceTypes,
} from "@/utils/content-resource";

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

  it("returns value exactly equal to min", () => {
    expect(clampNumber(0, 0, 10)).toBe(0);
  });

  it("returns value exactly equal to max", () => {
    expect(clampNumber(10, 0, 10)).toBe(10);
  });

  it("works with negative bounds", () => {
    expect(clampNumber(-15, -10, -5)).toBe(-10);
    expect(clampNumber(-3, -10, -5)).toBe(-5);
    expect(clampNumber(-7, -10, -5)).toBe(-7);
  });

  it("returns value unchanged when no bounds provided", () => {
    expect(clampNumber(999)).toBe(999);
    expect(clampNumber(-999)).toBe(-999);
  });
});

describe("contentResourceTypeToFormat", () => {
  it("contains supported IIIF media formats", () => {
    expect(contentResourceTypeToFormat.Image).toBe("image/jpeg");
    expect(contentResourceTypeToFormat.Model).toBe("model/gltf-binary");
  });
});

describe("lightContentResourceTypes", () => {
  it("contains all four light types", () => {
    expect(lightContentResourceTypes.AmbientLight).toBe("Ambient Light");
    expect(lightContentResourceTypes.DirectionalLight).toBe("Directional Light");
    expect(lightContentResourceTypes.PointLight).toBe("Point Light");
    expect(lightContentResourceTypes.SpotLight).toBe("Spot Light");
  });

  it("has exactly four entries", () => {
    expect(Object.keys(lightContentResourceTypes)).toHaveLength(4);
  });
});

describe("cameraContentResourceTypes", () => {
  it("contains both camera types", () => {
    expect(cameraContentResourceTypes.OrthographicCamera).toBe("Orthographic Camera");
    expect(cameraContentResourceTypes.PerspectiveCamera).toBe("Perspective Camera");
  });

  it("has exactly two entries", () => {
    expect(Object.keys(cameraContentResourceTypes)).toHaveLength(2);
  });
});
