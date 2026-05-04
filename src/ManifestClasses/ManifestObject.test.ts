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

  it("sets and retrieves label value and language", () => {
    const manifest = new ManifestObject("Scene");

    manifest.setLabel("My Manifest");
    expect(manifest.getLabelValue()).toBe("My Manifest");

    manifest.setLabelLanguage("fr");
    expect(manifest.getLabelLanguage()).toBe("fr");
  });

  it("sets and retrieves summary value", () => {
    const manifest = new ManifestObject("Scene");

    manifest.setSummary("A short description");
    expect(manifest.getSummaryValue()).toBe("A short description");
  });

  it("sets and retrieves viewing direction", () => {
    const manifest = new ManifestObject("Scene");

    manifest.setViewingDirection("left-to-right");
    expect(manifest.getViewingDirection()).toBe("left-to-right");

    manifest.setViewingDirection("");
    expect(manifest.getViewingDirection()).toBe("");
  });

  it("clone produces an independent copy", () => {
    const manifest = new ManifestObject("Scene");
    manifest.setLabel("Original");
    manifest.setRights("https://rights.example");

    const cloned = manifest.clone();

    expect(cloned.getLabelValue()).toBe("Original");
    expect(cloned.getRights()).toBe("https://rights.example");

    manifest.setLabel("Changed");
    expect(cloned.getLabelValue()).toBe("Original");
  });

  it("getId returns the manifest id", () => {
    const manifest = new ManifestObject("Scene");
    manifest.setId("https://example.org/iiif/my-id");

    expect(manifest.getId()).toBe("https://example.org/iiif/my-id");
  });

  it("auto-advance behavior is stored and cleared", () => {
    const manifest = new ManifestObject("Scene");

    manifest.setAutoAdvanceBehavior("auto-advance");
    expect(manifest.getAutoAdvanceBehavior()).toBe("auto-advance");

    manifest.setAutoAdvanceBehavior("");
    expect(manifest.getAutoAdvanceBehavior()).toBe("");
  });
});
