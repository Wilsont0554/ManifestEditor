import { useState } from "react";
import type { ContentResourceItem } from "@/utils/content-resource";
import { getContentResourceDisplayTitle } from "@/utils/content-resource";

interface ContentResourceMediaListProps {
  items: ContentResourceItem[];
  className?: string;
}

function ImagePreviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 text-slate-500"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
      <path
        d="m7 16 3.5-3.5 2.5 2.5 3-3 3 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModelPreviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 text-slate-500"
      aria-hidden="true"
    >
      <path
        d="m12 3.5 7 4v9l-7 4-7-4v-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m12 3.5 7 4-7 4-7-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5v9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MediaPreview({ item }: { item: ContentResourceItem }) {
  const [hasImageError, setHasImageError] = useState(false);
  const previewUrl = item.resource.id.trim();
  const isImage = item.resource.getType() === "Image" && previewUrl.length > 0;

  if (isImage && !hasImageError) {
    return (
      <img
        src={previewUrl}
        alt={getContentResourceDisplayTitle(
          item.annotation,
          item.resource,
          item.resourceNumber,
        )}
        className="h-full w-full object-cover"
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      {item.resource.getType() === "Model" ? (
        <ModelPreviewIcon />
      ) : (
        <ImagePreviewIcon />
      )}
    </div>
  );
}

function ContentResourceMediaList({
  items,
  className = "",
}: ContentResourceMediaListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const title = getContentResourceDisplayTitle(
          item.annotation,
          item.resource,
          item.resourceNumber,
        );
        const detail = item.resource.getFormat() || item.resource.getType();

        return (
          <article
            key={`content-resource-media-${item.annotationIndex}`}
            className="flex items-start gap-3 rounded-md border border-slate-300 bg-white p-3 shadow-sm"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-slate-100">
              <MediaPreview
                key={`${item.resource.getType()}-${item.resource.id}`}
                item={item}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-slate-900">
                    {title}
                  </p>
                  <p className="mt-2 truncate text-sm text-slate-400">
                    {item.resource.id}
                  </p>
                </div>

                <p className="shrink-0 text-sm text-slate-400">{detail}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ContentResourceMediaList;
