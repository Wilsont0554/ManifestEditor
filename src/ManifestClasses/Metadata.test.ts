import { describe, expect, it } from "vitest";
import Metadata, { MetadataEntry } from "@/ManifestClasses/Metadata";

describe("MetadataEntry", () => {
  it("stores label and value text on construction", () => {
    const entry = new MetadataEntry("Creator", "Alice", "en");

    expect(entry.getLabelText()).toBe("Creator");
    expect(entry.getValueText()).toBe("Alice");
  });

  it("defaults to empty strings and English when no args given", () => {
    const entry = new MetadataEntry();

    expect(entry.getLabelText()).toBe("");
    expect(entry.getValueText()).toBe("");
    expect(entry.getLabelLanguage()).toBe("en");
  });

  it("setLabel updates label text", () => {
    const entry = new MetadataEntry("Old Label", "value");
    entry.setLabel("New Label");

    expect(entry.getLabelText()).toBe("New Label");
  });

  it("setValue updates value text", () => {
    const entry = new MetadataEntry("label", "Old Value");
    entry.setValue("New Value");

    expect(entry.getValueText()).toBe("New Value");
  });

  it("setLanguage changes both label and value language", () => {
    const entry = new MetadataEntry("Title", "Content", "en");
    entry.setLanguage("fr");

    expect(entry.getLabelLanguage()).toBe("fr");
    expect(entry.getValueLanguage()).toBe("fr");
  });

  it("clone produces an independent copy", () => {
    const entry = new MetadataEntry("Key", "Val", "en");
    const cloned = entry.clone();

    expect(cloned.getLabelText()).toBe("Key");
    expect(cloned.getValueText()).toBe("Val");

    entry.setLabel("Changed");
    expect(cloned.getLabelText()).toBe("Key");
  });

  it("toJSON returns the IIIF metadata shape", () => {
    const entry = new MetadataEntry("Date", "2024", "en");
    const json = entry.toJSON();

    expect(json).toHaveProperty("label");
    expect(json).toHaveProperty("value");
  });
});

describe("Metadata", () => {
  it("starts empty", () => {
    const metadata = new Metadata();

    expect(metadata.getEntryCount()).toBe(0);
    expect(metadata.getAllEntries()).toHaveLength(0);
  });

  it("addEntry increases count", () => {
    const metadata = new Metadata();
    metadata.addEntry("Creator", "Bob");
    metadata.addEntry("Date", "2024");

    expect(metadata.getEntryCount()).toBe(2);
    expect(metadata.length).toBe(2);
  });

  it("updateEntry changes existing entry text", () => {
    const metadata = new Metadata();
    metadata.addEntry("Creator", "Bob");
    metadata.updateEntry(0, "Author", "Alice");

    expect(metadata.getAllEntries()[0].getLabelText()).toBe("Author");
    expect(metadata.getAllEntries()[0].getValueText()).toBe("Alice");
  });

  it("updateEntry does nothing for out-of-bounds index", () => {
    const metadata = new Metadata();
    metadata.addEntry("Creator", "Bob");

    metadata.updateEntry(99, "Label", "Value");

    expect(metadata.getAllEntries()[0].getLabelText()).toBe("Creator");
  });

  it("removeEntry removes the entry at the given index", () => {
    const metadata = new Metadata();
    metadata.addEntry("First", "1");
    metadata.addEntry("Second", "2");

    metadata.removeEntry(0);

    expect(metadata.getEntryCount()).toBe(1);
    expect(metadata.getAllEntries()[0].getLabelText()).toBe("Second");
  });

  it("removeEntry does nothing for out-of-bounds index", () => {
    const metadata = new Metadata();
    metadata.addEntry("Only", "entry");

    metadata.removeEntry(-1);
    metadata.removeEntry(99);

    expect(metadata.getEntryCount()).toBe(1);
  });

  it("clone produces an independent copy", () => {
    const metadata = new Metadata();
    metadata.addEntry("Key", "Val");

    const cloned = metadata.clone();
    expect(cloned.getEntryCount()).toBe(1);

    metadata.addEntry("Extra", "entry");
    expect(cloned.getEntryCount()).toBe(1);
  });

  it("toJSON returns an array of IIIF metadata items", () => {
    const metadata = new Metadata();
    metadata.addEntry("Title", "My Work");

    const json = metadata.toJSON();
    expect(Array.isArray(json)).toBe(true);
    expect(json).toHaveLength(1);
    expect(json[0]).toHaveProperty("label");
    expect(json[0]).toHaveProperty("value");
  });
});
