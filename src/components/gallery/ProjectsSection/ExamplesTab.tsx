import ProjectGrid from "./ProjectGrid";
import SkeletonCard from "./SkeletonCard";
import ProjectCard from "../projectCard";

/**
 * Body of the "Examples" tab. Currently a placeholder empty-state — curated
 * example manifests will be wired in here later.
 */
export default function ExamplesTab({projects}:{projects: object[] | null}
) {
  if (projects === null) {
      return (
        <ProjectGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </ProjectGrid>
      );
    }
    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 p-10 text-center">
          <p className="w-full text-base font-semibold text-slate-700">
            No projects yet.
          </p>
          <p className="w-full text-sm text-slate-500">
            Use one of the cards above to create or import your first manifest.
          </p>
        </div>
      );
    }

    return (
      <ProjectGrid>
        {projects.map((p, idx) => {
          return <ProjectCard
            key={idx} id={idx + ""} manifest={p} isExample={true}
            />;
        })}
      </ProjectGrid>
    );
}

