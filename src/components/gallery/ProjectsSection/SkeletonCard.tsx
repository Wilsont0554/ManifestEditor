type Props = {
  index: number;
};

/**
 * Animated placeholder shown in the project grid while manifests are loading
 * from IndexedDB. Mirrors the dimensions and structure of a real ProjectCard
 * so the layout doesn't shift once data arrives.
 * @param index zero-based position used to render a stable index label
 */
export default function SkeletonCard({ index }: Props) {
  return (
    <div className="relative flex animate-pulse flex-col overflow-hidden rounded-sm border border-slate-200 bg-white">
      <span className="absolute left-2 top-2 z-10 text-[10px] font-medium tracking-[0.15em] text-slate-300">
        № {String(index + 1).padStart(3, "0")}
      </span>
      <div className="aspect-square w-full bg-slate-100" />
      <div className="flex flex-col gap-1 px-2.5 py-2">
        <div className="h-3 w-3/4 rounded-sm bg-slate-200" />
        <div className="h-2 w-1/2 rounded-sm bg-slate-100" />
      </div>
    </div>
  );
}
