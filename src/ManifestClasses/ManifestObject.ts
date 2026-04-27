import Container from './Container.ts';
import Label from './Label.ts';
import Camera from "./Camera.ts";
import Light from "./Light.ts";
import {
    builtInManifestBehaviors,
    manifestAutoAdvanceBehaviors,
    manifestOrderingBehaviors,
    manifestRepeatBehaviors,
    type IiifContainerType,
    type ManifestAutoAdvanceBehavior,
    type ManifestOrderingBehavior,
    type ManifestRepeatBehavior,
    type ManifestViewingDirection,
} from '@/types/iiif';

const manifestOrderingBehaviorSet = new Set<string>(manifestOrderingBehaviors);
const manifestRepeatBehaviorSet = new Set<string>(manifestRepeatBehaviors);
const manifestAutoAdvanceBehaviorSet = new Set<string>(manifestAutoAdvanceBehaviors);
const builtInManifestBehaviorSet = new Set<string>(builtInManifestBehaviors);
const defaultManifestId = "https://example.org/iiif/manifest/1";
const defaultManifestLabel = "Blank Manifest";

function trimTrailingSlash(value: string): string {
    return value.replace(/\/+$/, '');
}

function getEffectiveManifestId(value: string): string {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : defaultManifestId;
}

function getManifestBaseId(value: string): string {
    return trimTrailingSlash(getEffectiveManifestId(value).replace(/\.json$/i, ''));
}

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
        this.id = defaultManifestId;
        this.type = "Manifest";
        this.items = [];
        this.label = new Label(defaultManifestLabel, "en");
        this.addContainer(new Container(undefined, containerType));
    }

    clone(): ManifestObject {
        const nextManifestObj = new ManifestObject(this.getContainerObj().getType());

        nextManifestObj.id = this.id;
        nextManifestObj.type = this.type;
        nextManifestObj.items = this.items.map((item) => item.clone());
        nextManifestObj.label = this.label?.clone();
        nextManifestObj.summary = this.summary?.clone();
        nextManifestObj.rights = this.rights;
        nextManifestObj.navDate = this.navDate;
        nextManifestObj.viewingDirection = this.viewingDirection;
        nextManifestObj.behavior = this.behavior ? [...this.behavior] : undefined;

        return nextManifestObj;
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

    setAllValues(newManifest: ManifestObject): void{
        try{
            this.id = newManifest.id;
            this.type = newManifest.type;
            this.rights = newManifest.rights;
            this.navDate = newManifest.navDate;
            this.behavior = newManifest.behavior;

            if (newManifest.label != undefined){
                const labelCodeArray = Object.keys(newManifest.label);
                const labelCode = labelCodeArray[0] as keyof Label;
                const labelValues = newManifest.label[labelCode];
                const labelValue = labelValues?.[0] as unknown as string | undefined;

                if (labelValue != undefined) {
                    this.setLabel(labelValue);
                    this.label!.setLanguage(labelCode);
                }
            }

            if (newManifest.summary != undefined){
                const summaryCodeArray = Object.keys(newManifest.summary);
                const summaryCode = summaryCodeArray[0] as keyof Label;
                const summaryValues = newManifest.summary[summaryCode];
                const summaryValue = summaryValues?.[0] as unknown as string | undefined;

                if (summaryValue != undefined) {
                    this.setSummary(summaryValue);
                    this.summary!.setLanguage(summaryCode);
                }
            }
        }catch(e){
            console.log(e);
        }
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

    private getSerializableLabel(): Label {
        if (this.label?.hasValue()) {
            return this.label;
        }

        return new Label(defaultManifestLabel, "en");
    }
}

export default ManifestObject;
