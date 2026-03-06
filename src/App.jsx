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

  return (
    <div className="app-shell">
      <header className="app-nav">
        <p className="app-nav__brand">Manifest Editor</p>
        <nav className="app-nav__links">
          <a href="#home">Home</a>
          <a href="#manifest-creator">Manifest Creator</a>
          <a href="https://github.com/Wilsont0554/ManifestEditor" target="_blank" rel="noreferrer">
            Github
          </a>
          <a href="https://preview.iiif.io/api/full_manifests/presentation/4.0/#scene" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </nav>
      </header>

      <main className="app-main">
        {activeView === "manifest-creator" ? (
          <section className="manifest-creator">
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
                <option value="timeline">Time Line</option>
              </select>

              <button type="button" onClick={createAnnotation}>
                Add Content Resource
              </button>
            </div>

            <ol className="manifest-creator__list">
              {contentResources.map((annotation, contentResourceIndex) => (
                <ContentResourceElement
                  key={contentResourceIndex}
                  count={count}
                  setcount={setcount}
                  index={contentResourceIndex}
                  contentResourceIndex={contentResourceIndex}
                  manifestObj={manifestObj}
                />
              ))}
            </ol>

            <JsonEditor data={manifestObj} />
          </section>
        ) : null}
      </main>

      <footer className="app-footer">{"\u00A9"} manifest editor</footer>
    </div>
  );
}

export default App;
