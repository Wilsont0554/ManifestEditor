import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  ChangeEvent,
} from "react";
import ContentResourceModal, {
  type ContentResourceModalView,
} from "@components/editors/manifest/content-resource-modal";
import ManifestComponent from "@components/editors/manifest";
import type { ManifestTabId } from "@components/editors/manifest/manifest-component-constants";
import { manifestObjContext } from "@/context/manifest-context";
import { downloadJsonFile, createManifestObjectFromUpload, serializeManifestForExport  } from "@/utils/file";
import Annotation from "@/ManifestClasses/Annotation";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import {
  createDefaultContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";
import CreateBar from "@/components/shared/createBar/CreateBar";
import ImportMenu from "@/components/shared/importExport/import";
import ExportMenu from "@/components/shared/importExport/export";

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
  const [githubToken, setGithubToken] = useState<string>(
    localStorage.getItem("githubToken") || ""
  );
  const [gistUrl, setGistUrl] = useState<string | null>(null);
  const [gistRawUrl, setGistRawUrl] = useState<string | null>(null);
  const [gistId, setGistId] = useState<string | null>(null);
  const [isCreatingGist, setIsCreatingGist] = useState(false);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showTokenWarning, setShowTokenWarning] = useState(
    githubToken.length === 0
  );
  const [gistBaseName, setGistBaseName] = useState("manifest");
  const [gistImportUrl, setGistImportUrl] = useState("");
  const [isImportingGist, setIsImportingGist] = useState(false);
  const gistFilename = `${gistBaseName}.json`;
  const resizeStateRef = useRef<ResizeState | null>(null);
  const contentResourceModalSnapshotRef =
    useRef<ContentResourceModalSnapshot | null>(null);
  const { manifestObj, updateManifestObj, setManifestObj } =
    useContext(manifestObjContext);

  const serializedManifest = useMemo(
    () => serializeManifestForExport(manifestObj),
    [manifestObj],
  );

  const manifestPreview = serializedManifest;

  const liveViewerManifestUrl = useMemo(
    () =>
      `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(serializedManifest, null, 2),
      )}`,
    [serializedManifest],
  );
  const [voyagerUrl, setVoyagerUrl] = useState(liveViewerManifestUrl);

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
    annotation.setContentResource(
      createDefaultContentResource(type, nextAnnotationIndex),
    );

    if (type === "Light" || type === "Camera") {
      annotation.ensureSpatialTarget();
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

  async function handleCreateGist(): Promise<void> {
    if (!githubToken) {
      alert("Please enter your GitHub token to create a gist.");
      setShowTokenWarning(true);
      return;
    }

    setIsCreatingGist(true);
    setGistUrl(null);

    try {
      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "IIIF Manifest exported from Manifest Editor",
          public: true,
          files: {
            [gistFilename]: {
              content: JSON.stringify(serializedManifest, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `GitHub API error: ${response.status}`
        );
      }

      const data = await response.json();
      setGistId(data.id);
      setGistUrl(data.html_url);
      setGistRawUrl(data.files[gistFilename].raw_url);
    } catch (error) {
      console.error("Failed to create gist:", error);
      alert(
        error instanceof Error
          ? `Failed to create gist: ${error.message}`
          : "Failed to create gist. Check your token and try again."
      );
    } finally {
      setIsCreatingGist(false);
    }
  }

  function applyUploadedManifest(nextManifest: ManifestObject): void {
    const parsedManifest = createManifestObjectFromUpload(nextManifest);

    if (parsedManifest.getLabelValue().trim() === "Blank Manifest") {
      parsedManifest.setLabel("");
    }

    setManifestObj(parsedManifest);
  }

  function extractGistId(inputValue: string): string | null {
    const value = inputValue.trim();

    if (!value) {
      return null;
    }

    if (/^[a-f0-9]{20,}$/i.test(value)) {
      return value;
    }

    try {
      const parsed = new URL(value);
      const pathParts = parsed.pathname.split("/").filter(Boolean);

      if (parsed.hostname === "gist.github.com" && pathParts.length >= 2) {
        return pathParts[1];
      }

      if (
        parsed.hostname === "gist.githubusercontent.com" &&
        pathParts.length >= 2
      ) {
        return pathParts[1];
      }
    } catch {
      return null;
    }

    return null;
  }

  async function handleUploadManifest(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const uploadedManifest = event.target.files?.[0] ?? null;

    if (!uploadedManifest) {
      return;
    }

    try {
      const stringManifest = await uploadedManifest.text();
      const nextManifest = JSON.parse(stringManifest);
      applyUploadedManifest(nextManifest);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Failed to upload manifest:", error);
      alert("Failed to upload manifest. Please upload a valid JSON file.");
    } finally {
      event.target.value = "";
    }
  }

  async function handleUploadManifestFromGist(): Promise<void> {
    const gistIdentifier = extractGistId(gistImportUrl);

    if (!gistIdentifier) {
      alert("Enter a valid GitHub gist URL, raw gist URL, or gist ID.");
      return;
    }

    setIsImportingGist(true);

    try {
      const gistResponse = await fetch(`https://api.github.com/gists/${gistIdentifier}`);

      if (!gistResponse.ok) {
        throw new Error(`GitHub API error: ${gistResponse.status}`);
      }

      const gistData = await gistResponse.json();
      const fileEntries = Object.values(gistData.files ?? {}) as Array<{
        filename?: string;
        raw_url?: string;
        content?: string;
      }>;

      if (!fileEntries.length) {
        throw new Error("This gist has no files.");
      }

      const manifestFile =
        fileEntries.find((entry) =>
          (entry.filename ?? "").toLowerCase().endsWith(".json")
        ) ?? fileEntries[0];

      let manifestText = manifestFile.content;

      if (!manifestText && manifestFile.raw_url) {
        const rawResponse = await fetch(manifestFile.raw_url);

        if (!rawResponse.ok) {
          throw new Error(`Unable to fetch gist file content (${rawResponse.status}).`);
        }

        manifestText = await rawResponse.text();
      }

      if (!manifestText) {
        throw new Error("Unable to load gist file content.");
      }

      const nextManifest = JSON.parse(manifestText);
      applyUploadedManifest(nextManifest);

      setGistId(gistData.id ?? gistIdentifier);
      setGistUrl(gistData.html_url ?? null);
      setGistRawUrl(manifestFile.raw_url ?? null);
      setGistImportUrl("");
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Failed to import gist:", error);
      alert(
        error instanceof Error
          ? `Failed to import gist: ${error.message}`
          : "Failed to import gist. Check the link and try again."
      );
    } finally {
      setIsImportingGist(false);
    }
  }

  function handleDownloadManifest(): void {
  downloadJsonFile(serializedManifest, "manifest");
}

  async function handleUpdateGist(): Promise<void> {
    if (!githubToken) {
      alert("Please enter your GitHub token to update the gist.");
      setShowTokenWarning(true);
      return;
    }

    if (!gistId) {
      alert("No existing gist to update. Create one first.");
      return;
    }

    if (isCreatingGist) {
      return;
    }

    setIsCreatingGist(true);

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [gistFilename]: {
              content: JSON.stringify(serializedManifest, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `GitHub API error: ${response.status}`
        );
      }

      const data = await response.json();
      setGistUrl(data.html_url);
      setGistRawUrl(data.files[gistFilename].raw_url);
    } catch (error) {
      console.error("Failed to update gist:", error);
      alert(
        error instanceof Error
          ? `Failed to update gist: ${error.message}`
          : "Failed to update gist. Check your token and try again."
      );
    } finally {
      setIsCreatingGist(false);
    }
  }

  useEffect(() => {
    if (!isAutoUpdateEnabled || !gistId) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void handleUpdateGist();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoUpdateEnabled, gistId, githubToken, manifestObj]);

  function handleClearToken(): void {
    setGithubToken("");
    localStorage.removeItem("githubToken");
    setGistUrl(null);
    setGistRawUrl(null);
    setGistId(null);
    setIsAutoUpdateEnabled(false);
    setShowTokenWarning(true);
  }

  function handleExportButtonClick(): void {
    setIsExportModalOpen(true);

    if (isAutoUpdateEnabled && gistId) {
      void handleUpdateGist();
    }
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
        
        {/* Export Modal */}
        {isImportModalOpen && (
          <ImportMenu
            setIsImportModalOpen={setIsImportModalOpen}
            handleUploadManifest={handleUploadManifest}
            gistImportUrl={gistImportUrl}
            setGistImportUrl={setGistImportUrl}
            handleUploadManifestFromGist={handleUploadManifestFromGist}
            isImportingGist={isImportingGist}
          />
        )}

        {isExportModalOpen && (
          <ExportMenu
            setIsExportModalOpen={setIsExportModalOpen}
            handleDownloadManifest={handleDownloadManifest}
            githubToken={githubToken}
            setGithubToken={setGithubToken}
            setShowTokenWarning={setShowTokenWarning}
            gistBaseName={gistBaseName}
            setGistBaseName={setGistBaseName}
            handleCreateGist={handleCreateGist}
            isCreatingGist={isCreatingGist}
            isAutoUpdateEnabled={isAutoUpdateEnabled}
            handleClearToken={handleClearToken}
            gistId={gistId}
            gistRawUrl={gistRawUrl}
            setIsAutoUpdateEnabled={setIsAutoUpdateEnabled}
            gistUrl={gistUrl}
          />
        )}
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
          onImportClick={() => setIsImportModalOpen(true)}
          onExportClick={handleExportButtonClick}
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
