import Container from './Container.ts';
import Label from './Label.ts';
import Camera from "./Camera.ts";
import Light from "./Light.ts";
import {
    builtInManifestBehaviors,
    IiifManifest,
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
const presentationContext = "http://iiif.io/api/presentation/4/context.json";

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
        this.synchronizeStructure();
    }

    clone(): ManifestObject {
        this.synchronizeStructure();

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
        this.synchronizeStructure();
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
            this.behavior = newManifest.behavior ? [...newManifest.behavior] : undefined;

            if (newManifest.label != undefined){
                this.setLabel(newManifest.label.getValue());
                this.setLabelLanguage(newManifest.label.getLanguage() ?? 'en');
            }

            if (newManifest.summary != undefined){
                this.setSummary(newManifest.summary.getValue());
                this.setSummaryLanguage(newManifest.summary.getLanguage() ?? 'en');
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

    private synchronizeStructure(): void {
        const manifestBaseId = getManifestBaseId(this.id);

        this.items.forEach((container, containerIndex) => {
            const containerId = `${manifestBaseId}/${container.getType().toLowerCase()}/${containerIndex + 1}`;
            container.setID(containerId);

            container.getItems().forEach((annotationPage, annotationPageIndex) => {
                annotationPage.setID(`${containerId}/page/${annotationPageIndex + 1}`);

                let lightIndex = 0;
                let cameraIndex = 0;

                annotationPage.getAllAnnotations().forEach((annotation, annotationIndex) => {
                    const annotationId = `${containerId}/anno/${annotationIndex + 1}`;
                    annotation.changeID(annotationId);

                    const resource = annotation.getContentResource();
                    const targetId = `${annotationId}/target`;

                    if (resource instanceof Light) {
                        lightIndex += 1;
                        resource.setID(`${containerId}/lights/${lightIndex}`);
                        resource.synchronizeDerivedIds();
                        annotation.ensureSpatialTarget(
                            targetId,
                            containerId,
                            container.getType(),
                        );
                        return;
                    }

                    if (resource instanceof Camera) {
                        cameraIndex += 1;
                        resource.setID(`${containerId}/cameras/${cameraIndex}`);
                        annotation.ensureSpatialTarget(
                            targetId,
                            containerId,
                            container.getType(),
                        );
                        return;
                    }

                    if (annotation.getTarget()) {
                        annotation.ensureSpatialTarget(
                            targetId,
                            containerId,
                            container.getType(),
                        );
                        return;
                    }

                    annotation.setTargetReference(
                        containerId,
                        container.getType() as IiifContainerType,
                    );
                });
            });
        });
    }
    toJSON(): IiifManifest {
        this.synchronizeStructure();

        const out: IiifManifest = {
            "@context": presentationContext,
            id: getEffectiveManifestId(this.id),
            type: this.type,
            label: this.getSerializableLabel().toJSON(),
            items: this.items.map((item) => item.toJSON()),
        };

        if (this.summary?.hasValue()) {
            out.summary = this.summary.toJSON();
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
