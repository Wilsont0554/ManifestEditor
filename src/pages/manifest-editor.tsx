import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from "react";
import ContentResourceModal, {
  type ContentResourceModalView,
} from "@components/editors/manifest/content-resource-modal";
import ManifestComponent from "@/components/editors/manifest";
import type { ManifestTabId } from "@components/editors/manifest/manifest-component-constants";
import { manifestObjContext } from "@/context/manifest-context";
import { createManifestObjectFromUpload, serializeManifestForExport  } from "@/utils/file";
import Annotation from "@/ManifestClasses/Annotation";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import {
  type EditableContentResourceType,
} from "@/utils/content-resource";
import CreateBar from "@/components/shared/createBar/CreateBar";
import ImportExportHandler from "@/components/shared/importExport/importExportHandler";
import ContentResource from "@/ManifestClasses/ContentResource";
import Light from "@/ManifestClasses/Light";
import Camera from "@/ManifestClasses/Camera";

const DEFAULT_INSPECTOR_WIDTH = 720;
const MIN_INSPECTOR_WIDTH = 320;
const MAX_INSPECTOR_WIDTH = 860;
const INSPECTOR_DOCK_GUTTER = 40;

interface ResizeState {
  startX: number;
  startWidth: number;
}

interface ContentResourceModalSnapshot {
  manifestObj: ManifestObject;
  selectedMetadataAnnotationIndex: number;
}

const ASSET_MODAL_TYPES: EditableContentResourceType[] = ["Image", "Model"];
const TEMP_MODAL_TYPES: EditableContentResourceType[] = ["Light", "Camera"];

