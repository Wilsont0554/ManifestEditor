import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useContext,
  useMemo,
  type ChangeEvent,
} from "react";
import { JsonEditor } from "json-edit-react";
import ContentResourceModal, {
  type ContentResourceModalView,
} from "@components/editors/manifest/content-resource-modal";
import ManifestComponent from "@components/editors/manifest";
import type { ManifestTabId } from "@components/editors/manifest/manifest-component-constants";
import { manifestObjContext } from "@/context/manifest-context";
import {
  createManifestObjectFromUpload,
  downloadJsonFile,
  serializeManifestForExport,
} from "@/utils/file";
import Annotation from "@/ManifestClasses/Annotation";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import { type IiifContainerType } from "@/types/iiif";
import {
  createDefaultContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";

const DEFAULT_INSPECTOR_WIDTH = 560;
const MIN_INSPECTOR_WIDTH = 320;
const MAX_INSPECTOR_WIDTH = 860;
const INSPECTOR_DOCK_GUTTER = 40;
type ContainerType = IiifContainerType;
const containerTypes: ContainerType[] = ["Canvas", "Scene", "Timeline"];
const ASSET_MODAL_TYPES: EditableContentResourceType[] = ["Image", "Model"];
const ENVIRONMENT_MODAL_TYPES: EditableContentResourceType[] = ["Light", "Camera"];

interface ResizeState {
  startX: number;
  startWidth: number;
}

interface ContentResourceModalSnapshot {
  manifestObj: ManifestObject;
  selectedMetadataAnnotationIndex: number;
}

type ToolbarMenuId = "file" | null;

function AssetActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-rose-500"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.3" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.3" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.3" />
      <rect x="14.5" y="14.5" width="6" height="6" rx="1.3" />
    </svg>
  );
}

function EnvironmentActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-rose-500"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z" />
    </svg>
  );
}

function TextAnnotationsActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-rose-500"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7.5h13" />
      <path d="M4 12h9" />
      <path d="M4 16.5h6" />
    </svg>
  );
}

function FileTriggerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-slate-500"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 4.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V6A1.5 1.5 0 0 1 7.5 4.5Z" />
      <path d="M14 4.5V9h4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 text-slate-400"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
    </svg>
  );
}

function DownloadActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-sky-700"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5v9" />
      <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
      <path d="M5 18.5h14" />
    </svg>
  );
}

function ImportActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-emerald-700"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19.5v-9" />
      <path d="m8.5 13.5 3.5-3.5 3.5 3.5" />
      <path d="M5 5.5h14" />
    </svg>
  );
}

function ExportActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-amber-700"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5v9" />
      <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
      <path d="M5 18.5h14" />
      <path d="M16.5 4.5H19A1.5 1.5 0 0 1 20.5 6v12" />
    </svg>
  );
}

