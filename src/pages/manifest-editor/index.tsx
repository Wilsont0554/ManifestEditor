import {
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { JsonEditor } from "json-edit-react";
import ManifestComponent from "../../components/editors/manifest";
import Button from "../../components/shared/button";
import type ContentResource from "./manifest/ContentResource";
import type ManifestObject from "./manifest/ManifestObject";

const DEFAULT_INSPECTOR_WIDTH = 720;
const MIN_INSPECTOR_WIDTH = 320;
const MAX_INSPECTOR_WIDTH = 860;
const INSPECTOR_DOCK_SPACE = 760;

type ContainerType = "Canvas" | "Scene";
type CountSetter = Dispatch<SetStateAction<number>>;

interface ResizeState {
  startX: number;
  startWidth: number;
}

interface ManifestEditorPageProps {
  setCount: CountSetter;
  containerType: ContainerType;
  onContainerTypeChange: (nextType: ContainerType) => void;
  onAddContentResource: () => void;
  onDownloadManifest: () => void;
  contentResources: ContentResource[];
  manifestObj: ManifestObject;
}

function ManifestEditorPage({
  setCount,
  containerType,
  onContainerTypeChange,
  onAddContentResource,
  onDownloadManifest,
  contentResources,
  manifestObj,
}: ManifestEditorPageProps) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [inspectorWidth, setInspectorWidth] = useState(DEFAULT_INSPECTOR_WIDTH);
  const resizeStateRef = useRef<ResizeState | null>(null);

  useEffect(() => {
    function handlePointerMove(event: MouseEvent): void {
      if (!resizeStateRef.current) {
        return;
      }

      const { startX, startWidth } = resizeStateRef.current;
      const maxWidthFromViewport = Math.max(MIN_INSPECTOR_WIDTH, window.innerWidth - 80);
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

  return (
    <section className="relative min-h-[calc(100vh-76px)] w-full overflow-hidden border-t border-slate-200 bg-slate-100">
      <div
        className="w-full px-4 py-6 sm:px-6 lg:px-8"
        style={{
          paddingRight: isInspectorOpen ? `clamp(0px, calc(100vw - 360px), ${INSPECTOR_DOCK_SPACE}px)` : undefined,
        }}
      >
        <div className="mr-auto max-w-[980px] space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="cursor-pointer text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
                type="button"
                onClick={onDownloadManifest}
              >
                Download JSON
              </button>

              <label htmlFor="container-type" className="sr-only">
                Container Type
              </label>

              <select
                id="container-type"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                value={containerType}
                onChange={(event) => onContainerTypeChange(event.target.value as ContainerType)}
              >
                <option>Canvas</option>
                <option>Scene</option>
              </select>

              <Button type="button" onClick={onAddContentResource}>
                Add Content Resource
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <JsonEditor data={manifestObj} />
          </div>
        </div>
      </div>

      {isInspectorOpen ? (
        <ManifestComponent
          manifestObj={manifestObj}
          setCount={setCount}
          width={inspectorWidth}
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
