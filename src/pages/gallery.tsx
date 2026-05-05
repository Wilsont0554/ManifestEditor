import { useEffect, useMemo, useState } from "react";
import { IndexedDB } from "@/utils/indexdb";
import Layout from "@/components/gallery/Layout";
import GettingStartedSection from "@/components/gallery/GettingStartedSection";
import ProjectsSection from "@/components/gallery/ProjectsSection";

type SavedProject = {
  id: string;
  [key: string]: unknown;
};

export default function Gallery() {
  const [projects, setProjects] = useState<SavedProject[] | null>(null);
  const db = useMemo(() => new IndexedDB(), []);

  useEffect(() => {
    let cancelled = false;

    /**
     * Load all manifest from IndexedDB 
     * @returns true if manifests are loaded successfully, false if the loading is cancelled
     */
    async function loadManifests() {
      await db.open();
      if (cancelled) return false;
      const savedManifested = await db.getAllProjects();
      if (cancelled) return false;
      setProjects(savedManifested as SavedProject[]);
      return true;
    }

    loadManifests().catch((err) => {
      console.log("Failed to load manifests from IndexedDB", err);
    });
    return () => {
      cancelled = true;
    };
  }, [db]);

  /**
   * Handle delete manifest
   */
  async function handleDeleteProjectById(id: string) {
    try {
      await db.deleteProject(id);
      setProjects((prev) => prev?.filter((proj) => proj.id.split('/').pop() !== id) ?? null);
    }
    catch (err) {
      console.error("Failed to delete manifest from IndexedDB:", err);
    }
  };
  
  return (
    <Layout>
      <GettingStartedSection />
      <ProjectsSection projects={projects} onDeleteProjectById={handleDeleteProjectById} />
    </Layout>
  );
}
