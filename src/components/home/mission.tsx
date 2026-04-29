import Icon from "@/components/icon";

export default function Mission() {
  return (
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
          Manifest Editor makes the process visual, faster, and easier to learn
          while keeping the full structure visible.
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
  );
}
