import "./App.css";
import React, { useEffect, useState } from "react";
import { JsonEditor } from "json-edit-react";
import ManifestObject from "./ManifestClasses/TypeScript/ManifestObject.ts";
import ContentResourceElement from "./Components/ContentResourceElement.jsx";
import ContentResource from "./ManifestClasses/TypeScript/ContentResource.ts";
import Annotation from "./ManifestClasses/TypeScript/Annotation.ts";
import Container from "./ManifestClasses/TypeScript/Container.ts";
import Camera from "./ManifestClasses/TypeScript/SceneComponets/Camera.ts";
import CameraElement from "./Components/CameraElement.tsx";
import Light from "./ManifestClasses/TypeScript/Light.ts";
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
      if (annotationResource[i].getContentResource() == undefined){
        manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(i)
        .setContentResource(new ContentResource("", "Model", "model/gltf-binary"));
        setcount((value) => value + 1);
      }
      index++;
    }

    manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .addAnnotation(new Annotation(manifestObj.getContainerObj().getAnnotationPage().getAllAnnotations().length + 1));

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
    setcount((value) => value + 1);
  }

  const annotationResource = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()

  // Helper to get the currently selected resource object
  const selectedResource = selectedResourceIndex !== null 
    ? annotationResource[selectedResourceIndex].getContentResource()
    : null;

  return (
    <div className="app-shell">
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
              </div>

              <ol className="manifest-creator__list">
                {annotationResource.map((resource, index) => (
                  <li key={index} className="resource-list-item">
                    {/* Clicking this button sets the sidebar context */}
                    <button 
                      onClick={() => setSelectedResourceIndex(index)}
                      className={selectedResourceIndex === index ? 'active' : ''}>
                    <img className="CRPreview" src={resource.getContentResource().getID()} alt={"Content Resource " + (index + 1)}></img>
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