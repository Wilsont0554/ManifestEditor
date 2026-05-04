import { useState } from "react";
import SectionHeading from "@/components/gallery/SectionHeading";
import TabButton from "./TabButton";
import MyProjectsTab from "./MyProjectsTab";
import ExamplesTab from "./ExamplesTab";

type Tab = "projects" | "examples";

type Props = {
  /** User projects loaded from IndexedDB. `null` while loading. */
  projects: object[] | null;
  /** Function to handle project deletion. */
  onDeleteProjectById: (id: string) => void;
};

/**
 * Projects section of the Gallery page.
 * @param projects user manifests from IndexedDB, or null while loading
 */
export default function ProjectsSection({ projects, onDeleteProjectById }: Props) {
  const [tab, setTab] = useState<Tab>("projects");

  const counts = {
    projects: projects?.length ?? 0,
    examples: 0,
  };

  return (
    <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
      <SectionHeading
        eyebrow="Library"
        title={tab === "projects" ? "Projects" : "Example manifests"}
        description="Browse what you've made and what's available."
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="md:w-52 md:shrink-0">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-pink-600">
            Browse
          </p>
          <nav className="flex flex-col border-l border-slate-200">
            <TabButton
              active={tab === "examples"}
              label="Examples"
              count={counts.examples}
              onClick={() => setTab("examples")}
            />
            <TabButton
              active={tab === "projects"}
              label="Your projects"
              count={counts.projects}
              onClick={() => setTab("projects")}
            />
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          {tab === "projects" ? (
            <MyProjectsTab projects={projects} onDeleteProjectById={onDeleteProjectById} />
          ) : (
            <ExamplesTab />
          )}
        </div>
      </div>
    </section>
  );
}
