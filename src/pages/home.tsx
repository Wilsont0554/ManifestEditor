import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { manifestObjContext } from "@/context/manifest-context";
import { createManifestObjectFromUpload } from "@/utils/file";
import {
  readSavedManifests,
  type SavedManifest,
} from "@/utils/saved-manifests";

const EDITOR_ROUTE = "/ManifestEditor/manifest-editor/editor";
const VOYAGER_SCRIPT_ID = "voyager-explorer-script";
const VOYAGER_SCRIPT_SRC =
  "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js";

function formatSavedDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function getManifestDocumentUrl(savedManifest: SavedManifest): string {
  return `data:application/json;charset=utf-8,${encodeURIComponent(
    savedManifest.manifestJson,
  )}`;
}

function ensureVoyagerScript(): void {
  if (document.getElementById(VOYAGER_SCRIPT_ID)) {
    return;
  }

  const scriptTag = document.createElement("script");
  scriptTag.id = VOYAGER_SCRIPT_ID;
  scriptTag.src = VOYAGER_SCRIPT_SRC;
  document.body.appendChild(scriptTag);
}

function HomePage() {
  const navigate = useNavigate();
  const { setManifestObj } = useContext(manifestObjContext);
  const [savedManifests, setSavedManifests] = useState<SavedManifest[]>([]);

  useEffect(() => {
    setSavedManifests(readSavedManifests());
  }, []);

  useEffect(() => {
    ensureVoyagerScript();
  }, []);

  function handleOpenSavedManifest(savedManifest: SavedManifest): void {
    try {
      const parsedManifest = JSON.parse(savedManifest.manifestJson);
      setManifestObj(createManifestObjectFromUpload(parsedManifest));
      navigate(EDITOR_ROUTE);
    } catch {
      alert("Unable to open this saved manifest. The stored JSON is invalid.");
    }
  }

  const examplesViewportClassName =
    savedManifests.length > 4
      ? "manifest-tabs-scroll mt-6 max-h-[50rem] overflow-y-auto overscroll-contain pr-2"
      : "mt-6 overflow-visible";

  return (
    <div className="manifest-tabs-scroll h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fce7f3_0,#f8fafc_28rem,#e2e8f0_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 pb-8">
        <section className="min-h-[34rem] overflow-hidden rounded-[2.5rem] border border-white/80 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <div className="relative flex min-h-[34rem] items-center p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pink-500/30 blur-3xl" />
            <div className="absolute -bottom-32 left-16 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative max-w-5xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-pink-200">
                Manifest Editor
              </p>
              <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
                Create IIIF manifests with structure you can understand.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                Work through metadata, containers, annotations, resources, and
                preview in one place. Recent examples saved from the editor stay
                here so you can return to real manifests instead of starting over.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <NavLink
                  to={EDITOR_ROUTE}
                  className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-100"
                >
                  Open Editor
                </NavLink>
                <a
                  href="https://preview.iiif.io/api/full_manifests/presentation/4.0/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  Read IIIF Rules
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Recent Examples
              </h2>
            </div>
          </div>

          {savedManifests.length > 0 && (
            <div className={examplesViewportClassName}>
              <div className="grid gap-5 pb-2 lg:grid-cols-2">
                {savedManifests.map((savedManifest) => (
                  <button
                    key={savedManifest.id}
                    type="button"
                    className="group relative isolate flex h-[24rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200"
                    onClick={() => handleOpenSavedManifest(savedManifest)}
                    aria-label={`Open ${savedManifest.title} in the manifest editor`}
                  >
                    <div className="pointer-events-none relative min-h-0 flex-1 overflow-hidden bg-slate-950">
                      <voyager-explorer
                        prompt="false"
                        document={getManifestDocumentUrl(savedManifest)}
                        style={{ width: "100%", height: "100%" }}
                      ></voyager-explorer>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/85 to-transparent" />
                      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-950 shadow-sm">
                        Click preview to open
                      </div>
                    </div>

                    <div className="shrink-0 p-5">
                      <h3 className="text-2xl font-black tracking-tight text-slate-950">
                        {savedManifest.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {formatSavedDate(savedManifest.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
