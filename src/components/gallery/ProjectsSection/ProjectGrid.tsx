import { Children, useRef } from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * Responsive grid wrapper used for project tiles and skeleton placeholders.
 * Scales from 2 columns on mobile up to 5 columns on xl viewports.
 * @param children grid items to lay out (typically ProjectCard or SkeletonCard)
 */
export default function ProjectGrid({ children }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "left" | "right") {
    scrollerRef.current?.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative min-w-0 max-w-full overflow-hidden">
      <div
        ref={scrollerRef}
        className="flex w-full max-w-full snap-x gap-4 overflow-x-auto px-12 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="w-[16rem] shrink-0 snap-start sm:w-[18rem]">
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard("left")}
        className="absolute left-1 top-1/2 z-10 inline-flex h-20 w-14 -translate-y-1/2 items-center justify-center text-5xl font-black text-pink-600 drop-shadow-[0_2px_0_rgba(15,23,42,0.20)] transition hover:-translate-x-1 hover:scale-110 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        aria-label="Scroll projects left"
      >
        &laquo;
      </button>
      <button
        type="button"
        onClick={() => scrollByCard("right")}
        className="absolute right-1 top-1/2 z-10 inline-flex h-20 w-14 -translate-y-1/2 items-center justify-center text-5xl font-black text-pink-600 drop-shadow-[0_2px_0_rgba(15,23,42,0.20)] transition hover:translate-x-1 hover:scale-110 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
        aria-label="Scroll projects right"
      >
        &raquo;
      </button>
    </div>
  );
}
