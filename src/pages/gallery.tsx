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
     * @returns 
     */
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

  return (
    <Layout>
      <GettingStartedSection />
      <ProjectsSection projects={projects} />
    </Layout>
  );
}
