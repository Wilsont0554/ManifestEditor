import {
  type MouseEvent as ReactMouseEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ContentResourceModal, {
  type ContentResourceModalView,
} from "@components/editors/manifest/content-resource-modal";
import ManifestComponent from "@/components/editors/manifest";
import type { ManifestTabId } from "@components/editors/manifest/manifest-component-constants";
import CreateBar from "@/components/shared/createBar/CreateBar";
import ImportExportHandler from "@/components/shared/importExport/importExportHandler";
import VoyagerStage from "@/components/shared/manifest-editor/voyager-stage";
import Annotation from "@/ManifestClasses/Annotation";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import { manifestObjContext } from "@/context/manifest-context";
import { type IiifContainerType } from "@/types/iiif";
import {
  createDefaultContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";
import {
  createManifestObjectFromUpload,
  downloadJsonFile,
  serializeManifestForExport,
} from "@/utils/file";

const DEFAULT_INSPECTOR_WIDTH = 720;
const MIN_INSPECTOR_WIDTH = 320;
const MAX_INSPECTOR_WIDTH = 860;
const INSPECTOR_DOCK_GUTTER = 40;
const VOYAGER_SCRIPT_SRC =
  "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js";

const ASSET_MODAL_TYPES: EditableContentResourceType[] = ["Image", "Model"];
const ENVIRONMENT_MODAL_TYPES: EditableContentResourceType[] = [
  "Light",
  "Camera",
];

type ImportExportType = "none" | "import" | "export";

interface ResizeState {
  startX: number;
  startWidth: number;
}

interface ContentResourceModalSnapshot {
  manifestObj: ManifestObject;
  selectedMetadataAnnotationIndex: number;
}

function ManifestEditorPage() {
  const [isContentResourceModalOpen, setIsContentResourceModalOpen] =
    useState(false);
  const [contentResourceModalView, setContentResourceModalView] =
    useState<ContentResourceModalView>("picker");
  const [contentResourceModalTypes, setContentResourceModalTypes] =
    useState<EditableContentResourceType[] | undefined>(undefined);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [inspectorWidth, setInspectorWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const [activeManifestTab, setActiveManifestTab] =
    useState<ManifestTabId>("overview");
  const [selectedMetadataAnnotationIndex, setSelectedMetadataAnnotationIndex] =
    useState(0);
  const [gistId, setGistId] = useState<string | null>(null);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(false);
  const [importExportType, setImportExportType] =
    useState<ImportExportType>("none");
  const [voyagerUrl, setVoyagerUrl] = useState("");

  const resizeStateRef = useRef<ResizeState | null>(null);
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

  useEffect(() => {
    setVoyagerUrl(liveViewerManifestUrl);
  }, [liveViewerManifestUrl]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVoyagerUrl((currentUrl) =>
        currentUrl === liveViewerManifestUrl ? currentUrl : liveViewerManifestUrl,
      );
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [liveViewerManifestUrl]);

  useEffect(() => {
    if (customElements.get("voyager-explorer")) {
      setIsInspectorOpen(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-voyager-explorer="true"]',
    );
    const handleLoad = () => setIsInspectorOpen(true);

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const scriptTag = document.createElement("script");
    scriptTag.src = VOYAGER_SCRIPT_SRC;
    scriptTag.dataset.voyagerExplorer = "true";
    scriptTag.addEventListener("load", handleLoad);
    document.body.appendChild(scriptTag);

    return () => scriptTag.removeEventListener("load", handleLoad);
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

  function openContentResourceModal(
    allowedTypes?: EditableContentResourceType[],
  ): void {
    captureContentResourceModalSnapshot();
    setContentResourceModalTypes(allowedTypes);
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
  }

  function handleOpenContentResourceModal(): void {
    openContentResourceModal(undefined);
  }

  function handleOpenAssetModal(): void {
    openContentResourceModal(ASSET_MODAL_TYPES);
  }

  function handleOpenEnvironmentModal(): void {
    openContentResourceModal(ENVIRONMENT_MODAL_TYPES);
  }

  function handleCloseContentResourceModal(): void {
    setIsContentResourceModalOpen(false);
    setContentResourceModalTypes(undefined);
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

    annotation.setContentResource(
      createDefaultContentResource(type, nextAnnotationIndex),
    );
    annotationPage.addAnnotation(annotation);

    setSelectedMetadataAnnotationIndex(nextAnnotationIndex);
    setContentResourceModalView("editor");
    updateManifestObj();
  }

  function handleCreateTextAnnotation(): void {
    captureContentResourceModalSnapshot();

    const annotationPage = manifestObj.getContainerObj().getAnnotationPage();
    const nextAnnotationIndex = annotationPage.getAllAnnotations().length;
    const annotation = new Annotation(nextAnnotationIndex + 1, ["commenting"]);

    annotation.setContentResource(new TextAnnotation(nextAnnotationIndex + 1));
    annotationPage.addAnnotation(annotation);

    setSelectedMetadataAnnotationIndex(nextAnnotationIndex);
    setContentResourceModalView("editor");
    setIsContentResourceModalOpen(true);
    updateManifestObj();
  }

  function handleContainerTypeChange(nextType: IiifContainerType): void {
    manifestObj.getContainerObj().setType(nextType);
    updateManifestObj();
  }

  function handleDownloadManifest(): void {
    downloadJsonFile(serializedManifest, "manifest");
  }

  const container = manifestObj.getContainerObj();
  const annotationPage = container.getAnnotationPage();
  const manifestLabel = manifestObj.getLabelValue().trim();
  const manifestTitle =
    manifestLabel.length > 0 ? manifestLabel : "Untitled Manifest";
  const hasStageContent = annotationPage.getAllAnnotations().length > 0;
  const inspectorDockPadding = isInspectorOpen
    ? `clamp(0px, calc(100vw - 360px), calc(${inspectorWidth}px + ${INSPECTOR_DOCK_GUTTER}px))`
    : undefined;
  const importExportMenu =
    importExportType === "none" ? null : (
      <ImportExportHandler
        createManifestObjectFromUpload={createManifestObjectFromUpload}
        gistId={gistId}
        importExportType={importExportType}
        isAutoUpdateEnabled={isAutoUpdateEnabled}
        manifestObj={manifestObj}
        serializedManifest={serializedManifest}
        setGistId={setGistId}
        setImportExportType={setImportExportType}
        setIsAutoUpdateEnabled={setIsAutoUpdateEnabled}
        setManifestObj={setManifestObj}
      />
    );

  return (
    <section className="relative h-full min-h-0 w-full overflow-hidden border-t border-slate-200 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f8fafc_42%,_#eef2f7_100%)]">
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
        style={{ paddingRight: inspectorDockPadding }}
      >
        <div className="mx-auto max-w-[1600px] space-y-5 pb-6">
          <CreateBar
            containerType={container.getType()}
            handleCreateTextAnnotation={handleCreateTextAnnotation}
            handleOpenContentResourceModal={handleOpenAssetModal}
            handleOpenTempModal={handleOpenEnvironmentModal}
            onContainerTypeChange={handleContainerTypeChange}
            onDownload={handleDownloadManifest}
            onExport={() => setImportExportType("export")}
            onImport={() => setImportExportType("import")}
          />

          <VoyagerStage
            containerType={container.getType()}
            hasStageContent={hasStageContent}
            isInspectorOpen={isInspectorOpen}
            manifestTitle={manifestTitle}
            serializedManifest={serializedManifest}
            voyagerUrl={voyagerUrl}
            onCreateTextAnnotation={handleCreateTextAnnotation}
            onOpenContentResourceModal={handleOpenContentResourceModal}
            onToggleInspector={() => setIsInspectorOpen((currentValue) => !currentValue)}
          />

          {importExportMenu}
        </div>
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