function ManifestEditorPage() {
  const [isContentResourceModalOpen, setIsContentResourceModalOpen] =
    useState(false);
  const [contentResourceModalView, setContentResourceModalView] =
    useState<ContentResourceModalView>("picker");
  const [contentResourceModalTypes, setContentResourceModalTypes] =
    useState<EditableContentResourceType[] | undefined>(undefined);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isJSONWindowOpen, setIsJSONWindowOpen] = useState(false);

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
  const [, setShowTokenWarning] = useState(
    githubToken.length === 0
  );
  const [gistBaseName, setGistBaseName] = useState("manifest");
  const [gistImportUrl, setGistImportUrl] = useState("");
  const [isImportingGist, setIsImportingGist] = useState(false);
  const [isQuickStartDismissed, setIsQuickStartDismissed] = useState(false);
  const [openToolbarMenu, setOpenToolbarMenu] = useState<ToolbarMenuId>(null);
  const gistFilename = `${gistBaseName}.json`;
  const resizeStateRef = useRef<ResizeState | null>(null);
  const toolbarMenuRef = useRef<HTMLDivElement | null>(null);
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

  function onContainerTypeChange(newType: ContainerType): void {
    manifestObj.getContainerObj().setType(newType);
    updateManifestObj();
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
    setContentResourceModalTypes(undefined);
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
  }

  function handleOpenAssetModal(): void {
    captureContentResourceModalSnapshot();
    setContentResourceModalTypes(ASSET_MODAL_TYPES);
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
  }

  function handleOpenEnvironmentModal(): void {
    captureContentResourceModalSnapshot();
    setContentResourceModalTypes(ENVIRONMENT_MODAL_TYPES);
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
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

  const handleAutoUpdateGist = useEffectEvent(() => {
    void handleUpdateGist();
  });

  useEffect(() => {
    if (!isAutoUpdateEnabled || !gistId) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      handleAutoUpdateGist();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoUpdateEnabled, gistId]);

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

  function handleToolbarMenuToggle(menuId: Exclude<ToolbarMenuId, null>): void {
    setOpenToolbarMenu((currentMenu) => (currentMenu === menuId ? null : menuId));
  }

  const container = manifestObj.getContainerObj();
  const annotationPage = container.getAnnotationPage();
  const manifestLabel = manifestObj.getLabelValue().trim();
  const manifestTitle =
    manifestLabel.length > 0 ? manifestLabel : "Untitled Manifest";
  const pageTitle = "Workspace";
  const toolbarButtonClassName =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300";
  const toolbarMenuPanelClassName =
    "absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]";
  const toolbarMenuItemClassName =
    "flex w-full items-start gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-slate-50";
  const hasStageContent = annotationPage.getAllAnnotations().length > 0;

  useEffect(() => {
    if (hasStageContent) {
      setIsQuickStartDismissed(false);
    }
  }, [hasStageContent]);

  useEffect(() => {
    function handleToolbarMenuPointerDown(event: MouseEvent): void {
      if (
        toolbarMenuRef.current &&
        !toolbarMenuRef.current.contains(event.target as Node)
      ) {
        setOpenToolbarMenu(null);
      }
    }

    function handleToolbarMenuEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpenToolbarMenu(null);
      }
    }

    window.addEventListener("mousedown", handleToolbarMenuPointerDown);
    window.addEventListener("keydown", handleToolbarMenuEscape);

    return () => {
      window.removeEventListener("mousedown", handleToolbarMenuPointerDown);
      window.removeEventListener("keydown", handleToolbarMenuEscape);
    };
  }, []);

  const inspectorDockPadding = isInspectorOpen
    ? `clamp(0px, calc(100vw - 360px), calc(${inspectorWidth}px + ${INSPECTOR_DOCK_GUTTER}px))`
    : undefined;

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
        style={{
          paddingRight: inspectorDockPadding,
        }}
      >
        <div className="mx-auto max-w-[1600px] space-y-5 pb-6">
          <section className="overflow-visible rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div
              ref={toolbarMenuRef}
              className="p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-2xl font-semibold uppercase tracking-[0.22em] text-slate-600 sm:text-3xl">
                  {pageTitle}
                </h1>

                <div className="relative">
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                    type="button"
                    onClick={() => handleToolbarMenuToggle("file")}
                    aria-expanded={openToolbarMenu === "file"}
                    aria-haspopup="menu"
                  >
                    <FileTriggerIcon />
                    File
                    <ChevronDownIcon />
                  </button>

                  {openToolbarMenu === "file" ? (
                    <div className={toolbarMenuPanelClassName}>
                      <div className="px-3 pb-2 pt-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Project
                        </p>
                      </div>
                      <button
                        type="button"
                        className={toolbarMenuItemClassName}
                        onClick={() => {
                          handleDownloadManifest();
                          setOpenToolbarMenu(null);
                        }}
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
                          <DownloadActionIcon />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-slate-950">
                            Download JSON
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            Save the current manifest locally.
                          </span>
                        </span>
                      </button>

                      <div className="mx-3 my-2 h-px bg-slate-100" />
                      <div className="px-3 pb-2 pt-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Transfer
                        </p>
                      </div>
                      <button
                        type="button"
                        className={toolbarMenuItemClassName}
                        onClick={() => {
                          setIsImportModalOpen(true);
                          setOpenToolbarMenu(null);
                        }}
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                          <ImportActionIcon />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-slate-950">
                            Import
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            Load a manifest from JSON or GitHub Gist.
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className={toolbarMenuItemClassName}
                        onClick={() => {
                          handleExportButtonClick();
                          setOpenToolbarMenu(null);
                        }}
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                          <ExportActionIcon />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-slate-950">
                            Export
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            Send the manifest out to download or GitHub.
                          </span>
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-center">
                <div className="flex flex-wrap items-center gap-2.5">
                  <label htmlFor="container-type" className="sr-only">
                    Container Type
                  </label>
                  <div className="inline-flex flex-wrap gap-1 rounded-[24px] border border-slate-200 bg-white p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                    {containerTypes.map((containerType) => {
                      const isActive = container.getType() === containerType;

                      return (
                        <button
                          key={containerType}
                          id={containerType === "Canvas" ? "container-type" : undefined}
                          type="button"
                          className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                            isActive
                              ? "bg-rose-500 text-white shadow-[0_8px_18px_rgba(244,63,94,0.28)]"
                              : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                          }`}
                          onClick={() => onContainerTypeChange(containerType)}
                          aria-pressed={isActive}
                        >
                          {containerType}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <button
                    type="button"
                    className="group rounded-[22px] border border-rose-200 bg-rose-50/70 px-5 py-4 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:shadow-[0_14px_28px_rgba(244,63,94,0.14)]"
                    onClick={handleOpenAssetModal}
                  >
                    <span className="flex items-center gap-2.5">
                      <AssetActionIcon />
                      <span className="text-sm font-semibold text-rose-950">
                        Asset
                      </span>
                    </span>
                    <span className="mt-2 block text-xs text-rose-700/80">
                      Add image or model
                    </span>
                  </button>

                  <button
                    type="button"
                    className="group rounded-[22px] border border-rose-200 bg-rose-50/70 px-5 py-4 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:shadow-[0_14px_28px_rgba(244,63,94,0.14)]"
                    onClick={handleOpenEnvironmentModal}
                  >
                    <span className="flex items-center gap-2.5">
                      <EnvironmentActionIcon />
                      <span className="text-sm font-semibold text-rose-950">
                        Environment
                      </span>
                    </span>
                    <span className="mt-2 block text-xs text-rose-700/80">
                      Add light or camera
                    </span>
                  </button>

                  <button
                    type="button"
                    className="group rounded-[22px] border border-rose-200 bg-rose-50/70 px-5 py-4 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:shadow-[0_14px_28px_rgba(244,63,94,0.14)]"
                    onClick={handleCreateTextAnnotation}
                  >
                    <span className="flex items-center gap-2.5">
                      <TextAnnotationsActionIcon />
                      <span className="text-sm font-semibold text-rose-950">
                        Text Annotations
                      </span>
                    </span>
                    <span className="mt-2 block text-xs text-rose-700/80">
                      Write annotation content
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
              <h2 className="text-2xl font-semibold uppercase tracking-[0.22em] text-slate-600">
                Voyager Stage
              </h2>
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-2 pb-3 text-sm text-slate-300">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white">
                      {manifestTitle}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">
                      {container.getType()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-white transition hover:bg-white/15"
                      type="button"
                      onClick={() =>
                        setIsJSONWindowOpen((currentValue) => !currentValue)
                      }
                    >
                      {isJSONWindowOpen ? "Close JSON" : "Open JSON"}
                    </button>
                    <button
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-white transition hover:bg-white/15"
                      type="button"
                      onClick={() =>
                        setIsInspectorOpen((currentValue) => !currentValue)
                      }
                    >
                      {isInspectorOpen ? "Hide editor" : "Show editor"}
                    </button>
                  </div>
                </div>

                <div className="relative mt-3 min-h-[clamp(32rem,72vh,52rem)] overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(51,65,85,0.9),_rgba(2,6,23,0.98))]">
                  {!hasStageContent && !isQuickStartDismissed ? (
                    <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-sm rounded-[24px] border border-white/10 bg-slate-950/70 p-5 shadow-xl backdrop-blur">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">
                          Quick Start
                        </p>
                        <button
                          type="button"
                          className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
                          onClick={() => setIsQuickStartDismissed(true)}
                          aria-label="Dismiss quick start"
                          title="Close"
                        >
                          &times;
                        </button>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                        Build out the first scene
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Add a content resource to anchor the stage, or drop in a text
                        annotation to test positioning and metadata flows.
                      </p>
                      <div className="pointer-events-auto mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
                          onClick={handleOpenContentResourceModal}
                        >
                          Add resource
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                          onClick={handleCreateTextAnnotation}
                        >
                          Add text annotation
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="absolute inset-0">
                    <voyager-explorer
                      prompt="false"
                      key={voyagerUrl}
                      document={voyagerUrl}
                      id="voyager"
                      style={{ width: "100%", height: "100%" }}
                    ></voyager-explorer>
                  </div>

                  {isJSONWindowOpen ? (
                    <div className="absolute inset-0 z-20 bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-4">
                      <section className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/95 shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">
                              Manifest JSON
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-slate-950">
                              In-stage preview
                            </h3>
                          </div>

                          <button
                            className={toolbarButtonClassName}
                            type="button"
                            onClick={() => setIsJSONWindowOpen(false)}
                          >
                            Hide JSON
                          </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
                          <JsonEditor data={manifestPreview} />
                        </div>
                      </section>
                    </div>
                  ) : null}

                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Export Modal */}
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg max-w-md w-full mx-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Import Manifest
                </h2>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-2xl leading-none text-slate-500 hover:text-slate-700"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-700">
                    Upload Manifest File
                  </p>
                  <div className="rounded-md border border-slate-300 bg-white px-3 py-2">
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleUploadManifest}
                      className="w-full text-sm text-slate-700"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <label
                    htmlFor="gist-import-url"
                    className="mb-2 block text-xs font-medium text-slate-700"
                  >
                    Import from GitHub Gist
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      id="gist-import-url"
                      type="text"
                      placeholder="Paste gist URL or gist ID"
                      value={gistImportUrl}
                      onChange={(event) => setGistImportUrl(event.target.value)}
                      className="min-w-65 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                    />
                    <button
                      type="button"
                      className="cursor-pointer rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => void handleUploadManifestFromGist()}
                      disabled={isImportingGist || !gistImportUrl.trim()}
                    >
                      {isImportingGist ? "Importing..." : "Import Gist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg max-w-sm w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Export to GitHub Gist
                </h2>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="export-token" className="block text-xs font-medium text-slate-700 mb-2">
                    GitHub Token
                  </label>
                  <input
                    id="export-token"
                    type="password"
                    placeholder="Enter your GitHub token"
                    value={githubToken}
                    onChange={(e) => {
                      setGithubToken(e.target.value);
                      localStorage.setItem("githubToken", e.target.value);
                      setShowTokenWarning(false);
                    }}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                    title="Your GitHub personal access token (not saved permanently)"
                  />
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline hover:text-blue-800 mt-1 inline-block"
                    title="Open GitHub token settings page"
                  >
                    Get Token
                  </a>
                </div>

                <div>
                  <label htmlFor="export-filename" className="block text-xs font-medium text-slate-700 mb-2">
                    Filename
                  </label>
                  <div className="flex">
                    <input
                      id="export-filename"
                      type="text"
                      placeholder="manifest"
                      value={gistBaseName}
                      onChange={(e) => setGistBaseName(e.target.value)}
                      className="flex-1 rounded-l-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                      title="Name of the file in the gist"
                    />
                    <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      .json
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="flex-1 cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleCreateGist}
                    disabled={!githubToken || isCreatingGist || isAutoUpdateEnabled}
                    title="Create and share manifest as a GitHub gist"
                  >
                    {isCreatingGist ? "Creating..." : "Create Gist"}
                  </button>
                  {githubToken && (
                    <button
                      className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                      type="button"
                      onClick={handleClearToken}
                      title="Clear stored token from browser"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {gistId && (
                  <div className="flex items-center gap-2">
                    <input
                      id="auto-update"
                      type="checkbox"
                      checked={isAutoUpdateEnabled}
                      onChange={(e) => setIsAutoUpdateEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="auto-update" className="text-sm text-slate-700">
                      Auto-update every 30 seconds and when Export is clicked again
                    </label>
                  </div>
                )}

                {gistRawUrl && (
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div>
                      <a
                        href={gistUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        title="View gist on GitHub"
                      >
                        View Gist
                      </a>
                      <p className="text-xs text-slate-500 mt-1 break-all">{gistUrl}</p>
                    </div>
                    <div>
                      <a
                        href={gistRawUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        title="View raw manifest JSON"
                      >
                        View RAW
                      </a>
                      <p className="text-xs text-slate-500 mt-1 break-all">{gistRawUrl}</p>
                    </div>
                    <div>
                      <a
                        href={`https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=${encodeURIComponent(gistRawUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        title="View manifest in Voyager"
                      >
                        View in Voyager
                      </a>
                      <p className="text-xs text-slate-500 mt-1 break-all">{`https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=${encodeURIComponent(gistRawUrl)}`}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
