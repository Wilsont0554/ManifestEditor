import { describe, expect, it, vi } from "vitest";
import Label from "@/ManifestClasses/Label";

describe("Label", () => {
  it("normalizes jp language code to ja", () => {
    const label = new Label("Hello", "jp");

    expect(label.getLanguage()).toBe("ja");
    expect(label.getValue()).toBe("Hello");
  });

  it("preserves value while changing language", () => {
    const label = new Label("Bonjour", "fr");

    label.setLanguage("en");

    expect(label.getLanguage()).toBe("en");
    expect(label.getValue()).toBe("Bonjour");
  });

  it("logs and keeps previous language for unsupported codes", () => {
    const label = new Label("Hola", "es");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    label.setLanguage("xx");

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(label.getLanguage()).toBe("es");
    expect(label.getValue()).toBe("Hola");

    consoleErrorSpy.mockRestore();
  });

  it("defaults to English when no language code given", () => {
    const label = new Label("Default");

    expect(label.getLanguage()).toBe("en");
    expect(label.getValue()).toBe("Default");
  });

  it("returns empty string for getValue on an empty label", () => {
    const label = new Label("", "en");

    expect(label.getValue()).toBe("");
  });

  it("hasValue returns false for empty, true for non-empty", () => {
    const empty = new Label("", "en");
    const filled = new Label("Something", "en");

    expect(empty.hasValue()).toBe(false);
    expect(filled.hasValue()).toBe(true);
  });

  it("clone produces an independent copy", () => {
    const original = new Label("Clone me", "fr");
    const cloned = original.clone();

    expect(cloned.getValue()).toBe("Clone me");
    expect(cloned.getLanguage()).toBe("fr");

    original.changeLabelTest("Changed original");
    expect(cloned.getValue()).toBe("Clone me");
  });

  it("changeLabelTest updates the stored value", () => {
    const label = new Label("Before", "en");
    label.changeLabelTest("After");

    expect(label.getValue()).toBe("After");
  });

  it("getSupportedLanguages includes common languages", () => {
    const label = new Label("", "en");
    const supported = label.getSupportedLanguages();

    expect(supported).toContain("en");
    expect(supported).toContain("es");
    expect(supported).toContain("fr");
    expect(supported).toContain("ja");
  });
});
