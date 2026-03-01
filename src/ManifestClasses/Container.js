import AnnotationPage from './AnnotationPage.js'

class Container{
    constructor(type, options = {}){
        this.id = options.id || "https://example.org/iiif/canvas/1";
        this.type = type;
        this.label = options.label || {
            en: ["Untitled canvas"],
        };
        this.summary = options.summary || {
            en: [],
        };
        this.metadata = options.metadata || [];
        this.thumbnail = options.thumbnail || [];
        this.rights = options.rights || "";
        this.duration = options.duration || 0;
        this.width = options.width || 1200;
        this.height = options.height || 1600;
        this.behavior = options.behavior || [];
        this.seeAlso = options.seeAlso || [];
        this.rendering = options.rendering || [];
        this.navPlace = options.navPlace || null;
        this.annotations =
            options.annotations || [
                {
                    id: `${this.id}/annopage/p1`,
                    type: "AnnotationPage",
                    items: [],
                },
            ];
        this.items = [];
        this.addAnnotationPage(new AnnotationPage(this.id, options.annotationPageId || `${this.id}/page/p1/1`));
    }

    addAnnotationPage(annotationPage){
        this.items.push(annotationPage)
    }

    getAnnotationPage(index){
        if (index == undefined){
            index = 0;
        }
        return this.items[index];
    }

    setType(type){
        this.type = type;
    }

    setId(id){
        const oldId = this.id;
        this.id = id;
        this.items.forEach((annotationPage) => {
            if (annotationPage?.setCanvasId){
                annotationPage.setCanvasId(id);
            }
        });
        this.annotations = this.annotations.map((annotationPageRef, index) => {
            if (!annotationPageRef?.id){
                return annotationPageRef;
            }

            if (index === 0){
                return {
                    ...annotationPageRef,
                    id: annotationPageRef.id.replace(oldId, id),
                };
            }

            return annotationPageRef;
        });
    }

    setLabel(value, languageCode = "en"){
        this.label = {
            [languageCode]: value ? [value] : [],
        };
    }

    setSummary(value, languageCode = "en"){
        this.summary = {
            [languageCode]: value ? [value] : [],
        };
    }

    setRights(rights){
        this.rights = rights || "";
    }

    setDuration(duration){
        const parsedDuration = Number(duration);
        if (!Number.isNaN(parsedDuration) && parsedDuration >= 0){
            this.duration = parsedDuration;
        }
    }

    setDimensions(width, height){
        const parsedWidth = Number(width);
        const parsedHeight = Number(height);
        if (!Number.isNaN(parsedWidth) && parsedWidth > 0){
            this.width = parsedWidth;
        }
        if (!Number.isNaN(parsedHeight) && parsedHeight > 0){
            this.height = parsedHeight;
        }
    }

    setAnnotationPageReference(id){
        if (!id){
            return;
        }

        if (this.annotations.length === 0){
            this.annotations.push({
                id,
                type: "AnnotationPage",
                items: [],
            });
            return;
        }

        this.annotations[0].id = id;
    }

    setPaintingAnnotationPageId(id){
        const annotationPage = this.getAnnotationPage(0);
        if (annotationPage){
            annotationPage.setId(id);
        }
    }

    setThumbnailFromMedia(contentResource){
        if (!contentResource?.id){
            this.thumbnail = [];
            return;
        }

        this.thumbnail = [
            {
                id: contentResource.id,
                type: contentResource.type || "Image",
                format: contentResource.format || "image/jpeg",
            },
        ];
    }

    addMetadataItem(label, value, languageCode = "en"){
        this.metadata.push({
            label: {
                [languageCode]: label ? [label] : [],
            },
            value: {
                [languageCode]: value ? [value] : [],
            },
        });
    }

    getId(){
        return this.id;
    }

    getType(){
        return this.type;
    }

    toJSON(){
        const output = {
            id: this.id,
            type: this.type,
            label: this.label,
            summary: this.summary,
            metadata: this.metadata,
            thumbnail: this.thumbnail,
            rights: this.rights,
            duration: this.duration,
            width: this.width,
            height: this.height,
            behavior: this.behavior,
            seeAlso: this.seeAlso,
            rendering: this.rendering,
            navPlace: this.navPlace,
            items: this.items,
            annotations: this.annotations,
        };

        if (!this.rights){
            delete output.rights;
        }

        if (!this.navPlace){
            delete output.navPlace;
        }

        return output;
    }
} export default Container
