import { type ReactNode, useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { manifestObjContext } from "@/context/manifest-context";
import { createManifestObjectFromUpload } from "@/utils/file";
import {
  readSavedManifests,
  type SavedManifest,
} from "@/utils/saved-manifests";

const EDITOR_ROUTE = "/ManifestEditor/manifest-editor/editor";
const HERO_IMAGE_SRC = `${import.meta.env.BASE_URL}iiif3dlogo.png`;
const VOYAGER_SCRIPT_ID = "voyager-explorer-script";
const VOYAGER_SCRIPT_SRC =
  "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js";

const capabilityItems = [
  {
    icon: "file-text",
    title: "Add metadata",
    description: "Title, description, rights, identifiers, labels, and more.",
    colorClassName: "text-pink-600",
  },
  {
    icon: "grid",
    title: "Organize content",
    description: "Structure scenes, canvases, timelines, and annotation pages.",
    colorClassName: "text-blue-600",
  },
  {
    icon: "message",
    title: "Add annotations",
    description: "Attach text, tags, and other annotations to resources.",
    colorClassName: "text-violet-600",
  },
  {
    icon: "cube",
    title: "Configure 3D",
    description: "Add models, cameras, lights, transforms, and environments.",
    colorClassName: "text-emerald-600",
  },
  {
    icon: "eye",
    title: "Preview live",
    description: "See changes instantly in the embedded Voyager viewer.",
    colorClassName: "text-orange-600",
  },
  {
    icon: "cloud-upload",
    title: "Export and share",
    description: "Download JSON, publish examples, or share through Gists.",
    colorClassName: "text-sky-600",
  },
];

const manifestTerms = [
  {
    icon: "file-text",
    title: "Manifest = Recipe",
    description:
      "The whole package that describes your digital objects and how they work together.",
    colorClassName: "bg-pink-50 text-pink-600",
  },
  {
    icon: "file",
    title: "Canvas = Page",
    description:
      "A single page or view where one piece of content is presented.",
    colorClassName: "bg-blue-50 text-blue-600",
  },
  {
    icon: "cube",
    title: "Scene = 3D Space",
    description:
      "A 3D environment containing models, cameras, lights, and transforms.",
    colorClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: "message",
    title: "Annotation = Note",
    description:
      "A note, caption, tag, or resource attached to a specific part of the content.",
    colorClassName: "bg-orange-50 text-orange-600",
  },
];

const workflowSteps = [
  {
    icon: "file-text",
    step: "01",
    title: "Describe your project",
    description:
      "Add title, description, rights, metadata, and identifiers so your manifest has context.",
    colorClassName: "bg-pink-500",
  },
  {
    icon: "cube",
    step: "02",
    title: "Build your structure",
    description:
      "Add scenes, canvases, annotations, cameras, lights, transforms, and resources.",
    colorClassName: "bg-blue-500",
  },
  {
    icon: "eye",
    step: "03",
    title: "Preview instantly",
    description:
      "See how your manifest looks in Voyager and inspect generated JSON side by side.",
    colorClassName: "bg-violet-500",
  },
  {
    icon: "cloud-upload",
    step: "04",
    title: "Save or share",
    description:
      "Download JSON, store locally, publish examples, or export to GitHub Gist.",
    colorClassName: "bg-emerald-500",
  },
];

const featureItems = [
  {
    icon: "clipboard",
    title: "Manifest editing",
    description:
      "Add titles, summaries, metadata, viewing direction, behavior settings, and linking information without writing JSON.",
    colorClassName: "bg-pink-50",
  },
  {
    icon: "layout",
    title: "Structure and annotations",
    description:
      "Create scenes, canvases, timelines, and annotation pages with structured relationships between resources.",
    colorClassName: "bg-blue-50",
  },
  {
    icon: "cube",
    title: "3D assets and environment",
    description:
      "Configure models, images, lighting, cameras, transforms, and environment settings visually.",
    colorClassName: "bg-emerald-50",
  },
  {
    icon: "monitor",
    title: "Preview, save, and share",
    description:
      "Preview with Voyager, inspect JSON output, store drafts locally, and export manifests for reuse or sharing.",
    colorClassName: "bg-orange-50",
  },
];

const audienceItems = [
  {
    icon: "museum",
    title: "Museums and Galleries",
    description: "Create digital exhibitions and online collections.",
    colorClassName: "text-pink-600",
  },
  {
    icon: "book",
    title: "Libraries and Archives",
    description: "Organize and share special collections.",
    colorClassName: "text-blue-600",
  },
  {
    icon: "flask",
    title: "Researchers",
    description: "Publish structured datasets and 3D models.",
    colorClassName: "text-emerald-600",
  },
  {
    icon: "graduation",
    title: "Educators and Students",
    description: "Learn IIIF standards and build real projects.",
    colorClassName: "text-orange-600",
  },
  {
    icon: "code",
    title: "Developers",
    description: "Test, prototype, and integrate IIIF workflows.",
    colorClassName: "text-violet-600",
  },
];

const sampleExamples = [
  "Avocado",
  "Blank Manifest",
  "Ionian Capital",
  "Ship Scene",
];

function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const commonProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const paths: Record<string, ReactNode> = {
    "file-text": (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
        <path d="M9 9h1" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    cube: (
      <>
        <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9z" />
        <path d="M12 11 4 6.5" />
        <path d="m12 11 8-4.5" />
        <path d="M12 11v9" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    "cloud-upload": (
      <>
        <path d="M16 16 12 12l-4 4" />
        <path d="M12 12v9" />
        <path d="M20.4 18.6A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 4 16.3" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 2h6l1 3h3v17H5V5h3z" />
        <path d="M9 5h6" />
        <path d="M8 11h8" />
        <path d="M8 15h8" />
      </>
    ),
    layout: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M9 10v10" />
      </>
    ),
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </>
    ),
    museum: (
      <>
        <path d="M3 10h18" />
        <path d="m12 3 9 5H3z" />
        <path d="M5 10v8" />
        <path d="M9 10v8" />
        <path d="M15 10v8" />
        <path d="M19 10v8" />
        <path d="M3 21h18" />
      </>
    ),
    book: (
      <>
        <path d="M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3z" />
        <path d="M4 5v17" />
        <path d="M8 6h8" />
      </>
    ),
    flask: (
      <>
        <path d="M9 2h6" />
        <path d="M10 2v6l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V2" />
        <path d="M8 14h8" />
      </>
    ),
    graduation: (
      <>
        <path d="m22 10-10-5-10 5 10 5z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
    code: (
      <>
        <path d="m8 16-4-4 4-4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 4-4 16" />
      </>
    ),
    braces: (
      <>
        <path d="M8 4H7a3 3 0 0 0-3 3v2a3 3 0 0 1-2 3 3 3 0 0 1 2 3v2a3 3 0 0 0 3 3h1" />
        <path d="M16 4h1a3 3 0 0 1 3 3v2a3 3 0 0 0 2 3 3 3 0 0 0-2 3v2a3 3 0 0 1-3 3h-1" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
      </>
    ),
    github: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3c3 0 6-2 6-6a5 5 0 0 0-1.4-3.7A4.6 4.6 0 0 0 18.5 2S17.3 1.7 15 3.5a12.3 12.3 0 0 0-6 0C6.7 1.7 5.5 2 5.5 2a4.6 4.6 0 0 0-.1 3.3A5 5 0 0 0 4 9c0 4 3 6 6 6a4.8 4.8 0 0 0-1 3v4" />
        <path d="M9 18c-4.5 2-5-2-7-2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
  };

  return <svg {...commonProps}>{paths[name]}</svg>;
}

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
  const [savedManifests] = useState<SavedManifest[]>(() => readSavedManifests());

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
    <div className="manifest-tabs-scroll h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fce7f3_0,#f8fafc_28rem,#eaf2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 pb-8">
        <section className="overflow-hidden rounded-[1.25rem] border border-white/80 bg-slate-950 text-white shadow-[0_20px_70px_rgba(15,23,42,0.24)]">
          <div className="grid min-h-[34rem] items-center gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.8fr)] lg:p-14">
            <div>
              <div className="inline-flex rounded-lg border border-pink-400/50 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-100">
                Supports IIIF Presentation 4 and 3D Scenes
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
                Create IIIF manifests with structure you can understand.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Build manifests for images, audio, video, and 3D scenes in a
                visual workspace. Add metadata, organize content, preview
                results live, and export ready-to-share manifests.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <NavLink
                  to={EDITOR_ROUTE}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-pink-100"
                >
                  <Icon name="clipboard" className="h-4 w-4" />
                  Open Manifest Editor
                </NavLink>
                <a
                  href="https://preview.iiif.io/api/full_manifests/presentation/4.0/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  <Icon name="cube" className="h-4 w-4" />
                  Read IIIF Rules
                </a>
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-300">
                What is a IIIF Manifest?
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={HERO_IMAGE_SRC}
                alt="IIIF 3D Manifest Editor and Viewer"
                className="max-h-96 w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 text-center shadow-sm backdrop-blur sm:p-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            What is the Manifest Editor?
          </h2>
          <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-slate-600">
            The Manifest Editor helps you create structured descriptions of
            digital objects like images, videos, and 3D models using the IIIF
            standard. Instead of writing JSON manually, you build manifests
            visually.
          </p>

          <div className="mt-8 grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-6">
            {capabilityItems.map((item) => (
              <div key={item.title} className="px-4 py-4">
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center ${item.colorClassName}`}
                >
                  <Icon name={item.icon} className="h-9 w-9" />
                </div>
                <h3 className="mt-4 text-sm font-black text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                What is a manifest?
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-700">
                A manifest is like a playlist or table of contents for digital
                content.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                It tells viewers what files belong together, how they are
                arranged, what they are called, and how they should be
                displayed.
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Museums, libraries, researchers, and developers use manifests to
                organize and share digital collections.
              </p>
              <p className="mt-4 text-sm font-bold text-pink-600">
                The Manifest Editor helps you create these visually.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {manifestTerms.map((term) => (
                <div
                  key={term.title}
                  className={`rounded-xl border border-slate-200 p-5 ${term.colorClassName}`}
                >
                  <div className="flex items-start gap-4">
                    <Icon name={term.icon} className="mt-0.5 h-9 w-9 shrink-0" />
                    <div>
                      <h3 className="text-sm font-black text-slate-950">
                        {term.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                    {term.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-950">
            How the workflow works
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {workflowSteps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < workflowSteps.length - 1 && (
                  <Icon
                    name="arrow"
                    className="absolute -right-6 top-12 z-10 hidden h-7 w-7 text-slate-400 md:block"
                  />
                )}
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white ${item.colorClassName}`}
                    >
                      {item.step}
                    </div>
                    <Icon
                      name={item.icon}
                      className="h-9 w-9 text-slate-500"
                    />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-slate-950">
            Powerful features in one workspace
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {featureItems.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-xl border border-slate-200 p-5 ${feature.colorClassName}`}
              >
                <Icon name={feature.icon} className="h-9 w-9 text-slate-700" />
                <h3 className="text-base font-black text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Try an example manifest
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Open a saved example or publish your own manifest from the
                editor.
              </p>
            </div>
            <NavLink
              to={EDITOR_ROUTE}
              className="inline-flex rounded-lg border border-pink-200 px-4 py-2 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
            >
              Open editor
            </NavLink>
          </div>

          {savedManifests.length > 0 ? (
            <div className={examplesViewportClassName}>
              <div className="grid gap-4 pb-2 md:grid-cols-2 xl:grid-cols-4">
                {savedManifests.map((savedManifest) => (
                  <button
                    key={savedManifest.id}
                    type="button"
                    className="group relative isolate flex h-64 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200"
                    onClick={() => handleOpenSavedManifest(savedManifest)}
                    aria-label={`Open ${savedManifest.title} in the manifest editor`}
                  >
                    <div className="pointer-events-none relative min-h-0 flex-1 overflow-hidden bg-slate-950">
                      <voyager-explorer
                        prompt="false"
                        document={getManifestDocumentUrl(savedManifest)}
                        style={{ width: "100%", height: "100%" }}
                      ></voyager-explorer>
                    </div>
                    <div className="shrink-0 border-t border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-black text-slate-950">
                            {savedManifest.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatSavedDate(savedManifest.updatedAt)}
                          </p>
                        </div>
                        <span className="rounded-md border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700">
                          Open
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-4">
              {sampleExamples.map((example) => (
                <div
                  key={example}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex h-36 items-center justify-center bg-slate-950 p-6">
                    <div className="rounded-xl border border-white/15 px-5 py-4 text-center text-sm font-black text-white">
                      {example}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-950">
                          {example}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Example manifest
                        </p>
                      </div>
                      <NavLink
                        to={EDITOR_ROUTE}
                        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700"
                      >
                        Open
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 text-center shadow-sm backdrop-blur sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Who uses the Manifest Editor?
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {audienceItems.map((audience) => (
              <div
                key={audience.title}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-left"
              >
                <Icon
                  name={audience.icon}
                  className={`h-8 w-8 ${audience.colorClassName}`}
                />
                <h3 className="mt-3 text-sm font-black text-slate-950">
                  {audience.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem]">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Why this editor exists
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Creating IIIF manifests normally requires editing structured JSON
              manually, which can be complex and time-consuming.
            </p>
            <p className="mt-4 text-sm font-bold leading-6 text-slate-950">
              Manifest Editor makes the process visual, faster, and easier to
              learn while keeping the full structure visible.
            </p>
            <Icon name="braces" className="ml-auto mt-6 h-20 w-20 text-pink-500" />
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Built on open standards
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              {[
                "Supports IIIF Presentation 4 and 3D Scenes",
                "Integrated Voyager preview",
                "Exports standards-oriented JSON",
                "Runs entirely in the browser",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon
                    name="check"
                    className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-5xl font-black text-pink-500">iiif</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Building toward open, interoperable cultural heritage tools.
            </p>
            <a
              href="https://github.com/Wilsont0554/ManifestEditor"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              <Icon name="github" className="h-4 w-4" />
              View source
            </a>
          </div>
        </section>

        <section className="rounded-[1.25rem] bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 p-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Start building your manifest
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Open the editor and create your first IIIF manifest in minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <NavLink
                to={EDITOR_ROUTE}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-pink-50"
              >
                <Icon name="clipboard" className="h-4 w-4" />
                Open Manifest Editor
              </NavLink>
              <a
                href="https://preview.iiif.io/api/full_manifests/presentation/4.0/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Icon name="book" className="h-4 w-4" />
                Browse documentation
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
