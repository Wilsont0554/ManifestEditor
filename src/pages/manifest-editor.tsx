import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  ChangeEvent,
} from "react";
import { JsonEditor } from "json-edit-react";
import ContentResourceModal, {
  type ContentResourceModalView,
} from "@components/editors/manifest/content-resource-modal";
import ManifestComponent from "@components/editors/manifest";
import type { ManifestTabId } from "@components/editors/manifest/manifest-component-constants";
import { manifestObjContext } from "@/context/manifest-context";
import Button from "@components/shared/button";
import { downloadJsonFile, createManifestObjectFromUpload  } from "@/utils/file";
import Annotation from "@/ManifestClasses/Annotation";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import { manifestViewingDirections, type IiifContainerType } from "@/types/iiif";
import {
  createDefaultContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";

const DEFAULT_INSPECTOR_WIDTH = 720;
const MIN_INSPECTOR_WIDTH = 320;
const MAX_INSPECTOR_WIDTH = 860;
const INSPECTOR_DOCK_GUTTER = 40;
type ContainerType = IiifContainerType;

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
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isJSONWindowOpen, setIsJSONWindowOpen] = useState(true);

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
  const manifestPreview = JSON.parse(JSON.stringify(manifestObj)) as object;
  const liveViewerManifestUrl = useMemo(
    () =>
      `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(manifestObj, null, 2),
      )}`,
    [manifestObj],
  );

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js"
    scriptTag.addEventListener('load', () => setIsInspectorOpen(!isInspectorOpen));
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

    if (type === "Light") {
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
              content: JSON.stringify(manifestObj, null, 2),
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
    downloadJsonFile(manifestObj, "manifest");
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
              content: JSON.stringify(manifestObj, null, 2),
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
        <div className="mr-auto max-w-245 space-y-4 pb-6">
          {/* GitHub Token Security Warning */}
          {showTokenWarning && githubToken.length === 0 && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900">
                    ⚠️ GitHub Token Required for Gists
                  </p>
                  <p className="mt-1 text-xs text-yellow-800">
                    To create a gist, you need a GitHub personal access token with
                    "gist" scope. This token is stored temporarily in your browser
                    and never sent anywhere except to GitHub's API.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-yellow-900 underline hover:text-yellow-700"
                    >
                      Create Token on GitHub
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowTokenWarning(false)}
                      className="text-xs text-yellow-700 hover:text-yellow-900"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="cursor-pointer text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
                type="button"
                onClick={handleDownloadManifest}
              >
                Download JSON
              </button>

              <button
                className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                title="Import manifest from file or GitHub Gist"
              >
                Import
              </button>

              <button
                className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                type="button"
                onClick={handleExportButtonClick}
                title="Export manifest to GitHub Gist"
              >
                Export
              </button>
              {isAutoUpdateEnabled && gistId && (
                <span className="w-full text-xs text-slate-500">
                  Auto-Update enabled
                </span>
              )}

              <label htmlFor="container-type" className="sr-only">
                Container Type
              </label>

              <select
                id="container-type"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                value={manifestObj.getContainerObj().getType() as ContainerType}
                onChange={(e) => onContainerTypeChange(e.target.value as ContainerType)}
              >
                <option value="Canvas">Canvas</option>
                <option value="Scene">Scene</option>
                <option value="Timeline">Timeline</option>
              </select>

              <Button
                type="button"
                onClick={handleOpenContentResourceModal}
              >
                Add Content Resource
              </Button>

              <Button
                type="button"
                onClick={handleCreateTextAnnotation}
              >
                Add Text Annotation
              </Button>

              <Button 
                className="!bg-white round !text-slate-900 ring-1 ring-slate-300 hover:!bg-slate-100"
                onClick={() => {setIsJSONWindowOpen(!isJSONWindowOpen)}}
              >
                JSON Preview
              </Button>
              
            </div>
          </div>
          
        </div>
        <div className="mainWindow overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
           
          <div className="voyagerWindow">
            <voyager-explorer
              key={liveViewerManifestUrl}
              document={liveViewerManifestUrl}
              id="voyager"
              style={{ width: "500px", height: "500px" }}
            ></voyager-explorer>
          </div>

          <div className="jsonWindow">
              {isJSONWindowOpen ? (
                <JsonEditor data={manifestPreview} />
              ) : (null)}
          </div>
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
