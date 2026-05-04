type Props = {
  children: React.ReactNode;
};

/**
 * Responsive grid wrapper used for project tiles and skeleton placeholders.
 * Scales from 2 columns on mobile up to 5 columns on xl viewports.
 * @param children grid items to lay out (typically ProjectCard or SkeletonCard)
 */
export default function ProjectGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}
