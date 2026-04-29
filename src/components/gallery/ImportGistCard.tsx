import { useState } from "react";
import { useNavigate } from "react-router";
import Icon from "@/components/icon";
import { importManifestFromGist } from "@/utils/import";

/**
 * Card component for importing a manifest from a GitHub Gist URL
 * @returns card component to import a manifest from a GitHub Gist URL
 */
export default function ImportGistCard() {
  const reRoute = useNavigate();
  const [gistInput, setGistInput] = useState("");
  const [isProcessing, setisProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * Submit the gist URL/id, fetch the manifest via importManifestFromGist,
   * and route the user to the editor with the imported manifest in state.
   * Surfaces user-readable failures inline via errorMsg rather than alert().
   * @param e form submission event
   */
  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!gistInput.trim() || isProcessing) return;

    setisProcessing(true);
    setErrorMsg(null);
    try {
      const { manifestId, manifestData } = await importManifestFromGist(
        gistInput,
      );
      reRoute(`/editor/${manifestId}`, {
        replace: true,
        state: { manifest: manifestData },
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to import gist.";
      console.error("Failed to import gist:", err);
      setErrorMsg(msg);
    } finally {
      setisProcessing(false);
    }
  }

  return (
    <form
      onSubmit={handleImport}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-900 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] focus-within:border-slate-900 focus-within:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 transition-colors duration-300 group-hover:bg-slate-900 group-focus-within:bg-slate-900">
        <Icon
          name="github"
          className="h-5 w-5 text-slate-700 transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-black tracking-tight text-slate-950">
          Import from Gist
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Paste a public GitHub Gist URL or ID to load an existing IIIF
          manifest.
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <label htmlFor="gist-import-url" className="sr-only">
          Gist URL or ID
        </label>
        <input
          id="gist-import-url"
          type="text"
          placeholder="https://gist.github.com/…"
          value={gistInput}
          onChange={(e) => setGistInput(e.target.value)}
          disabled={isProcessing}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-900 focus:shadow-[0_0_0_3px_rgba(15,23,42,0.08)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isProcessing || !gistInput.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isProcessing ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Importing
            </>
          ) : (
            <>
              Import gist
              <span>→</span>
            </>
          )}
        </button>
        {errorMsg && (
          <p className="text-xs text-rose-600">{errorMsg}</p>
        )}
      </div>
    </form>
  );
}
