import { describe, expect, it } from "vitest";
import Container from "@/ManifestClasses/Container";

describe("Container constructor", () => {
  it("defaults to Scene type", () => {
    const container = new Container();
    expect(container.getType()).toBe("Scene");
  });

  it("normalizes 'canvas' to 'Canvas'", () => {
    const container = new Container(undefined, "canvas");
    expect(container.getType()).toBe("Canvas");
  });

  it("normalizes 'timeline' to 'Timeline'", () => {
    const container = new Container(undefined, "timeline");
    expect(container.getType()).toBe("Timeline");
  });

  it("initializes with one empty AnnotationPage", () => {
    const container = new Container();
    expect(container.getItems()).toHaveLength(1);
  });
});

describe("Container.setType", () => {
  it("switching to Canvas adds dimensions and removes duration", () => {
    const container = new Container(undefined, "Timeline");
    container.setDuration(30);

    container.setType("Canvas");

    expect(container.getType()).toBe("Canvas");
    const [height, width] = container.getDimensions();
    expect(height).toBe(0);
    expect(width).toBe(0);
    expect(container.getDuration()).toBeUndefined();
  });

  it("switching to Timeline adds duration and removes dimensions", () => {
    const container = new Container(undefined, "Canvas");
    container.setDimensions(100, 200);

    container.setType("Timeline");

    expect(container.getType()).toBe("Timeline");
    expect(container.getDuration()).toBe(0);
    const [height, width] = container.getDimensions();
    expect(height).toBeUndefined();
    expect(width).toBeUndefined();
  });

  it("switching to Scene removes both dimensions and duration", () => {
    const container = new Container(undefined, "Canvas");
    container.setDimensions(640, 480);

    container.setType("Scene");

    expect(container.getType()).toBe("Scene");
    expect(container.getDuration()).toBeUndefined();
    const [height, width] = container.getDimensions();
    expect(height).toBeUndefined();
    expect(width).toBeUndefined();
  });
});

describe("Container dimensions and duration", () => {
  it("setDimensions stores height and width", () => {
    const container = new Container();
    container.setDimensions(720, 1280);

    expect(container.getDimensions()).toEqual([720, 1280]);
  });

  it("setDuration stores duration", () => {
    const container = new Container();
    container.setDuration(60);

    expect(container.getDuration()).toBe(60);
  });

  it("deleteDimensions removes height and width", () => {
    const container = new Container();
    container.setDimensions(100, 200);
    container.deleteDimensions();

    const [height, width] = container.getDimensions();
    expect(height).toBeUndefined();
    expect(width).toBeUndefined();
  });

  it("deleteDuration removes duration", () => {
    const container = new Container();
    container.setDuration(45);
    container.deleteDuration();

    expect(container.getDuration()).toBeUndefined();
  });
});

describe("Container.setID and getID", () => {
  it("stores and returns a custom id", () => {
    const container = new Container();
    container.setID("https://example.org/iiif/my-scene");

    expect(container.getID()).toBe("https://example.org/iiif/my-scene");
  });
});

describe("Container.clone", () => {
  it("produces an independent copy", () => {
    const container = new Container("https://example.org/original", "Canvas");
    container.setDimensions(100, 200);

    const cloned = container.clone();

    expect(cloned.getID()).toBe("https://example.org/original");
    expect(cloned.getDimensions()).toEqual([100, 200]);

    container.setDimensions(999, 999);
    expect(cloned.getDimensions()).toEqual([100, 200]);
  });
});
