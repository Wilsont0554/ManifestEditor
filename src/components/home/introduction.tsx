import Icon from "@/components/icon";

export default function Introduction() {
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
      description:
        "Structure scenes, canvases, timelines, and annotation pages.",
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
  
  return (
    <section className="rounded-[1.25rem] border border-slate-200 bg-white/95 p-6 text-center shadow-sm backdrop-blur sm:p-8">
      <h2 className="text-3xl font-black tracking-tight text-slate-950">
        What is the Manifest Editor?
      </h2>
      <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-slate-600">
        The Manifest Editor helps you create structured descriptions of digital
        objects like images, videos, and 3D models using the IIIF standard.
        Instead of writing JSON manually, you build manifests visually.
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
  );
}
