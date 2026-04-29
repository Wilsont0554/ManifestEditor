import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

type Props = {
  id: string;
  manifest: object;
};

export default function ProjectCard({ id, manifest }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const liveViewerManifestUrl = useMemo(
    () =>
      `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(manifest, null, 2),
      )}`,
    [manifest],
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLoaded(entry.isIntersecting);
      },
      { rootMargin: "200px", threshold: 0.01 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const label = manifest["label"]?.en?.[0] ?? "Untitled Manifest";
  return (
    <Link
      to={"/editor/" + id}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md mx-auto w-full"
    >
      <div ref={cardRef} className="relative aspect-square w-full bg-slate-50">
        {isLoaded ? (
          <voyager-explorer
            prompt="false"
            document={liveViewerManifestUrl}
            style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
          />
        ) : (
          <div>Loading Preview...</div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-medium text-slate-900">{label}</p>
        <p className="truncate text-xs text-slate-500">{id}</p>
      </div>
    </Link>
  );
}
