import { describe, expect, it } from "vitest";
import Annotation from "@/ManifestClasses/Annotation";
import ContentResource from "@/ManifestClasses/ContentResource";

describe("Annotation constructor", () => {
  it("defaults to type Annotation and painting motivation", () => {
    const annotation = new Annotation();

    expect(annotation.type).toBe("Annotation");
    expect(annotation.getMotivation()).toContain("painting");
  });

  it("accepts a custom motivation", () => {
    const annotation = new Annotation(1, ["commenting"]);

    expect(annotation.getMotivation()).toContain("commenting");
    expect(annotation.getMotivation()).not.toContain("painting");
  });

  it("assigns a default id based on index", () => {
    const annotation = new Annotation(3);

    expect(annotation.id).toContain("3");
  });
});

describe("Annotation content resource", () => {
  it("setContentResource stores and getContentResource retrieves it", () => {
    const annotation = new Annotation();
    const resource = new ContentResource("https://example.org/image.jpg", "Image", "image/jpeg");

    annotation.setContentResource(resource);

    expect(annotation.getContentResource()).toBe(resource);
  });

  it("getContentResource returns undefined before any resource is set", () => {
    const annotation = new Annotation();

    expect(annotation.getContentResource()).toBeUndefined();
  });

  it("removeContentResource clears the body", () => {
    const annotation = new Annotation();
    const resource = new ContentResource("https://example.org/model.glb", "Model", "model/gltf-binary");

    annotation.setContentResource(resource);
    annotation.removeContentResource();

    expect(annotation.getContentResource()).toBeUndefined();
  });
});

describe("Annotation coordinates via target", () => {
  it("setX updates x on the target selector", () => {
    const annotation = new Annotation();
    annotation.setX(3.14);

    expect(annotation.getTarget()!.getX()).toBe(3.14);
  });

  it("setY updates y on the target selector", () => {
    const annotation = new Annotation();
    annotation.setY(2.71);

    expect(annotation.getTarget()!.getY()).toBe(2.71);
  });

  it("setZ updates z on the target selector", () => {
    const annotation = new Annotation();
    annotation.setZ(1.0);

    expect(annotation.getTarget()!.getZ()).toBe(1.0);
  });
});
