import CreateProjectCard from "@/components/gallery/CreateProjectCard";
import ImportGistCard from "@/components/gallery/ImportGistCard";
import ImportFileCard from "@/components/gallery/ImportFileCard";
import SectionHeading from "@/components/gallery/SectionHeading";

/**
 * The first section of Gallery page
 * Containing cards for creating a new manifest, importing from GitHub Gist, and importing from a local file
 * @returns Getting started section
 */
export default function GettingStartedSection() {
  return (
    <section className="mb-14">
      <SectionHeading
        eyebrow="01"
        title="Getting started"
        description="Three ways to spin up a manifest."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CreateProjectCard />
        <ImportGistCard />
        <ImportFileCard />
      </div>
    </section>
  );
}
