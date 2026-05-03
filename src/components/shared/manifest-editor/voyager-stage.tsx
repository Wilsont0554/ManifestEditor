import { useEffect, useState } from "react";
import { JsonEditor } from "json-edit-react";
import type { IiifContainerType } from "@/types/iiif";

interface VoyagerStageProps {
  containerType: IiifContainerType;
  hasStageContent: boolean;
  isInspectorOpen: boolean;
  manifestTitle: string;
  serializedManifest: object;
  voyagerUrl: string;
  onCreateTextAnnotation: () => void;
  onOpenContentResourceModal: () => void;
  onToggleInspector: () => void;
}

function VoyagerStage({
  containerType,
  hasStageContent,
  isInspectorOpen,
  manifestTitle,
  serializedManifest,
  voyagerUrl,
  onCreateTextAnnotation,
  onOpenContentResourceModal,
  onToggleInspector,
}: VoyagerStageProps) {
  const [isJSONWindowOpen, setIsJSONWindowOpen] = useState(false);
  const [isQuickStartDismissed, setIsQuickStartDismissed] = useState(false);
  const toolbarButtonClassName =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300";

  useEffect(() => {
    if (hasStageContent) {
      setIsQuickStartDismissed(false);
    }
  }, [hasStageContent]);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.22em] text-slate-600">
          Voyager Stage
        </h2>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-2 pb-3 text-sm text-slate-300">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white">
                {manifestTitle}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">
                {containerType}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-white transition hover:bg-white/15"
                type="button"
                onClick={() => setIsJSONWindowOpen((currentValue) => !currentValue)}
              >
                {isJSONWindowOpen ? "Close JSON" : "Open JSON"}
              </button>
              <button
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-white transition hover:bg-white/15"
                type="button"
                onClick={onToggleInspector}
              >
                {isInspectorOpen ? "Hide editor" : "Show editor"}
              </button>
            </div>
          </div>

          <div className="relative mt-3 min-h-[clamp(32rem,72vh,52rem)] overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(51,65,85,0.9),_rgba(2,6,23,0.98))]">
            {!hasStageContent && !isQuickStartDismissed ? (
              <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-sm rounded-[24px] border border-white/10 bg-slate-950/70 p-5 shadow-xl backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">
                    Quick Start
                  </p>
                  <button
                    type="button"
                    className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setIsQuickStartDismissed(true)}
                    aria-label="Dismiss quick start"
                    title="Close"
                  >
                    &times;
                  </button>
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Build out the first scene
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Add a content resource to anchor the stage, or drop in a text
                  annotation to test positioning and metadata flows.
                </p>
                <div className="pointer-events-auto mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
                    onClick={onOpenContentResourceModal}
                  >
                    Add resource
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                    onClick={onCreateTextAnnotation}
                  >
                    Add text annotation
                  </button>
                </div>
              </div>
            ) : null}

            <div className="absolute inset-0">
              <voyager-explorer
                prompt="false"
                key={voyagerUrl}
                document={voyagerUrl}
                id="voyager"
                style={{ width: "100%", height: "100%" }}
              ></voyager-explorer>
            </div>

            {isJSONWindowOpen ? (
              <div className="absolute inset-0 z-20 bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-4">
                <section className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/95 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">
                        Manifest JSON
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-950">
                        In-stage preview
                      </h3>
                    </div>

                    <button
                      className={toolbarButtonClassName}
                      type="button"
                      onClick={() => setIsJSONWindowOpen(false)}
                    >
                      Hide JSON
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
                    <JsonEditor data={serializedManifest} />
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VoyagerStage;
