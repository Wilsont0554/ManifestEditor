import Icon from "@/components/icon";

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

export default function Features() {
  return (
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
  );
}
