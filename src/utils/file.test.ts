import { describe, expect, it } from "vitest";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import ContentResource from "@/ManifestClasses/ContentResource";
import Annotation from "@/ManifestClasses/Annotation";
import { isVoyagerRenderableManifest, serializeManifestForExport } from "@/utils/file";

type SerializedManifest = {
  id?: string;
  type?: string;
  items?: Array<{
    items?: Array<{
      items?: Array<{ body?: { type?: string; source?: Array<{ type?: string }> } }>;
    }>;
  }>;
};

describe("serializeManifestForExport", () => {
  it("returns a plain serializable object", () => {
    const manifest = new ManifestObject("Scene");

    const result = serializeManifestForExport(manifest);

    expect(typeof result).toBe("object");
    expect(result).not.toBeInstanceOf(ManifestObject);
    expect(JSON.stringify(result)).toBeTruthy();
  });

  it("preserves manifest id and type", () => {
    const manifest = new ManifestObject("Scene");
    manifest.setId("https://example.org/iiif/manifest/test");

    const result = serializeManifestForExport(manifest) as SerializedManifest;

    expect(result.id).toBe("https://example.org/iiif/manifest/test");
    expect(result.type).toBe("Manifest");
  });

  it("wraps Model body in SpecificResource with source array", () => {
    const manifest = new ManifestObject("Scene");
    const annotation = new Annotation(1);
    const model = new ContentResource(
      "https://example.org/model.glb",
      "Model",
      "model/gltf-binary",
    );
    annotation.setContentResource(model);

    manifest
      .getContainerObj()
      .getAnnotationPage()
      .addAnnotation(annotation);

    const result = serializeManifestForExport(manifest) as SerializedManifest;
    const body =
      result.items?.[0]?.items?.[0]?.items?.[
        (result.items?.[0]?.items?.[0]?.items?.length ?? 1) - 1
      ]?.body;

    expect(body?.type).toBe("SpecificResource");
    expect(Array.isArray(body?.source)).toBe(true);
    expect(body?.source?.[0]?.type).toBe("Model");
  });

  it("does not wrap non-Model bodies in SpecificResource", () => {
    const manifest = new ManifestObject("Scene");
    const annotation = new Annotation(1);
    const image = new ContentResource(
      "https://example.org/image.jpg",
      "Image",
      "image/jpeg",
    );
    annotation.setContentResource(image);

    manifest
      .getContainerObj()
      .getAnnotationPage()
      .addAnnotation(annotation);

    const result = serializeManifestForExport(manifest) as SerializedManifest;
    const body =
      result.items?.[0]?.items?.[0]?.items?.[
        (result.items?.[0]?.items?.[0]?.items?.length ?? 1) - 1
      ]?.body;

    expect(body?.type).toBe("Image");
  });

  it("treats manifests with empty image resource ids as not renderable in Voyager", () => {
    const manifest = new ManifestObject("Scene");
    const annotation = new Annotation(1);
    const image = new ContentResource("", "Image", "image/jpeg");
    annotation.setContentResource(image);

    manifest
      .getContainerObj()
      .getAnnotationPage()
      .addAnnotation(annotation);

    const result = serializeManifestForExport(manifest);

    expect(isVoyagerRenderableManifest(result)).toBe(false);
  });

  it("treats manifests with valid asset ids as renderable in Voyager", () => {
    const manifest = new ManifestObject("Scene");
    const annotation = new Annotation(1);
    const image = new ContentResource(
      "https://example.org/image.jpg",
      "Image",
      "image/jpeg",
    );
    annotation.setContentResource(image);

    manifest
      .getContainerObj()
      .getAnnotationPage()
      .addAnnotation(annotation);

    const result = serializeManifestForExport(manifest);

    expect(isVoyagerRenderableManifest(result)).toBe(true);
  });
});
