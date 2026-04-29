import { useEffect, useRef, useState } from "react";
import { IndexedDB } from "@/utils/indexdb";
import ProjectCard from "@/components/gallery/projectCard";
import CreateProjectCard from "@/components/gallery/CreateProjectCard";

export default function Gallery() {
  const [projects, setProjects] = useState<object[] | null>(null);
  const dbRef = useRef<IndexedDB>(new IndexedDB());
  const db = dbRef.current;;

  useEffect(() => {
    let cancelled = false;
    async function loadManifests() {
        await db.open();
        if (cancelled) return false;
        const savedManifested = await db.getAllProjects();
        if (cancelled) return false;
        setProjects(savedManifested);
    }
    loadManifests().catch((err) => {
        console.log("Failed to load manifests from IndexedDB", err);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!projects) {
    return <div className="p-6 text-slate-500">Loading…</div>;
  }
  if (projects.length === 0) {
    return <div className="p-6 text-slate-500">No saved manifests yet.</div>;
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6">
      <h1 className="mb-4 text-2xl font-semibold">Your Projects</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateProjectCard key={'create-new'} />
        {projects.map((p) => {
            const id = p["id"].split("/").pop() ?? "invalid-id";
            return <ProjectCard key={id} id={id} manifest={p} />;
        })}
      </div>
    </div>
  );
}
