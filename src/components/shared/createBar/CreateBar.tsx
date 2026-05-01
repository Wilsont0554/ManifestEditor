import { useEffect, useRef, useState } from "react";
import type { IiifContainerType } from "@/types/iiif";

type ToolbarMenuId = "file" | null;

const containerTypes: IiifContainerType[] = ["Canvas", "Scene", "Timeline"];

interface CreateBarProps {
  containerType: IiifContainerType;
  handleCreateTextAnnotation: () => void;
  handleOpenContentResourceModal: () => void;
  handleOpenTempModal: () => void;
  handleCreateTextAnnotation: () => void;
}

function CreateBar({
  containerType,
  handleCreateTextAnnotation,
  handleOpenContentResourceModal,
  handleOpenTempModal,
  handleCreateTextAnnotation,
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
    <div className="mr-auto max-w-245 space-y-4 pb-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {isAutoUpdateEnabled && gistId && (
            <span className="w-full text-xs text-slate-500">
              Auto-Update enabled
            </span>
          )}

          <Button
            type="button"
            onClick={handleOpenContentResourceModal}
          >
            Create Asset
          </Button>

          <Button
            type="button"
            onClick={handleOpenTempModal}
          >
            Create Environment
          </Button>

          <Button
            type="button"
            onClick={handleCreateTextAnnotation}
          >
            Add Text Annotation
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CreateBar;
