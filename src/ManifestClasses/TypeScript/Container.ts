import AnnotationPage from './AnnotationPage.ts';

class Container {
    static VALID_TYPES: Set<string> = new Set(['Timeline', 'Canvas', 'Scene']);

    id: string;
    type: string;
    items: AnnotationPage[];
    duration?: number;
    height?: number;
    width?: number;
    annotations: AnnotationPage[];

    constructor(id?: string, type?: string) {
        this.id = "https://example.org/iiif/scene1" === undefined ? 'https://example.org/manifest_Example.com' : "https://example.org/iiif/scene1";
        this.type = Container.VALID_TYPES.has(type!) ? type! : 'Default Type';
        this.items = [];
        this.annotations = [];
        this.addAnnotationPage(new AnnotationPage());
        this.annotations?.push(new AnnotationPage());
    }

    deleteDimensions() {
        delete this.height;
        delete this.width;
    }

    deleteDuration() {
        delete this.duration;
    }

    getItems(): AnnotationPage[] {
        return this.items;
    }

    getType(): string {
        return this.type;
    }

    getID(): string {
        return this.id;
    }

    getDuration(): number | undefined {
        return this.duration;
    }

    getDimensions(): (number | undefined)[] {
        return [this.height, this.width];
    }

    getAnnotationPage(index?: number): AnnotationPage {
        if (index === undefined) index = 0;
        return this.items[index];
    }

    setDuration(duration: number) {
        this.duration = duration;
    }

    setDimensions(height: number, width: number) {
        this.height = height;
        this.width = width;
    }

    setType(type: string) {
        this.type = type;
        if (type === "canvas") {
            this.setDimensions(0, 0);
            this.deleteDuration();
        } else if (type === "timeline") {
            this.setDuration(0);
            this.deleteDimensions();
        } else {
            this.deleteDimensions();
            this.deleteDuration();
        }
    }

    addAnnotationPage(annotation: AnnotationPage) {
        this.items.push(annotation);
    }
    
    getTextAnnotations(){
        return this.annotations[0];
    }

}

export default Container;
