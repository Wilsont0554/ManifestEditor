import { useEffect, useState } from "react";
import Navbar, { type ActiveView, type NavLink } from "./components/navbar";
import HomePage from "./pages/home";
import ManifestEditorPage from "./pages/manifest-editor";
import ContentResource from "./pages/manifest-editor/manifest/ContentResource";
import ManifestObject from "./pages/manifest-editor/manifest/ManifestObject";
import { downloadJsonFile } from "./utils/file";

type ContainerType = "Canvas" | "Scene";

const NAV_LINKS: NavLink[] = [
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

function getViewFromHash(): ActiveView {
  return window.location.hash === "#manifest-creator" ? "manifest-creator" : "home";
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>(getViewFromHash);
  const [_renderVersion, setCount] = useState(0);
  const [containerType, setContainerType] = useState<ContainerType>("Scene");
  const [manifestObj] = useState(() => new ManifestObject("Scene"));
  const isManifestEditorView = activeView === "manifest-creator";

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(getViewFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function createAnnotation(): void {
    manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .getAnnotation()
      .addContentResource(new ContentResource("", "Model", "model/gltf-binary"));

    setCount((value) => value + 1);
  }

  function handleContainerTypeChange(nextType: ContainerType): void {
    manifestObj.getContainerObj().setType(nextType);
    setContainerType(nextType);
    setCount((value) => value + 1);
  }

  function handleDownloadManifest(): void {
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

      <main className={isManifestEditorView ? "w-full" : "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6"}>
        {isManifestEditorView ? (
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

      {!isManifestEditorView ? (
        <footer className="border-t border-slate-300 bg-slate-50 py-3 text-center text-sm text-slate-600">
          {"\u00A9"} manifest editor
        </footer>
      ) : null}
    </div>
  );
}

export default App;
