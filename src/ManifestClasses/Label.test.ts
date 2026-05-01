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
});
