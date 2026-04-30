import Icon from "@/components/icon";

export default function ManifestDefinition() {
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

  return (
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
            It tells viewers what files belong together, how they are arranged,
            what they are called, and how they should be displayed.
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
  );
}
