import Container from './Container.ts';
import Label from './Label.ts';
import {
    builtInManifestBehaviors,
    manifestAutoAdvanceBehaviors,
    manifestOrderingBehaviors,
    manifestRepeatBehaviors,
    type ManifestAutoAdvanceBehavior,
    type ManifestOrderingBehavior,
    type ManifestRepeatBehavior,
    type ManifestViewingDirection,
} from '@/types/iiif';

const manifestOrderingBehaviorSet = new Set<string>(manifestOrderingBehaviors);
const manifestRepeatBehaviorSet = new Set<string>(manifestRepeatBehaviors);
const manifestAutoAdvanceBehaviorSet = new Set<string>(manifestAutoAdvanceBehaviors);
const builtInManifestBehaviorSet = new Set<string>(builtInManifestBehaviors);

class ManifestObject {
    id: string;
    type: string;
    items: Container[];
    label?: Label;
    summary?: Label;
    rights?: string;
    navDate?: string;
    viewingDirection?: ManifestViewingDirection;
    behavior?: string[];

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

    setId(value: string): void {
        this.id = value;
    }

    getId(): string {
        return this.id;
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

    setViewingDirection(value: ManifestViewingDirection | ''): void {
        if (!value) {
            delete this.viewingDirection;
            return;
        }

        this.viewingDirection = value;
    }

    getViewingDirection(): ManifestViewingDirection | '' {
        return this.viewingDirection ?? '';
    }

    setManifestOrderingBehavior(value: ManifestOrderingBehavior | ''): void {
        this.setSingleBehavior(manifestOrderingBehaviorSet, value);
    }

    getManifestOrderingBehavior(): ManifestOrderingBehavior | '' {
        return this.getSingleBehavior<ManifestOrderingBehavior>(manifestOrderingBehaviorSet);
    }

    setRepeatBehavior(value: ManifestRepeatBehavior | ''): void {
        this.setSingleBehavior(manifestRepeatBehaviorSet, value);
    }

    getRepeatBehavior(): ManifestRepeatBehavior | '' {
        return this.getSingleBehavior<ManifestRepeatBehavior>(manifestRepeatBehaviorSet);
    }

    setAutoAdvanceBehavior(value: ManifestAutoAdvanceBehavior | ''): void {
        this.setSingleBehavior(manifestAutoAdvanceBehaviorSet, value);
    }

    getAutoAdvanceBehavior(): ManifestAutoAdvanceBehavior | '' {
        return this.getSingleBehavior<ManifestAutoAdvanceBehavior>(manifestAutoAdvanceBehaviorSet);
    }

    getCustomBehaviors(): string[] {
        return this.behavior?.filter((value) => !builtInManifestBehaviorSet.has(value)) ?? [];
    }

    addCustomBehavior(value: string): boolean {
        const normalizedValue = value.trim();

        if (!normalizedValue || builtInManifestBehaviorSet.has(normalizedValue)) {
            return false;
        }

        const currentBehaviors = this.behavior ?? [];

        if (currentBehaviors.includes(normalizedValue)) {
            return false;
        }

        this.updateBehaviorList([...currentBehaviors, normalizedValue]);
        return true;
    }

    removeCustomBehavior(value: string): void {
        const nextBehaviors =
            this.behavior?.filter((currentValue) => currentValue !== value) ?? [];

        this.updateBehaviorList(nextBehaviors);
    }

    private updateBehaviorList(nextBehaviors: string[]): void {
        if (nextBehaviors.length === 0) {
            delete this.behavior;
            return;
        }

        this.behavior = nextBehaviors;
    }

    private setSingleBehavior(
        behaviorSet: ReadonlySet<string>,
        value: string,
    ): void {
        const nextBehaviors =
            this.behavior?.filter((currentValue) => !behaviorSet.has(currentValue)) ?? [];

        if (value) {
            nextBehaviors.push(value);
        }

        this.updateBehaviorList(nextBehaviors);
    }

    private getSingleBehavior<T extends string>(
        behaviorSet: ReadonlySet<string>,
    ): T | '' {
        const currentValue = this.behavior?.find((value) => behaviorSet.has(value));
        return (currentValue ?? '') as T | '';
    }

    toJSON() {
        const out: {
            id: string;
            type: string;
            label?: Label;
            summary?: Label;
            rights?: string;
            navDate?: string;
            viewingDirection?: ManifestViewingDirection;
            behavior?: string[];
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

        if (this.viewingDirection) {
            out.viewingDirection = this.viewingDirection;
        }

        if (this.behavior?.length) {
            out.behavior = this.behavior;
        }

        return out;
    }
}

export default ManifestObject;
