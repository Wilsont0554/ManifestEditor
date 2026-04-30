import Icon from "@/components/icon";

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

export default function Workflow() {
    return (
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
    )
}