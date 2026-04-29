import { useState } from "react";
import SectionHeading from "@/components/gallery/SectionHeading";
import TabButton from "./TabButton";
import MyProjectsTab from "./MyProjectsTab";
import ExamplesTab from "./ExamplesTab";

type Tab = "projects" | "examples";

type Props = {
  /** User projects loaded from IndexedDB. `null` while loading. */
  projects: object[] | null;
};

/**
 * Projects section of the Gallery page. 
 * @param projects user manifests from IndexedDB, or null while loading
 */
export default function ProjectsSection({ projects }: Props) {
  const [tab, setTab] = useState<Tab>("projects");

  const counts = {
    projects: projects?.length ?? 0,
    examples: 0,
  };

  return (
    <section>
      <SectionHeading
        eyebrow="02"
        title="Projects"
        description="Browse what you've made and what's available."
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="md:w-52 md:shrink-0">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Browse
          </p>
          <nav className="flex flex-col border-l border-slate-200">
            <TabButton
              active={tab === "projects"}
              label="Your projects"
              count={counts.projects}
              onClick={() => setTab("projects")}
            />
            <TabButton
              active={tab === "examples"}
              label="Examples"
              count={counts.examples}
              onClick={() => setTab("examples")}
            />
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          {tab === "projects" ? (
            <MyProjectsTab projects={projects} />
          ) : (
            <ExamplesTab />
          )}
        </div>
      </div>
    </section>
  );
}
