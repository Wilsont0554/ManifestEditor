import "./App.css";
import { useEffect, useState } from "react";
import { JsonEditor } from "json-edit-react";
import ManifestObject from "./ManifestClasses/TypeScript/ManifestObject.ts";
import ContentResourceElement from "./Components/ContentResourceElement.tsx";
import ContentResourceMetadataElement from "./Components/ContentResourceMetadataElement.tsx";
import ContentResource from "./ManifestClasses/TypeScript/ContentResource.ts";
import Annotation from "./ManifestClasses/TypeScript/Annotation.ts";

type View = "home" | "manifest-creator";
type ContainerType = "canvas" | "scene" | "timeline";

function getViewFromHash(): View {
  return window.location.hash === "#manifest-creator" ? "manifest-creator" : "home";
}

function App() {
  const [activeView, setActiveView] = useState<View>(getViewFromHash);
  const [count, setcount] = useState(0);
  const [containerType, setContainerType] = useState<ContainerType>("scene");
  const [manifestObj] = useState(() => new ManifestObject("scene"));
  const [selectedResourceIndex, setSelectedResourceIndex] = useState<number | null>(null);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [metadataInitialized, setMetadataInitialized] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(getViewFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const JSONToFile = (obj: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filename}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const annotationResource = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations();

  const contentResources = annotationResource.map((anno) => anno.getContentResource());
  const currentResourceIndex = selectedResourceIndex ?? 0;
  const selectedResource: ContentResource | null =
    selectedResourceIndex !== null ? contentResources[selectedResourceIndex] ?? null : null;

  function createAnnotation(): void {
    let index = 0;
    for (let i = 0; i < annotationResource.length; i += 1) {
      if (annotationResource[i].getContentResource() === undefined) {
        manifestObj
          .getContainerObj()
          .getAnnotationPage()
          .getAnnotation(i)
          .setContentResource(new ContentResource("", "Model", "model/gltf-binary"));
        setcount((value) => value + 1);
      }
      index += 1;
    }

    manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .addAnnotation(new Annotation());

    manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .getAnnotation(index)
      .setContentResource(new ContentResource("", "Model", "model/gltf-binary"));
    setcount((value) => value + 1);
  }

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
                  onChange={(event) => {
                    const nextType = event.target.value as ContainerType;
                    manifestObj.getContainerObj().setType(nextType);
                    setContainerType(nextType);
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
                {annotationResource.map((_, index) => (
                  <li key={index} className="resource-list-item">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedResourceIndex(index);
                        setIsEditingMetadata(false);
                      }}
                      className={selectedResourceIndex === index ? "active" : ""}
                    >
                      Content Resource {index + 1}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedResourceIndex(index);
                        const resource = contentResources[index];
                        if (!resource) {
                          setIsEditingMetadata(false);
                          return;
                        }

                        const metadata = resource.getMetadata();
                        const hasMetadata =
                          metadataInitialized.has(index) || metadata.getAllEntries().length > 0;

                        if (!hasMetadata) {
                          metadata.addEntry("", "", "en");
                          setMetadataInitialized((prev) => new Set([...prev, index]));
                        }

                        setIsEditingMetadata(true);
                        setcount((value) => value + 1);
                      }}
                      style={{
                        marginLeft: "10px",
                        padding: "4px 8px",
                        fontSize: "0.8em",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      {metadataInitialized.has(index) ||
                      (contentResources[index] &&
                        contentResources[index].getMetadata().getAllEntries().length > 0)
                        ? "Edit Metadata"
                        : "Add Metadata"}
                    </button>
                  </li>
                ))}
              </ol>

              <JsonEditor data={manifestObj} />
            </div>

            <aside className="manifest-sidebar">
              <h3>Edit Resource</h3>
              {selectedResource ? (
                <div className="sidebar-controls">
                  <p>Editing Resource {currentResourceIndex + 1}</p>

                  {!isEditingMetadata ? (
                    <ContentResourceElement
                      count={count}
                      setcount={setcount}
                      contentResourceIndex={currentResourceIndex}
                      manifestObj={manifestObj}
                      setIsEditingMetadata={setIsEditingMetadata}
                    />
                  ) : (
                    <ContentResourceMetadataElement
                      count={count}
                      setcount={setcount}
                      contentResourceIndex={currentResourceIndex}
                      manifestObj={manifestObj}
                      setIsEditingMetadata={setIsEditingMetadata}
                    />
                  )}
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
