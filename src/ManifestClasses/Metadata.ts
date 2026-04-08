import Label from "./Label.ts";
import type { IiifMetadataItem } from "@/types/iiif";

class MetadataEntry {
    label: Label;
    value: Label;

    constructor(
        labelText: string = "",
        valueText: string = "",
        languageCode: string = "en",
    ) {
        this.label = new Label(labelText, languageCode);
        this.value = new Label(valueText, languageCode);
    }

    setLabel(text: string, languageCode?: string): void {
        this.label.changeLabelTest(text);

        if (languageCode) {
            this.label.setLanguage(languageCode);
        }
    }

    setValue(text: string, languageCode?: string): void {
        this.value.changeLabelTest(text);

        if (languageCode) {
            this.value.setLanguage(languageCode);
        }
    }

    setLanguage(languageCode: string): void {
        this.label.setLanguage(languageCode);
        this.value.setLanguage(languageCode);
    }

    getLabelText(): string {
        return this.label.getValue();
    }

    getValueText(): string {
        return this.value.getValue();
    }

    getLabelLanguage(): string {
        return this.label.getLanguage() ?? "en";
    }

    getValueLanguage(): string {
        return this.value.getLanguage() ?? "en";
    }

    clone(): MetadataEntry {
        const nextEntry = new MetadataEntry();

        nextEntry.label = this.label.clone();
        nextEntry.value = this.value.clone();

        return nextEntry;
    }

    toJSON(): IiifMetadataItem {
        return {
            label: this.label.toJSON(),
            value: this.value.toJSON(),
        };
    }
}

class Metadata {
    private entries: MetadataEntry[];

    constructor() {
        this.entries = [];
    }

    addEntry(
        labelText: string = "",
        valueText: string = "",
        languageCode: string = "en",
    ): MetadataEntry {
        const entry = new MetadataEntry(labelText, valueText, languageCode);
        this.entries.push(entry);
        return entry;
    }

    getEntry(index?: number): MetadataEntry | null {
        if (index === undefined || index < 0 || index >= this.entries.length) {
            return null;
        }

        return this.entries[index];
    }

    getAllEntries(): MetadataEntry[] {
        return this.entries;
    }

    updateEntry(
        index: number,
        labelText: string,
        valueText: string,
        languageCode?: string,
    ): void {
        if (index >= 0 && index < this.entries.length) {
            this.entries[index].setLabel(labelText, languageCode);
            this.entries[index].setValue(valueText, languageCode);
        }
    }

    removeEntry(index: number): void {
        if (index >= 0 && index < this.entries.length) {
            this.entries.splice(index, 1);
        }
    }

    getEntryCount(): number {
        return this.entries.length;
    }

    clone(): Metadata {
        const nextMetadata = new Metadata();

        nextMetadata.entries = this.entries.map((entry) => entry.clone());

        return nextMetadata;
    }

    toJSON(): IiifMetadataItem[] {
        return this.entries.map((entry) => entry.toJSON());
    }
}

export default Metadata;
export { MetadataEntry };