function ManifestEditorPage() {
  const [isContentResourceModalOpen, setIsContentResourceModalOpen] =
    useState(false);
  const [contentResourceModalView, setContentResourceModalView] =
    useState<ContentResourceModalView>("picker");
  const [contentResourceModalTypes, setContentResourceModalTypes] =
    useState<EditableContentResourceType[]>(ASSET_MODAL_TYPES);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const [inspectorWidth, setInspectorWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const [activeManifestTab, setActiveManifestTab] =
    useState<ManifestTabId>("overview");
  const [selectedMetadataAnnotationIndex, setSelectedMetadataAnnotationIndex] =
    useState(0);

  const [gistId, setGistId] = useState<string | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(false);
  const [importExportType, setImportExportType] = useState("none");

  const contentResourceModalSnapshotRef =
    useRef<ContentResourceModalSnapshot | null>(null);
  const { manifestObj, updateManifestObj, setManifestObj } =
    useContext(manifestObjContext);

  const serializedManifest = useMemo(
    () => serializeManifestForExport(manifestObj),
    [manifestObj],
  );


  const liveViewerManifestUrl = useMemo(
    () =>
      `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(serializedManifest, null, 2),
      )}`,
    [serializedManifest],
  );
  const [voyagerUrl, setVoyagerUrl] = useState(liveViewerManifestUrl);

  let importExportMenu;
  if (importExportType != "none"){
    importExportMenu = 
      <ImportExportHandler
        createManifestObjectFromUpload = {createManifestObjectFromUpload} 
        setIsAutoUpdateEnabled  = {setIsAutoUpdateEnabled}
        isAutoUpdateEnabled = {isAutoUpdateEnabled}
        setImportExportType = {setImportExportType}
        serializedManifest = {serializedManifest}
        importExportType = {importExportType}
        setManifestObj = {setManifestObj}
        manifestObj = {manifestObj}
        setGistId = {setGistId}
        gistId = {gistId}
      />
  }
  else {
    importExportMenu = undefined;
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVoyagerUrl((currentUrl) =>
        currentUrl === liveViewerManifestUrl
          ? currentUrl
          : liveViewerManifestUrl,
      );
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [liveViewerManifestUrl]);

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js"
    scriptTag.addEventListener('load', () => setIsInspectorOpen(true));
    document.body.appendChild(scriptTag);
  }, []);

  useEffect(() => {
    function handlePointerMove(event: MouseEvent): void {
      if (!resizeStateRef.current) {
        return;
      }

      const { startX, startWidth } = resizeStateRef.current;
      const maxWidthFromViewport = Math.max(
        MIN_INSPECTOR_WIDTH,
        window.innerWidth - 80,
      );
      const nextWidth = Math.min(
        Math.max(startWidth + (startX - event.clientX), MIN_INSPECTOR_WIDTH),
        Math.min(MAX_INSPECTOR_WIDTH, maxWidthFromViewport),
      );

      setInspectorWidth(nextWidth);
    }

    function handlePointerUp(): void {
      resizeStateRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, []);

  function handleResizeStart(event: ReactMouseEvent<HTMLButtonElement>): void {
    resizeStateRef.current = {
      startX: event.clientX,
      startWidth: inspectorWidth,
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  }

  function handleResetInspector(): void {
    setInspectorWidth(DEFAULT_INSPECTOR_WIDTH);
    setIsInspectorOpen(true);
  }

  function captureContentResourceModalSnapshot(): void {
    contentResourceModalSnapshotRef.current = {
      manifestObj: manifestObj.clone(),
      selectedMetadataAnnotationIndex,
    };
  }

  function clearContentResourceModalSnapshot(): void {
    contentResourceModalSnapshotRef.current = null;
  }

  function handleOpenContentResourceModal(): void {
    captureContentResourceModalSnapshot();
    setContentResourceModalTypes(ASSET_MODAL_TYPES);
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
  }

  function handleOpenTempModal(): void {
    captureContentResourceModalSnapshot();
    setContentResourceModalTypes(TEMP_MODAL_TYPES);
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
  }

  function handleCloseContentResourceModal(): void {
    setIsContentResourceModalOpen(false);
    setContentResourceModalView("picker");
  }

  function handleCancelContentResourceModal(): void {
    const snapshot = contentResourceModalSnapshotRef.current;

    if (snapshot) {
      setManifestObj(snapshot.manifestObj);
      setSelectedMetadataAnnotationIndex(snapshot.selectedMetadataAnnotationIndex);
    }

    clearContentResourceModalSnapshot();
    handleCloseContentResourceModal();
  }

  function handleSaveContentResourceModal(): void {
    clearContentResourceModalSnapshot();
    handleCloseContentResourceModal();
  }

  function handleCreateContentResource(
    type: EditableContentResourceType,
  ): void {
    const annotationPage = manifestObj.getContainerObj().getAnnotationPage();

    const nextAnnotationIndex = annotationPage.getAllAnnotations().length;
    const annotation = new Annotation(nextAnnotationIndex + 1);
    if (type == "Model"){
      annotation.setContentResource(
        new ContentResource("", "Model", "model/gltf-binary"),
      );
    }
    else if (type === "Light") {
      annotation.setContentResource(
        new Light("", "AmbientLight"),
      );
    }
    else if (type === "Camera") {
      annotation.setContentResource(
        new Camera("", "OrthographicCamera"),
      );
    }

    annotationPage.addAnnotation(annotation);

    setSelectedMetadataAnnotationIndex(nextAnnotationIndex);
    setContentResourceModalView("editor");
    updateManifestObj();
  }

  function handleCreateTextAnnotation(): void {
    captureContentResourceModalSnapshot();

    const annotationPage = manifestObj.getContainerObj().getAnnotationPage();
    const nextAnnotationIndex = annotationPage.getAllAnnotations().length;
    const textAnnotation = new TextAnnotation(nextAnnotationIndex + 1);
    const annotation = new Annotation(nextAnnotationIndex + 1, ["commenting"]);
    
    annotation.setContentResource(textAnnotation);
    annotationPage.addAnnotation(annotation);

    setSelectedMetadataAnnotationIndex(nextAnnotationIndex);
    setContentResourceModalView("editor");
    setIsContentResourceModalOpen(true);
    updateManifestObj();
  }
  const inspectorDockPadding = isInspectorOpen
    ? `clamp(0px, calc(100vw - 360px), calc(${inspectorWidth}px + ${INSPECTOR_DOCK_GUTTER}px))`
    : undefined;

  return (
    <section className="relative h-full min-h-0 w-full overflow-hidden border-t border-slate-200 bg-slate-100">
      <ContentResourceModal
        isOpen={isContentResourceModalOpen}
        view={contentResourceModalView}
        selectedAnnotationIndex={selectedMetadataAnnotationIndex}
        allowedTypes={contentResourceModalTypes}
        onCancel={handleCancelContentResourceModal}
        onSave={handleSaveContentResourceModal}
        onSelectType={handleCreateContentResource}
      />

      <div
        className="h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
        style={{
          paddingRight: inspectorDockPadding,
        }}
      >

        <CreateBar
          isAutoUpdateEnabled={isAutoUpdateEnabled}
          gistId={gistId}
          handleOpenContentResourceModal={handleOpenContentResourceModal}
          handleOpenTempModal={handleOpenTempModal}
          handleCreateTextAnnotation={handleCreateTextAnnotation}
        />
          
        <div className="mainWindow overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="voyagerWindow">
            <voyager-explorer
              prompt="false"
              key={voyagerUrl}
              document={voyagerUrl}
              id="voyager"
              style={{ width: "500px", height: "500px" }}
            ></voyager-explorer>
          </div>
        </div>
        {importExportMenu}
      </div>          

      {isInspectorOpen ? (
        <ManifestComponent
          width={inspectorWidth}
          activeTab={activeManifestTab}
          onActiveTabChange={setActiveManifestTab}
          selectedMetadataAnnotationIndex={selectedMetadataAnnotationIndex}
          onSelectedMetadataAnnotationIndexChange={
            setSelectedMetadataAnnotationIndex
          }
          onImportClick={() => setImportExportType("import")}
          onExportClick={() => setImportExportType("export")}
          onClose={() => setIsInspectorOpen(false)}
          onReset={handleResetInspector}
          onResizeStart={handleResizeStart}
        />
      ) : (
        <div className="absolute inset-y-0 right-0 z-20 flex items-center border-l border-slate-200 bg-white px-1">
          <div className="flex h-full flex-col items-center justify-center">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
              onClick={() => setIsInspectorOpen(true)}
              aria-label="Open inspector"
              title="Open panel"
            >
              &lsaquo;
            </button>
          </div>
        </div>
      )}


    </section>
  );
}

export default ManifestEditorPage;