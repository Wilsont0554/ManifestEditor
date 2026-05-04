import { describe, expect, it } from "vitest";
import Target from "@/ManifestClasses/Target";

describe("Target constructor defaults", () => {
  it("defaults coordinates to (0, 0, 0)", () => {
    const target = new Target();

    expect(target.getX()).toBe(0);
    expect(target.getY()).toBe(0);
    expect(target.getZ()).toBe(0);
    expect(target.getCoordinates()).toEqual([0, 0, 0]);
  });

  it("has type SpecificResource", () => {
    const target = new Target();

    expect(target.type).toBe("SpecificResource");
  });

  it("source defaults to Scene type", () => {
    const target = new Target();
    const source = target.getSource();

    expect(source[0].type).toBe("Scene");
  });
});

describe("Target coordinate setters", () => {
  it("setX updates x coordinate", () => {
    const target = new Target();
    target.setX(1.5);

    expect(target.getX()).toBe(1.5);
  });

  it("setY updates y coordinate", () => {
    const target = new Target();
    target.setY(2.5);

    expect(target.getY()).toBe(2.5);
  });

  it("setZ updates z coordinate", () => {
    const target = new Target();
    target.setZ(3.5);

    expect(target.getZ()).toBe(3.5);
  });

  it("getCoordinates returns [x, y, z] together", () => {
    const target = new Target();
    target.setX(1);
    target.setY(2);
    target.setZ(3);

    expect(target.getCoordinates()).toEqual([1, 2, 3]);
  });
});

describe("Target source", () => {
  it("setSource updates id and type", () => {
    const target = new Target();
    target.setSource("https://example.org/canvas/1", "Canvas");

    const source = target.getSource();
    expect(source[0].id).toBe("https://example.org/canvas/1");
    expect(source[0].type).toBe("Canvas");
  });
});

describe("Target.clone", () => {
  it("produces an independent copy", () => {
    const target = new Target();
    target.setX(5);
    target.setY(10);
    target.setZ(15);

    const cloned = target.clone();

    expect(cloned.getCoordinates()).toEqual([5, 10, 15]);

    target.setX(99);
    expect(cloned.getX()).toBe(5);
  });
});
