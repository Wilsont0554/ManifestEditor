import { useEffect, useRef, useState } from "react";
import type { IiifContainerType } from "@/types/iiif";

type ToolbarMenuId = "file" | null;

const containerTypes: IiifContainerType[] = ["Canvas", "Scene", "Timeline"];

interface CreateBarProps {
  containerType: IiifContainerType;
  handleCreateTextAnnotation: () => void;
  handleOpenContentResourceModal: () => void;
  handleOpenTempModal: () => void;
  onContainerTypeChange: (type: IiifContainerType) => void;
  onDownload: () => void;
  onExport: () => void;
  onImport: () => void;
}

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

function CreateBar({
  containerType,
  handleCreateTextAnnotation,
  handleOpenContentResourceModal,
  handleOpenTempModal,
  onContainerTypeChange,
  onDownload,
  onExport,
  onImport,
}: CreateBarProps) {
  const [openToolbarMenu, setOpenToolbarMenu] = useState<ToolbarMenuId>(null);
  const toolbarMenuRef = useRef<HTMLDivElement | null>(null);
  const toolbarMenuPanelClassName =
    "absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]";
  const toolbarMenuItemClassName =
    "flex w-full items-start gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-slate-50";

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

  return (
    <section className="overflow-visible rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div ref={toolbarMenuRef} className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold uppercase tracking-[0.22em] text-slate-600 sm:text-3xl">
            Workspace
          </h1>

          <div className="relative">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              type="button"
              onClick={() =>
                setOpenToolbarMenu((currentMenu) =>
                  currentMenu === "file" ? null : "file",
                )
              }
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
                    onDownload();
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
                    onImport();
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
                    onExport();
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
              {containerTypes.map((nextContainerType) => {
                const isActive = containerType === nextContainerType;

                return (
                  <button
                    key={nextContainerType}
                    id={nextContainerType === "Canvas" ? "container-type" : undefined}
                    type="button"
                    className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-rose-500 text-white shadow-[0_8px_18px_rgba(244,63,94,0.28)]"
                        : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                    }`}
                    onClick={() => onContainerTypeChange(nextContainerType)}
                    aria-pressed={isActive}
                  >
                    {nextContainerType}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              className="group rounded-[22px] border border-rose-200 bg-rose-50/70 px-5 py-4 text-left shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:shadow-[0_14px_28px_rgba(244,63,94,0.14)]"
              onClick={handleOpenContentResourceModal}
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
              onClick={handleOpenTempModal}
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
  );
}

export default CreateBar;
