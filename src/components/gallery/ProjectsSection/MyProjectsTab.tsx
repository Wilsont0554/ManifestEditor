import ProjectCard from "@/components/gallery/projectCard";
import ProjectGrid from "./ProjectGrid";
import SkeletonCard from "./SkeletonCard";

type Props = {
  projects: object[] | null;
  onDeleteProjectById: (id: string) => void;
};

/**
 * Body of the "Projects" tab. Renders one of three states based on
 * `projects`:
 *  - `null` loads skeletons in the grid
 *  - empty array shows an empty-state callout prompting the user to create or import
 *  - non-empty list renders ProjectCard tiles, one per saved manifest
 * @param projects user manifests from IndexedDB, or null while loading
 */
export default function MyProjectsTab({ projects, onDeleteProjectById }: Props) {
  
  const sortedProjects = projects ? [...projects].sort((a, b) => {
    const dateA = a["editedAt"] ? new Date(a["editedAt"]) : new Date(0);
    const dateB = b["editedAt"] ? new Date(b["editedAt"]) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  }) : null;

  if (sortedProjects === null) {
    return (
      <ProjectGrid>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </ProjectGrid>
    );
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
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
      {sortedProjects.map((p) => {
        const id = p["id"].split("/").pop() ?? "invalid-id";
        return <ProjectCard key={id} id={id} manifest={p} onDelete={onDeleteProjectById}/>;
      })}
    </ProjectGrid>
  );
}
