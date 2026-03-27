import Label from './Label.js';

/**
 * Represents a metadata entry with a label and value, both language-aware.
 * Follows IIIF Presentation API 3.0 specification for metadata.
 */
class MetadataEntry {
    constructor(labelText = '', valueText = '', languageCode = 'en') {
        this.label = new Label(labelText, languageCode);
        this.value = new Label(valueText, languageCode);
    }

    /**
     * Change the label text
     */
    setLabel(text, languageCode = 'en') {
        this.label.changeLabelTest(text);
        if (languageCode) {
            this.label.setLanguage(languageCode);
        }
    }

    /**
     * Change the value text
     */
    setValue(text, languageCode = 'en') {
        this.value.changeLabelTest(text);
        if (languageCode) {
            this.value.setLanguage(languageCode);
        }
    }

    /**
     * Get the label text (for current language)
     */
    getLabelText() {
        return this.label.getValue ? this.label.getValue() : '';
    }

    /**
     * Get the value text (for current language)
     */
    getValueText() {
        return this.value.getValue ? this.value.getValue() : '';
    }

    /**
     * Serialize to JSON following IIIF spec
     */
    toJSON() {
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
    constructor() {
        this.entries = [];
    }

    /**
     * Add a new metadata entry
     * @param {string} labelText - The label text
     * @param {string} valueText - The value text
     * @param {string} languageCode - Language code (default: 'en')
     */
    addEntry(labelText = '', valueText = '', languageCode = 'en') {
        const entry = new MetadataEntry(labelText, valueText, languageCode);
        this.entries.push(entry);
        return entry;
    }

    /**
     * Get a metadata entry by index
     * @param {number} index - The index of the entry
     * @returns {MetadataEntry} The metadata entry
     */
    getEntry(index) {
        if (index === undefined || index < 0 || index >= this.entries.length) {
            return null;
        }
        return this.entries[index];
    }

    /**
     * Get all metadata entries
     * @returns {Array} Array of MetadataEntry objects
     */
    getAllEntries() {
        return this.entries;
    }

    /**
     * Update an existing metadata entry
     * @param {number} index - The index of the entry to update
     * @param {string} labelText - New label text
     * @param {string} valueText - New value text
     * @param {string} languageCode - Language code
     */
    updateEntry(index, labelText, valueText, languageCode = 'en') {
        if (index >= 0 && index < this.entries.length) {
            this.entries[index].setLabel(labelText, languageCode);
            this.entries[index].setValue(valueText, languageCode);
        }
    }

    /**
     * Remove a metadata entry by index
     * @param {number} index - The index of the entry to remove
     */
    removeEntry(index) {
        if (index >= 0 && index < this.entries.length) {
            this.entries.splice(index, 1);
        }
    }

    /**
     * Get the number of metadata entries
     * @returns {number} Count of entries
     */
    getEntryCount() {
        return this.entries.length;
    }

    /**
     * Serialize to JSON following IIIF specification
     * Returns array of {label, value} objects
     */
    toJSON() {
        return this.entries.map(entry => entry.toJSON());
    }
}

export default Metadata;
export { MetadataEntry };
