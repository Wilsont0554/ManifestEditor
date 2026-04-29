import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

type Props = {
  id: string;
  manifest: object;
  index: number;
};

/**
 * 
 * @param id - manifest id
 * @param manifest - the manifest object
 * @param index - the index of the manifest in the list of projects, used for display purposes
 * @returns 
 */
export default function ProjectCard({ id, manifest, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
  const indexLabel = String(index + 1).padStart(3, "0");
  const editedAt = manifest["editedAt"] ? new Date(manifest["editedAt"]) : null;

  return (
    <Link
      to={"/editor/" + id}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-slate-300/70 bg-white transition-all duration-300 hover:border-slate-900 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.45)] hover:-translate-y-1"
    >
      <span className="pointer-events-none absolute left-2 top-2 z-10 text-[10px] font-semibold tracking-[0.15em] text-slate-500 group-hover:text-slate-900 transition-colors">
        № {indexLabel}
      </span>
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
      </div>

      <div className="flex flex-col gap-0.5 px-2.5 py-2">
        <p
          className="truncate text-sm font-semibold leading-tight text-slate-900"
          title={label}
        >
          {label}
        </p>
        <p
          className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400"
          title={id}
        >
          {id}
        </p>
        {editedAt && (
          <p className="text-[10px] font-medium tracking-[0.12em] text-slate-400">
            Edited: {editedAt.toLocaleDateString()}
          </p>
        )}
      </div>

      <span className="pointer-events-none absolute inset-x-2.5 bottom-1.5 h-px scale-x-0 bg-slate-900 transition-transform duration-300 origin-left group-hover:scale-x-100" />
    </Link>
  );
}
