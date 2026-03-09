import { useEffect, useState } from "react";
import Navbar from "./Components/navbar/index.jsx";
import HomePage from "./pages/home/index.jsx";
import ManifestEditorPage from "./pages/manifest-editor/index.jsx";
import ContentResource from "./utils/manifest/ContentResource.js";
import ManifestObject from "./utils/manifest/ManifestObject.js";
import { downloadJsonFile } from "./utils/file.js";

const NAV_LINKS = [
  {
    label: "Home",
    href: "#home",
    type: "internal",
  },
  {
    label: "Manifest Creator",
    href: "#manifest-creator",
    type: "internal",
  },
  {
    label: "Github",
    href: "https://github.com/Wilsont0554/ManifestEditor",
    type: "external",
  },
  {
    label: "Documentation",
    href: "https://preview.iiif.io/api/full_manifests/presentation/4.0/#scene",
    type: "external",
  },
];

function getViewFromHash() {
  return window.location.hash === "#manifest-creator" ? "manifest-creator" : "home";
}

function App() {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [_count, setCount] = useState(0);
  const [containerType, setContainerType] = useState("Scene");
  const [manifestObj] = useState(() => new ManifestObject("Scene"));

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(getViewFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function createAnnotation() {
    manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .getAnnotation()
      .addContentResource(new ContentResource("", "Model", "model/gltf-binary"));

    setCount((value) => value + 1);
  }

  function handleContainerTypeChange(nextType) {
    manifestObj.getContainerObj().setType(nextType);
    setContainerType(nextType);
    setCount((value) => value + 1);
  }

  function handleDownloadManifest() {
    downloadJsonFile(manifestObj, "manifest");
  }

  const contentResources = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAnnotation(0)
    .getAllContentResource();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar activeView={activeView} links={NAV_LINKS} />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        {activeView === "manifest-creator" ? (
          <ManifestEditorPage
            setCount={setCount}
            containerType={containerType}
            onContainerTypeChange={handleContainerTypeChange}
            onAddContentResource={createAnnotation}
            onDownloadManifest={handleDownloadManifest}
            contentResources={contentResources}
            manifestObj={manifestObj}
          />
        ) : (
          <HomePage />
        )}
      </main>

      <footer className="border-t border-slate-300 bg-slate-50 py-3 text-center text-sm text-slate-600">
        {"\u00A9"} manifest editor
      </footer>
    </div>
  );
}

export default App;
