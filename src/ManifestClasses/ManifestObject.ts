import Container from './Container.ts';
import Label from './Label.ts';

class ManifestObject {
    id: string;
    type: string;
    items: Container[];
    label?: Label;
    summary?: Label;
    rights?: string;
    navDate?: string;

    constructor(containerType: string) {
        this.id = "https://example.org/to13swr5ws-mlwptp83";
        this.type = "Manifest";
        this.items = [];
        this.label = new Label("Blank Manifest", "en");
        this.addContainer(new Container(this.id, containerType));
    }

    clone(): ManifestObject {
        return Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            this
        ) as ManifestObject;
    }
    
    addContainer(container: Container): void {
        this.items.push(container);
    }

    getContainerObj(index?: number): Container {
        if (index === undefined) {
            index = 0;
        }
        return this.items[index];
    }

    setLabel(value: string): void {
        if (!this.label) {
            this.label = new Label('', 'en');
        }
        this.label.changeLabelTest(value);
    }

    setLabelLanguage(languageCode: string): void {
        if (!this.label) {
            this.label = new Label('', languageCode);
            return;
        }

        this.label.setLanguage(languageCode);
    }

    getLabelValue(): string {
        return this.label?.getValue() ?? '';
    }

    getLabelLanguage(): string {
        return this.label?.getLanguage() ?? 'en';
    }

    setSummary(value: string): void {
        if (!this.summary) {
            this.summary = new Label('', 'en');
        }
        this.summary.changeLabelTest(value);
    }

    setSummaryLanguage(languageCode: string): void {
        if (!this.summary) {
            this.summary = new Label('', languageCode);
            return;
        }

        this.summary.setLanguage(languageCode);
    }

    getSummaryValue(): string {
        return this.summary?.getValue() ?? '';
    }

    getSummaryLanguage(): string {
        return this.summary?.getLanguage() ?? 'en';
    }

    setRights(value: string): void {
        this.rights = value;

        if (!value) {
            delete this.rights;
        }
    }

    getRights(): string {
        return this.rights ?? '';
    }

    setNavDate(value: string): void {
        this.navDate = value;

        if (!value) {
            delete this.navDate;
        }
    }

    getNavDate(): string {
        return this.navDate ?? '';
    }

    toJSON() {
        const out: {
            id: string;
            type: string;
            label?: Label;
            summary?: Label;
            rights?: string;
            navDate?: string;
            items: Container[];
        } = {
            id: this.id,
            type: this.type,
            items: this.items,
        };

        if (this.label?.hasValue()) {
            out.label = this.label;
        }

        if (this.summary?.hasValue()) {
            out.summary = this.summary;
        }

        if (this.rights) {
            out.rights = this.rights;
        }

        if (this.navDate) {
            out.navDate = this.navDate;
        }

        return out;
    }
}

export default ManifestObject;
