class Manifest{
    constructor(){
        this.manifest = {
            "@context": "http://iiif.io/api/presentation/3/context.json",
            "id": "https://example.org/to13swr5ws-mlwptp83",
            "type": "Manifest",
            "label": {
                "en": [
                "Blank Manifest"
                ]
            },
            "items": []
        }
    }

    

    /**
     * 
     * @param {*} id is the ID of the annotation page, the example URL
     * @param {*} type if the type of container it is (Canvas, timeline, scene)
     */
    createContainer(type){
        let additionIndex = 0;
        for (let i = 0; i < this.manifest["items"].length; i++){
            additionIndex++;
        }
        this.manifest["items"][additionIndex] = 
        {
            "id": "https://example.org/iiif/scene1/page/p1/1",
            "type": type,
            "items": []
        };
    }

   /**
    * 
    * @param {*} id is the ID of the annotation page, the example URL
    * @param {*} containerIndex represents the index where the annotation will be placed inside the container
    */
    createAnnotationPage(){
        let additionIndex = this.manifest["items"][0]["items"].length;
    
        this.manifest["items"][0]["items"][additionIndex] = {
            "id": "https://example.org/iiif/scene1/page/p1/1",
            "type": "AnnotationPage",
            "items": []
        }; 
    }

    createAnnotation(id, type, format){
        if (this.manifest["items"].length == 0){
            this.createContainer("Scene");
        }

        if (this.manifest["items"][0].length == undefined){
            this.createAnnotationPage();
        }

        let additionIndex = this.manifest["items"][0]["items"][0]["items"].length;
        let targetURL = this.manifest["items"][0]["id"];

        this.manifest["items"][0]["items"][0]["items"][additionIndex] = {
            "id": "https://example.org/iiif/scene1/page/p1/1",
            "type": "Annotation",
            "motivation": ["painting"],
            "body" : [{
                "id" : id,
                "type": type,
                "format": format
            }],
            "target": targetURL,
        }; 
    }
}

export default Manifest