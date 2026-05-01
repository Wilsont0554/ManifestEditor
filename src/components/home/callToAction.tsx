import Icon from "@/components/icon";
import CreateNewManifestLink from "@/components/navbar/createNewManifestLink";

export default function CallToAction() {
    return (
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
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-pink-50"
              >
                <CreateNewManifestLink>
                  <Icon name="clipboard" className="h-4 w-4" />
                  Open Manifest Editor
                </CreateNewManifestLink>
              </button>
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
    );    
}