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
import {
  createDefaultContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";

const DEFAULT_INSPECTOR_WIDTH = 720;
const MIN_INSPECTOR_WIDTH = 320;
const MAX_INSPECTOR_WIDTH = 860;
const INSPECTOR_DOCK_SPACE = 760;
type ContainerType = "canvas" | "scene" | "timeline";

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
  const resizeStateRef = useRef<ResizeState | null>(null);
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const manifestPreview = JSON.parse(JSON.stringify(manifestObj)) as object;

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
    annotation.setContentResource(createDefaultContentResource(type));

    if (type === "Light") {
      annotation.ensureSpatialTarget();
    }

    annotationPage.addAnnotation(annotation);

    setSelectedMetadataAnnotationIndex(nextAnnotationIndex);
    setContentResourceModalView("editor");
    updateManifestObj(manifestObj.clone());
  }

  function handleDownloadManifest(): void {
    downloadJsonFile(manifestObj, "manifest");
  }

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
          paddingRight: isInspectorOpen
            ? `clamp(0px, calc(100vw - 360px), ${INSPECTOR_DOCK_SPACE}px)`
            : undefined,
        }}
      >
        <div className="mr-auto max-w-245 space-y-4 pb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="cursor-pointer text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
                type="button"
                onClick={handleDownloadManifest}
              >
                Download JSON
              </button>
              <label htmlFor="container-type" className="sr-only">
                Container Type
              </label>

              <select
                id="container-type"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                value={manifestObj.getContainerObj().getType() as ContainerType}
                onChange={(e) => onContainerTypeChange(e.target.value as ContainerType)}
              >
                <option value="canvas">Canvas</option>
                <option value="scene">Scene</option>
                <option value="timeline">Timeline</option>
              </select>

              <Button
                type="button"
                onClick={handleOpenContentResourceModal}
              >
                Add Content Resource
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <JsonEditor data={manifestPreview} />
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
