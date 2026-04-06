import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { JsonEditor } from "json-edit-react";
import ContentResourceModal, {
  type ContentResourceModalView,
} from "@components/editors/manifest/content-resource-modal";
import ManifestComponent from "@components/editors/manifest";
import type { ManifestTabId } from "@components/editors/manifest/manifest-component-constants";
import { manifestObjContext } from "@/context/manifest-context";
import Button from "@components/shared/button";
import { downloadJsonFile } from "@/utils/file";
import Annotation from "@/ManifestClasses/Annotation";
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

function ManifestEditorPage() {
  const [isContentResourceModalOpen, setIsContentResourceModalOpen] =
    useState(false);
  const [contentResourceModalView, setContentResourceModalView] =
    useState<ContentResourceModalView>("picker");
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showTokenWarning, setShowTokenWarning] = useState(
    githubToken.length === 0
  );
  const resizeStateRef = useRef<ResizeState | null>(null);
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const manifestPreview = JSON.parse(JSON.stringify(manifestObj)) as object;
  const [blobTEST, setBlobTEST] = useState("");

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js" //"https://3d-api.si.edu/resources/js/voyager-explorer.min.js";
    scriptTag.addEventListener('load', () => setIsInspectorOpen(!isInspectorOpen));
    document.body.appendChild(scriptTag);
  }, []);
  
 function createBlob(){
    const temp3dmanifest = {
  "@context": "http://iiif.io/api/presentation/4/context.json",
  "id": "https://example.org/iiif/manifest/1",
  "type": "Manifest",
  "label": {
    "en": [
      "Blank Manifest"
    ]
  },
  "items": [
    {
      "id": "https://example.org/iiif/manifest/1/scene/1",
      "type": "Scene",
      "items": [
        {
          "id": "https://example.org/iiif/manifest/1/scene/1/page/1",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/1",
              "type": "Annotation",
              "motivation": [
                "painting"
              ],
              "body": {
                "id": "https://raw.githubusercontent.com/IIIF/3d/main/assets/whale/whale_cranium.glb",
                "type": "Model",
                "format": "model/gltf-binary",
                "metadata": [
                  {
                    "label": {
                      "en": [
                        "Whale Skeleton Part"
                      ]
                    },
                    "value": {
                      "en": [
                        "Cranium"
                      ]
                    }
                  }
                ]
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/1/target",
                "type": "SpecificResource",
                "source": [
                  {
                    "id": "https://example.org/iiif/manifest/1/scene/1",
                    "type": "Scene"
                  }
                ],
                "selector": [
                  {
                    "type": "PointSelector",
                    "x": 0,
                    "y": 0.1,
                    "z": 0
                  }
                ]
              }
            },
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/2",
              "type": "Annotation",
              "motivation": [
                "painting"
              ],
              "body": {
                "id": "https://raw.githubusercontent.com/IIIF/3d/main/assets/whale/whale_mandible.glb",
                "type": "Model",
                "format": "model/gltf-binary",
                "metadata": [
                  {
                    "label": {
                      "en": [
                        "Whale Skeleton Part"
                      ]
                    },
                    "value": {
                      "en": [
                        "Mandible"
                      ]
                    }
                  }
                ]
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1",
                "type": "Scene"
              }
            },
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/3",
              "type": "Annotation",
              "motivation": [
                "painting"
              ],
              "body": {
                "id": "https://example.org/iiif/manifest/1/scene/1/lights/1",
                "type": "AmbientLight",
                "color": "#1445c7",
                "intensity": {
                  "type": "Value",
                  "value": 0.5,
                  "unit": "relative"
                }
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/3/target",
                "type": "SpecificResource",
                "source": [
                  {
                    "id": "https://example.org/iiif/manifest/1/scene/1",
                    "type": "Scene"
                  }
                ],
                "selector": [
                  {
                    "type": "PointSelector",
                    "x": 0,
                    "y": 0,
                    "z": 0
                  }
                ]
              }
            },
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/4",
              "type": "Annotation",
              "motivation": [
                "painting"
              ],
              "body": {
                "id": "https://example.org/iiif/manifest/1/scene/1/lights/2",
                "type": "SpotLight",
                "color": "#fefbe2",
                "intensity": {
                  "type": "Value",
                  "value": 0.8,
                  "unit": "relative"
                },
                "angle": 45
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/4/target",
                "type": "SpecificResource",
                "source": [
                  {
                    "id": "https://example.org/iiif/manifest/1/scene/1",
                    "type": "Scene"
                  }
                ],
                "selector": [
                  {
                    "type": "PointSelector",
                    "x": -0.2,
                    "y": 3,
                    "z": 1
                  }
                ]
              }
            },
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/5",
              "type": "Annotation",
              "motivation": [
                "painting"
              ],
              "body": {
                "id": "https://example.org/iiif/manifest/1/scene/1/cameras/1",
                "type": "PerspectiveCamera",
                "near": 0.1,
                "far": 100,
                "fieldOfView": 55
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/5/target",
                "type": "SpecificResource",
                "source": [
                  {
                    "id": "https://example.org/iiif/manifest/1/scene/1",
                    "type": "Scene"
                  }
                ],
                "selector": [
                  {
                    "type": "PointSelector",
                    "x": -0.5,
                    "y": 0.5,
                    "z": 2
                  }
                ]
              }
            },
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/6",
              "type": "Annotation",
              "motivation": [
                "commenting"
              ],
              "body": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/6/body",
                "type": "TextualBody",
                "value": "Cranium",
                "format": "text/plain",
                "language": "en",
                "purpose": "commenting"
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/6/position",
                "type": "SpecificResource",
                "source": [
                  {
                    "id": "https://example.org/iiif/manifest/1/scene/1",
                    "type": "Scene"
                  }
                ],
                "selector": [
                  {
                    "type": "PointSelector",
                    "x": 0,
                    "y": 0.1,
                    "z": 0
                  }
                ]
              },
              "label": {
                "en": [
                  "Cranium"
                ]
              }
            },
            {
              "id": "https://example.org/iiif/manifest/1/scene/1/anno/7",
              "type": "Annotation",
              "motivation": [
                "commenting"
              ],
              "body": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/7/body",
                "type": "TextualBody",
                "value": "Mandible",
                "format": "text/plain",
                "language": "en",
                "purpose": "commenting"
              },
              "target": {
                "id": "https://example.org/iiif/manifest/1/scene/1/anno/7/position",
                "type": "SpecificResource",
                "source": [
                  {
                    "id": "https://example.org/iiif/manifest/1/scene/1",
                    "type": "Scene"
                  }
                ],
                "selector": [
                  {
                    "type": "PointSelector",
                    "x": 0,
                    "y": 0,
                    "z": 0
                  }
                ]
              },
              "label": {
                "en": [
                  "Mandible"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
    }
    const temp = new Blob([JSON.stringify(temp3dmanifest, null, 2)], {
      type: "application/json",
    });
    setBlobTEST(URL.createObjectURL(temp));
    console.log(blobTEST);
  }  

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
    updateManifestObj(manifestObj.clone());
  }

  function handleOpenContentResourceModal(): void {
    setContentResourceModalView("picker");
    setIsContentResourceModalOpen(true);
  }

  function handleCloseContentResourceModal(): void {
    setIsContentResourceModalOpen(false);
    setContentResourceModalView("picker");
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
    updateManifestObj(manifestObj.clone());
  }

  function handleCreateTextAnnotation(): void {
    const annotationPage = manifestObj.getContainerObj().getAnnotationPage();
    const nextAnnotationIndex = annotationPage.getAllAnnotations().length;
    const annotation = new TextAnnotation(nextAnnotationIndex + 1);

    annotationPage.addAnnotation(annotation);

    setSelectedMetadataAnnotationIndex(nextAnnotationIndex);
    setContentResourceModalView("editor");
    setIsContentResourceModalOpen(true);
    updateManifestObj(manifestObj.clone());
  }

  function handleDownloadManifest(): void {
    downloadJsonFile(manifestObj, "manifest");
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
            "manifest.json": {
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
      setGistRawUrl(data.files["manifest.json"].raw_url);
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
            "manifest.json": {
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
      setGistRawUrl(data.files["manifest.json"].raw_url);
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
        onClose={handleCloseContentResourceModal}
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
                className="!bg-white !text-slate-900 ring-1 ring-slate-300 hover:!bg-slate-100"
                onClick={handleCreateTextAnnotation}
              >
                Add Text Annotation
              </Button>
              
            </div>
          </div>
          
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
           
          <JsonEditor data={manifestPreview} />
          
        </div>
                  <button onClick={createBlob}>Preview</button>

        <div style={{width: "500px", position: "relative", height: "500px"}}>
        <voyager-explorer document={blobTEST} id="voyager" style={{width: "500px", height: "500px"}}></voyager-explorer>
        </div>

        {/* Export Modal */}
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
