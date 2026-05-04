import { useNavigate } from "react-router";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import Icon from "@/components/icon";

/**
 * Card component for creating a new manifest project. Routes the user to the editor with a blank manifest
 * @returns Card component to create a new manifest project
 */
export default function CreateProjectCard() {
  const reRoute = useNavigate();

  /**
   * Build a fresh blank manifest and route the user to the editor for it.
   * Passes the new manifest in router state so the editor's manifest provider
   * can persist it on first load.
   * @param e button click event
   */
  function handleCreateNewManifest(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newManifest = new ManifestObject("scene");
    const newId = newManifest.getUniqueIdCode();
    reRoute(`/editor/${newId}`, {
      state: { isExample: false, manifest: newManifest },
    });
  }

  return (
    <button
      type="button"
      onClick={handleCreateNewManifest}
      className="group relative flex h-full flex-col items-start gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-300 hover:border-slate-900 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] hover:-translate-y-0.5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 transition-colors duration-300 group-hover:bg-slate-900">
        <Icon
          name="cube"
          className="h-5 w-5 text-slate-700 transition-colors duration-300 group-hover:text-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-black tracking-tight text-slate-950">
          Start blank
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Begin a new IIIF manifest from a clean scene. You can add models,
          lights, and metadata as you go.
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition-colors duration-300 group-hover:text-slate-950">
        Create new
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </button>
  );
}
