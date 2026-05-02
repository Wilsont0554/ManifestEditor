import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import ThreeDotsMenu from "../shared/threeDotsMenu/index";
import MenuItem from "../shared/threeDotsMenu/MenuItem";
import { downloadJsonFile } from "@/utils/file";

type Props = {
  id: string;
  manifest: object;
  isExample?: boolean;
  onDelete?: (id: string) => void;
};

/**
 *
 * @param id - manifest id
 * @param manifest - the manifest object
 * @returns the card component displaying a manifest project in the gallery.
 */
export default function ProjectCard(props: Props) {
  const { id, manifest, isExample = false, onDelete } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const editedAt = manifest["editedAt"] ? new Date(manifest["editedAt"]) : null;

  function parseEditedTime() {
    if (!editedAt) return null;
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(editedAt);
  }

  const handleDeleteProject = () => {
    console.log("Deleting project with id:", id);
    onDelete && onDelete(id);
  };

  const handleExportProject = () => {
    const fileName = `${manifest["label"]?.en?.[0] ?? "manifest"}.json`;
    downloadJsonFile(manifest, fileName);
  };

  /**
   * Encode the manifest as a data URL for the voyager preview
   */
  const liveViewerManifestUrl = useMemo(() => {
    if (!isLoaded) return "";
    return `data:application/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(manifest, null, 2),
    )}`;
  }, [manifest, isLoaded]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const label = manifest["label"]?.en?.[0] ?? "Untitled Manifest";

  return (
    <Link
      to={"/editor/" + id}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-slate-300/70 bg-white transition-all duration-300 hover:border-slate-900 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.45)] hover:-translate-y-1"
      state={{ isExample: isExample }}
    >
      <div
        ref={cardRef}
        className="relative aspect-square w-full overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#f8fafc_0%,#e2e8f0_100%)]"
      >
        {isLoaded ? (
          <voyager-explorer
            prompt="false"
            uimode="none"
            controls="false"
            document={liveViewerManifestUrl}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <ThreeDotsMenu className="absolute right-2 top-2 z-100">
          <MenuItem onSelect={handleExportProject}>
            Download JSON
          </MenuItem>
          <div className="border-t border-slate-200 my-1" />
          {!isExample && <MenuItem tone="danger" onSelect={handleDeleteProject}>
            Delete
          </MenuItem>}
        </ThreeDotsMenu>
      </div>

      <div className="flex flex-col gap-0.5 px-2.5 py-2">
        <p
          className="truncate text-sm font-semibold leading-tight text-slate-900"
          title={label}
        >
          {label}
        </p>
        {editedAt && (
          <p className="text-[10px] tracking-[0.12em] text-slate-400">
            Updated {parseEditedTime()}
          </p>
        )}
      </div>
      <span className="pointer-events-none absolute inset-x-2.5 bottom-1.5 h-px scale-x-0 bg-slate-900 transition-transform duration-300 origin-left group-hover:scale-x-100" />
    </Link>
  );
}
