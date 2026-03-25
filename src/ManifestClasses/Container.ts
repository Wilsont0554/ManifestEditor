import AnnotationPage from './AnnotationPage.ts';

class Container {
    static VALID_TYPES: Set<string> = new Set(['timeline', 'canvas', 'scene']);

    id: string;
    type: string;
    items: AnnotationPage[];
    duration?: number;
    height?: number;
    width?: number;

    constructor(id?: string, type?: string) {
        this.id = id === undefined ? 'https://example.org/manifest_Example.com' : id;
        this.type = Container.VALID_TYPES.has(type!) ? type! : 'Default Type';
        this.items = [];
        this.addAnnotationPage(new AnnotationPage());
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

    toJSON() {
        const out: { id: string; type: string; duration?: number; height?: number; width?: number; item: AnnotationPage[] } = {
            id: this.id,
            type: this.type,
            item: this.items,
        };

        if (this.type === "timeline" && this.duration !== undefined) {
            out.duration = this.duration;
        }

        if (this.type === "canvas" && this.height !== undefined && this.width !== undefined) {
            out.height = this.height;
            out.width = this.width;
        }

        return out;
    }
}

export default Container;