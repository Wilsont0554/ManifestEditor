import Icon from "@/components/icon";

export default function Audience() {
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
  
  return (
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
  );
}
