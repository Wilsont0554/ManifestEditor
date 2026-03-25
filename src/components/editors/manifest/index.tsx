import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useState,
} from "react";
import {
  MANIFEST_TABS,
  type ManifestTabId,
} from "./manifest-component-constants";
import DescriptiveTab from "./tabs/descriptive-tab";
import LinkingTab from "./tabs/linking-tab";
import MetadataTab from "./tabs/metadata-tab";
import NavPlaceTab from "./tabs/nav-place-tab";
import OverviewTab from "./tabs/overview-tab";
import StructureTab from "./tabs/structure-tab";
import TechnicalTab from "./tabs/technical-tab";

interface ManifestComponentProps {
  width: number;
  activeTab: ManifestTabId;
  onActiveTabChange: (tab: ManifestTabId) => void;
  selectedMetadataAnnotationIndex: number;
  isMetadataEditorOpen: boolean;
  onMetadataEditorOpenChange: (isOpen: boolean) => void;
  onSelectedMetadataAnnotationIndexChange: (index: number) => void;
  onClose: () => void;
  onReset: () => void;
  onResizeStart: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

function ManifestComponent({
  width,
  activeTab,
  onActiveTabChange,
  selectedMetadataAnnotationIndex,
  isMetadataEditorOpen,
  onMetadataEditorOpenChange,
  onSelectedMetadataAnnotationIndexChange,
  onClose,
  onReset,
  onResizeStart,
}: ManifestComponentProps) {
  const [isDividerHovered, setIsDividerHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dividerY, setDividerY] = useState(220);

  let tabContent = <OverviewTab />;

  if (activeTab === "descriptive") {
    tabContent = <DescriptiveTab />;
  }

  if (activeTab === "metadata") {
    tabContent = (
      <MetadataTab
        selectedAnnotationIndex={selectedMetadataAnnotationIndex}
        isEditingMetadata={isMetadataEditorOpen}
        onEditingMetadataChange={onMetadataEditorOpenChange}
        onSelectedAnnotationIndexChange={onSelectedMetadataAnnotationIndexChange}
      />
    );
  }

  if (activeTab === "technical") {
    tabContent = <TechnicalTab />;
  }

  if (activeTab === "linking") {
    tabContent = <LinkingTab />;
  }

  if (activeTab === "structure") {
    tabContent = <StructureTab />;
  }

  if (activeTab === "nav-place") {
    tabContent = <NavPlaceTab />;
  }

  useEffect(() => {
    function handleMouseUp(): void {
      setIsResizing(false);
    }

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function updateDividerPosition(event: ReactMouseEvent<HTMLDivElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextY = Math.min(
      Math.max(event.clientY - rect.top, 88),
      rect.height - 88,
    );
    setDividerY(nextY);
  }

  function handleResizeMouseDown(
    event: ReactMouseEvent<HTMLButtonElement>,
  ): void {
    setIsResizing(true);
    onResizeStart(event);
  }

  const controlsVisible = isDividerHovered || isResizing;

  return (
    <aside
      className="absolute inset-y-0 right-0 z-20 flex h-full border-l border-slate-300 bg-white shadow-[-18px_0_36px_rgba(15,23,42,0.06)]"
      style={{ width: `${width}px`, maxWidth: "calc(100vw - 24px)" }}
    >
      <div
        className="absolute inset-y-0 left-0 w-8 -translate-x-1/2"
        onMouseEnter={(event) => {
          setIsDividerHovered(true);
          updateDividerPosition(event);
        }}
        onMouseMove={updateDividerPosition}
        onMouseLeave={() => {
          if (!isResizing) {
            setIsDividerHovered(false);
          }
        }}
      >
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-300" />
        <button
          type="button"
          className={`absolute left-1/2 inline-flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-base text-rose-600 shadow-sm transition duration-150 hover:border-rose-200 hover:bg-rose-100 ${
            controlsVisible
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          style={{ top: `${Math.max(dividerY - 56, 48)}px` }}
          onClick={onReset}
          aria-label="Reset inspector width"
          title="Reset panel"
        >
          &#8635;
        </button>

        <button
          type="button"
          className={`absolute left-1/2 flex h-14 w-5 -translate-x-1/2 -translate-y-1/2 cursor-col-resize items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition duration-150 hover:border-slate-300 ${
            controlsVisible
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          style={{ top: `${dividerY}px` }}
          onMouseDown={handleResizeMouseDown}
          aria-label="Resize inspector"
          title="Resize panel"
        >
          <span className="h-8 w-1 rounded-full bg-slate-300" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Manifest
          </p>
          <button
            type="button"
            className="text-3xl leading-none text-slate-500 transition hover:text-slate-900"
            onClick={onClose}
            aria-label="Close inspector"
          >
            &times;
          </button>
        </div>

        <div className="border-b border-slate-200 px-4 py-3">
          <div className="manifest-tabs-scroll overflow-x-auto">
            <div className="flex min-w-max gap-1">
              {MANIFEST_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    activeTab === tab.id
                      ? "shrink-0 whitespace-nowrap border-b-2 border-pink-500 px-3 py-2 text-center text-sm font-medium text-slate-950"
                      : "shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-center text-sm font-medium text-slate-400 transition hover:text-slate-700"
                  }
                  onClick={() => onActiveTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="manifest-tabs-scroll manifest-tab-panel-scroll min-h-0 flex-1 overflow-y-scroll px-6 py-5">
          {tabContent}
        </div>
      </div>
    </aside>
  );
}

export default ManifestComponent;
