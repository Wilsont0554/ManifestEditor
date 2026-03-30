import "./App.css";
import React, { useEffect, useState } from "react";
import { JsonEditor } from "json-edit-react";
import ManifestObject from "./ManifestClasses/TypeScript/ManifestObject.ts";
import ContentResourceElement from "./Components/ContentResourceElement.jsx";
import ContentResource from "./ManifestClasses/TypeScript/ContentResource.ts";
import Annotation from "./ManifestClasses/TypeScript/Annotation.ts";
import Container from "./ManifestClasses/TypeScript/Container.ts";
import Light from "./ManifestClasses/TypeScript/Light.ts";
import TextAnnotation from "./ManifestClasses/TypeScript/TextAnnotation.ts";

/*
models for testing exports:
https://raw.githubusercontent.com/IIIF/3d/main/assets/astronaut/astronaut.glb
https://raw.githubusercontent.com/IIIF/3d/main/assets/whale/whale_mandible.glb
https://raw.githubusercontent.com/IIIF/3d/main/assets/whale/whale_cranium.glb 
*/

function getViewFromHash() {
  return window.location.hash === "#manifest-creator" ? "manifest-creator" : "home";
}

function App() {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [count, setcount] = useState(0);
  const [manifestObj] = useState(() => new ManifestObject("Scene"));
  const [allResources] = useState([]);

  const [blobTEST, setBlob] = useState(URL.createObjectURL(new Blob([JSON.stringify(manifestObj, null, 2)], {
      type: "application/json",
    })));

  const [containerType, setContainerType] = useState("Scene");

  // NEW: State to track which resource is currently being edited in the sidebar
  const [selectedResourceIndex, setSelectedResourceIndex] = useState(null);

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(getViewFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const JSONToFile = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function createAnnotation(resourceType) {
    let index = 0;
    for (let i = 0; i < annotationResource.length; i++){
      index++;
    }
    
    manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .addAnnotation(new Annotation(allResources.length));

    if (resourceType == "Default"){
       manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .getAnnotation(index)
      .setContentResource(new ContentResource("", "Model", "model/gltf-binary"));
    } 
    else if (resourceType == "Light"){
      manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .getAnnotation(index)
      .setContentResource(new Light("https://example.org/iiif/light/1", "AmbientLight"));
    }

    allResources.push(manifestObj.getContainerObj().getAnnotationPage().getAnnotation(index))
    setcount((value) => value + 1);
  }

  function createTextAnnotation(){

    manifestObj.getContainerObj().getTextAnnotations().addAnnotation(new TextAnnotation(allResources.length));
    
    let length = manifestObj.getContainerObj().getTextAnnotations().getAllAnnotations().length
    allResources.push(manifestObj.getContainerObj().getTextAnnotations().getAnnotation(length - 1))

    console.log(allResources);

    setcount((value) => value + 1);
  }

  function createBlob(){
    const temp = new Blob([JSON.stringify(manifestObj, null, 2)], {
      type: "application/json",
    });
    setBlob(URL.createObjectURL(temp));
    console.log(blobTEST);
  }

  const annotationResource = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
  

  // Helper to get the currently selected resource object
  const selectedResource = selectedResourceIndex !== null 
    ? allResources[selectedResourceIndex]
    : null;

useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js" //"https://3d-api.si.edu/resources/js/voyager-explorer.min.js";
    scriptTag.addEventListener('load', () => setcount(count + 1));
    document.body.appendChild(scriptTag);
  }, []);

  return (
    <div className="app-shell">
      {/*<voyager-explorer document="ManifestEditor/src/TextAnnotationExport.json" id="voyager"></voyager-explorer><voyager-explorer root='https://3d-api.si.edu/content/document/341c96cd-f967-4540-8ed1-d3fc56d31f12/' document='document.json'></voyager-explorer>*/}
      
      <header className="app-nav">
        <p className="app-nav__brand">Manifest Editor</p>
        <nav className="app-nav__links">
          <a href="#home">Home</a>
          <a href="#manifest-creator">Manifest Creator</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            Github
          </a>
          <a href="https://iiif.io/api/presentation/3.0/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </nav>
      </header>

      <main className="app-main">
        {activeView === "manifest-creator" ? (
          <section className="manifest-creator">
          <div className="main-content">
            <p
              className="manifest-creator__download"
              onClick={() => JSONToFile(manifestObj, "manifest")}
            >
              Download JSON
            </p>

            <p
              className="manifest-creator__download"
              onClick={() => createBlob()}
            >
              TEST BLOB
            </p>
            
            {/*<iframe name="Smithsonian Voyager" src="https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=https://wilsont0554.github.io/Manifest-Hosting/TextAnnotationExport.json" width="800" height="450" allow="xr; xr-spatial-tracking; fullscreen"></iframe>*/}

            <div class="test">
              <voyager-explorer model={blobTEST} id="voyager"></voyager-explorer>            </div>
            
            <div className="manifest-creator__controls">
              <select
                value={containerType}
                onChange={(e) => {
                  manifestObj.getContainerObj().setType(e.target.value);
                  setContainerType(e.target.value);
                  setcount((value) => value + 1);
                }}
              >
                <option value="Canvas">Canvas</option>
                <option value="Scene">Scene</option>
                <option value="Timeline">Timeline</option>
              </select>

                <button type="button" onClick={() => {createAnnotation("Default")}}>
                  Add Content Resource
                </button>
                <button type="button" onClick={() => {createAnnotation("Light")}}>
                  Add Light
                </button>
                <button type="button" onClick={() => {createTextAnnotation()}}>
                  Add Text Annotation
                </button>
              </div>

              <ol className="manifest-creator__list">
                {allResources.map((resource, index) => (
                  <li key={index} className="resource-list-item">
                    {/* Clicking this button sets the sidebar context */}
                    <button 
                      onClick={() => setSelectedResourceIndex(index)}
                      className={selectedResourceIndex === index ? 'active' : ''}>
                      Content Resource {index + 1}
                    </button>
                  </li>
                ))}
              </ol>

              <JsonEditor data={manifestObj} />
     
            </div>

            {/* NEW: Sidebar for editing */}
            <aside className="manifest-sidebar">
              <h3>Edit Resource</h3>
              {selectedResource ? (
                <div className="sidebar-controls">
                  <p>Editing Resource {selectedResourceIndex + 1}</p>
                  <ContentResourceElement
                    count={count}
                    setcount={setcount}
                    index={selectedResourceIndex}
                    contentResourceIndex={selectedResourceIndex}
                    object={selectedResource}
                    manifestObj={manifestObj}
                  />
                </div>
              ) : (
                <p>Select a resource to edit</p>
              )}
            </aside>
          </section>
        ) : null}
      </main>

      <footer className="app-footer">{"\u00A9"} manifest editor</footer>
    </div>
  );

}

export default App;