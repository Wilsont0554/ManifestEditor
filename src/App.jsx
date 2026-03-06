import "./App.css";
import React, { useEffect, useState } from "react";
import { JsonEditor } from "json-edit-react";
import ManifestObject from "./ManifestClasses/ManifestObject.js";
import ContentResourceElement from "./Components/ContentResourceElement.jsx";
import ContentResource from "./ManifestClasses/ContentResource.js";
import Container from "./ManifestClasses/Container.js";

function getViewFromHash() {
  return window.location.hash === "#manifest-creator" ? "manifest-creator" : "home";
}

function App() {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [count, setcount] = useState(0);
  const [containerType, setContainerType] = useState("Scene");
  const [manifestObj] = useState(() => new ManifestObject("Scene"));
  
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

  function createAnnotation() {
    manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .getAnnotation()
      .addContentResource(new ContentResource("", "Model", "model/gltf-binary"));
    setcount((value) => value + 1);
  }

  const contentResources = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAnnotation(0)
    .getAllContentResource();

  // Helper to get the currently selected resource object
  const selectedResource = selectedResourceIndex !== null 
    ? contentResources[selectedResourceIndex] 
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
                <option value="canvas">Canvas</option>
                <option value="scene">Scene</option>
                <option value="timeline">Timeline</option>
              </select>

                <button type="button" onClick={createAnnotation}>
                  Add Content Resource
                </button>
              </div>

              <ol className="manifest-creator__list">
                {contentResources.map((resource, index) => (
                  <li key={index} className="resource-list-item">
                    {/* Clicking this button sets the sidebar context */}
                    <button 
                      onClick={() => setSelectedResourceIndex(index)}
                      className={selectedResourceIndex === index ? 'active' : ''}
                    >
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