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

function LightPreviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 text-slate-500"
      aria-hidden="true"
    >
      <path
        d="M12 3.5a5.75 5.75 0 0 0-3 10.66c.8.48 1.3 1.31 1.3 2.23V17h3.4v-.61c0-.92.5-1.75 1.3-2.23A5.75 5.75 0 0 0 12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 20h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MediaPreview({ item }) {
  const isLight = (item.resource.getType().includes("Light"));

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      {isLight ? (
        <LightPreviewIcon />
      ) : item.resource.getType() === "Model" ? (
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
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const resourceType = item.resource.getType();
        const target = item.annotation.getTarget();
        const coordinateDetail = target
          ? `X ${target.getX()}  Y ${target.getY()}  Z ${target.getZ()}`
          : null;

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
                  </p>
                  <p className="mt-2 truncate text-sm text-slate-400">
                    {item.resource.id}
                  </p>
                  {coordinateDetail ? (
                    <p className="mt-1 text-sm text-slate-400">
                      {coordinateDetail}
                    </p>
                  ) : null}
                </div>

                <p className="shrink-0 text-sm text-slate-400"></p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ContentResourceMediaList;
