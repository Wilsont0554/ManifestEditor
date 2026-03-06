import Container from './Container.js'

class ManifestObject{
    constructor(containerType = "Canvas"){
        this["@context"] = "http://iiif.io/api/presentation/3/context.json";
        this.id = "https://example.org/to13swr5ws-mlwptp83";
        this.type = "Manifest";
        this.label = {
            en: ["Manifest Editor Export"],
        };
        this.metadata = [];
        this.rights = "";
        this.seeAlso = [];
        this.rendering = [];
        this.items = [];
        this.addContainer(new Container(this.id, containerType))
    }

    addContainer(container){
        this.items.push(container)
    }

    getContainerObj(index){
        if (index == undefined){
            index = 0;
        }
        return this.items[index];
    }

    getAllContainers(){
        return this.items;
    }

    setId(id){
        this.id = id;
    }

    setLabel(value, languageCode = "en"){
        this.label = {
            [languageCode]: value ? [value] : [],
        };
    }

    addContainerFromTemplate(template = {}){
        const container = new Container("Canvas", {
            id: template.canvasId,
            label: {
                en: [template.label || "Untitled canvas item"],
            },
            width: template.width,
            height: template.height,
            duration: template.duration,
            summary: template.summary
                ? {
                      en: [template.summary],
                  }
                : undefined,
            rights: template.rights,
            annotationPageId: template.paintingAnnotationPageId,
            annotations: template.annotationPageId
                ? [
                      {
                          id: template.annotationPageId,
                          type: "AnnotationPage",
                          items: [],
                      },
                  ]
                : undefined,
        });

        this.addContainer(container);
        return container;
    }

    toJSON(){
        const output = {
            "@context": this["@context"],
            id: this.id,
            type: this.type,
            label: this.label,
            metadata: this.metadata,
            rights: this.rights,
            seeAlso: this.seeAlso,
            rendering: this.rendering,
            items: this.items,
        };

        if (!this.rights){
            delete output.rights;
        }

        return output;
    }

} export default ManifestObject
