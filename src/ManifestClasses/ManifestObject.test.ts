import { describe, expect, it } from "vitest";
import ManifestObject from "@/ManifestClasses/ManifestObject";

describe("ManifestObject", () => {
  it("returns stable unique id code from manifest id", () => {
    const manifest = new ManifestObject("Scene");
    manifest.setId("https://example.org/iiif/manifest/my-manifest-id.json");

    expect(manifest.getUniqueIdCode()).toBe("my-manifest-id");
  });

  it("sets and replaces built-in behavior groups", () => {
    const manifest = new ManifestObject("Scene");

    manifest.setManifestOrderingBehavior("paged");
    manifest.setManifestOrderingBehavior("continuous");

    expect(manifest.getManifestOrderingBehavior()).toBe("continuous");

    manifest.setRepeatBehavior("repeat");
    expect(manifest.getRepeatBehavior()).toBe("repeat");

    manifest.setRepeatBehavior("");
    expect(manifest.getRepeatBehavior()).toBe("");
  });

  it("adds and removes custom behaviors while blocking built-ins and duplicates", () => {
    const manifest = new ManifestObject("Scene");

    expect(manifest.addCustomBehavior("custom:feature")).toBe(true);
    expect(manifest.addCustomBehavior("custom:feature")).toBe(false);
    expect(manifest.addCustomBehavior("paged")).toBe(false);

    expect(manifest.getCustomBehaviors()).toEqual(["custom:feature"]);

    manifest.removeCustomBehavior("custom:feature");

    expect(manifest.getCustomBehaviors()).toEqual([]);
  });

  it("removes empty optional values", () => {
    const manifest = new ManifestObject("Scene");

    manifest.setRights("https://rights.example");
    manifest.setNavDate("2025-03-01T00:00:00Z");

    expect(manifest.getRights()).toBe("https://rights.example");
    expect(manifest.getNavDate()).toBe("2025-03-01T00:00:00Z");

    manifest.setRights("");
    manifest.setNavDate("");

    expect(manifest.getRights()).toBe("");
    expect(manifest.getNavDate()).toBe("");
  });
});
