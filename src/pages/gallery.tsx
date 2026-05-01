import { useEffect, useRef, useState } from "react";
import { IndexedDB } from "@/utils/indexdb";
import Layout from "@/components/gallery/Layout";
import GettingStartedSection from "@/components/gallery/GettingStartedSection";
import ProjectsSection from "@/components/gallery/ProjectsSection";

export default function Gallery() {
  const [projects, setProjects] = useState<object[] | null>(null);
  const dbRef = useRef<IndexedDB>(new IndexedDB());
  const db = dbRef.current;

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
      setProjects(savedManifested);
      return true;
    }

    loadManifests().catch((err) => {
      console.log("Failed to load manifests from IndexedDB", err);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Handle delete manifest
   */
  async function handleDelete(id: string) {
    try {
      await db.deleteProject(id);
      setProjects((prev) => prev?.filter((proj: any) => proj.id !== id) ?? null);
    }
    catch (err) {
      console.error("Failed to delete manifest from IndexedDB:", err);
    }
  };
  
  return (
    <Layout>
      <GettingStartedSection />
      <ProjectsSection projects={projects} />
    </Layout>
  );
}
