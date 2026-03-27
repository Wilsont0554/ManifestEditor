import Label from './Label.ts';

/**
 * Represents a metadata entry with a label and value, both language-aware.
 * Follows IIIF Presentation API 3.0 specification for metadata.
 */
class MetadataEntry {
    public label: Label;
    public value: Label;

    constructor(labelText: string = '', valueText: string = '', languageCode: string = 'en') {
        this.label = new Label(labelText, languageCode);
        this.value = new Label(valueText, languageCode);
    }

    /**
     * Change the label text
     */
    setLabel(text: string, languageCode: string = 'en'): void {
        this.label.changeLabelTest(text);
        if (languageCode) {
            this.label.setLanguage(languageCode);
        }
    }

    /**
     * Change the value text
     */
    setValue(text: string, languageCode: string = 'en'): void {
        this.value.changeLabelTest(text);
        if (languageCode) {
            this.value.setLanguage(languageCode);
        }
    }

    /**
     * Get the label text (for current language)
     */
    getLabelText(): string {
        return this.label.getValue();
    }

    /**
     * Get the value text (for current language)
     */
    getValueText(): string {
        return this.value.getValue();
    }

    /**
     * Get the label object
     */
    getLabel(): Label {
        return this.label;
    }

    /**
     * Get the value object
     */
    getValue(): Label {
        return this.value;
    }

    /**
     * Serialize to JSON following IIIF spec
     */
    toJSON(): { label: Label; value: Label } {
        return {
            label: this.label,
            value: this.value
        };
    }
}

/**
 * Manages an ordered list of metadata entries.
 * Each entry is a label-value pair.
 */
class Metadata {
    public entries: MetadataEntry[];

    constructor() {
        this.entries = [];
    }

    /**
     * Add a new metadata entry
     */
    addEntry(labelText: string = '', valueText: string = '', languageCode: string = 'en'): MetadataEntry {
        const entry = new MetadataEntry(labelText, valueText, languageCode);
        this.entries.push(entry);
        return entry;
    }

    /**
     * Get a metadata entry by index
     */
    getEntry(index: number): MetadataEntry | null {
        if (index === undefined || index < 0 || index >= this.entries.length) {
            return null;
        }
        return this.entries[index];
    }

    /**
     * Get all metadata entries
     */
    getAllEntries(): MetadataEntry[] {
        return this.entries;
    }

    /**
     * Update an existing metadata entry
     */
    updateEntry(index: number, labelText: string, valueText: string, languageCode: string = 'en'): void {
        if (index >= 0 && index < this.entries.length) {
            this.entries[index].setLabel(labelText, languageCode);
            this.entries[index].setValue(valueText, languageCode);
        }
    }

    /**
     * Remove a metadata entry by index
     */
    removeEntry(index: number): void {
        if (index >= 0 && index < this.entries.length) {
            this.entries.splice(index, 1);
        }
    }

    /**
     * Get the number of metadata entries
     */
    getEntryCount(): number {
        return this.entries.length;
    }

    /**
     * Serialize to JSON following IIIF specification
     * Returns array of {label, value} objects
     */
    toJSON(): { label: Label; value: Label }[] {
        return this.entries.map(entry => entry.toJSON());
    }
}

export default Metadata;
export { MetadataEntry };