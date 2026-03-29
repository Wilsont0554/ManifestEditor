import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { manifestObjContext } from "@/context/manifest-context";
import Camera from "@/ManifestClasses/Camera";
import Light from "@/ManifestClasses/Light";
import {
  getContentResourceItems,
  type EditableContentResourceType,
} from "@/utils/content-resource";
import CameraResourceTechnicalEditor from "./shared/camera-resource-technical-editor";
import ContentResourceEditor from "./shared/content-resource-editor";
import LightResourceTechnicalEditor from "./shared/light-resource-technical-editor";

export type ContentResourceModalView = "picker" | "editor";

const DEFAULT_MANIFEST_LABEL = "Blank Manifest";
const dialogTitleId = "content-resource-modal-title";
const dialogDescriptionId = "content-resource-modal-description";

interface ContentResourceModalProps {
  isOpen: boolean;
  view: ContentResourceModalView;
  selectedAnnotationIndex: number;
  onClose: () => void;
  onSelectType: (type: EditableContentResourceType) => void;
}

interface ContentResourceOption {
  value: EditableContentResourceType;
  title: string;
  description: string;
  icon: ReactNode;
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-14 w-14 text-slate-950"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="10"
        width="32"
        height="28"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="18" cy="19" r="3.5" fill="currentColor" />
      <path
        d="M13 33l8-8 6 6 5-5 6 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-14 w-14 text-slate-950"
      aria-hidden="true"
    >
      <path
        d="m24 7 13 7.5v15L24 37l-13-7.5v-15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="m24 7 13 7.5-13 7.5-13-7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M24 22v15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-14 w-14 text-slate-950"
      aria-hidden="true"
    >
      <path
        d="M24 8c-6.9 0-12.5 5.6-12.5 12.5 0 4.6 2.4 8.8 6.3 11.1 1.5.9 2.4 2.4 2.4 4v1.4h7.6V35.6c0-1.6.9-3.1 2.4-4 3.9-2.3 6.3-6.5 6.3-11.1C36.5 13.6 30.9 8 24 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 40h11"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 44h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-14 w-14 text-slate-950"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="14"
        width="28"
        height="20"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="24"
        cy="24"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M16 14V10.5h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 14V10.5h2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const baseContentResourceOptions: ContentResourceOption[] = [
  {
    value: "Image",
    title: "Image",
    description: "Add an image content resource.",
    icon: <ImageIcon />,
  },
  {
    value: "Model",
    title: "Model",
    description: "Add a 3D model content resource.",
    icon: <ModelIcon />,
  },
  {
    value: "Light",
    title: "Light",
    description: "Add a light content resource.",
    icon: <LightIcon />,
  },
  {
    value: "Camera",
    title: "Camera",
    description: "Add a camera content resource.",
    icon: <CameraIcon />,
  },
];

function ContentResourceModal({
  isOpen,
  view,
  selectedAnnotationIndex,
  onClose,
  onSelectType,
}: ContentResourceModalProps) {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const isSceneContainer = manifestObj.getContainerObj().getType() === "Scene";
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const annotations = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations();
  const contentResourceItems = getContentResourceItems(manifestObj);
  const selectedAnnotation =
    view === "editor"
      ? annotations[selectedAnnotationIndex] ?? null
      : null;
  const selectedResource = selectedAnnotation?.getContentResource() ?? null;
  const selectedResourceItem =
    selectedAnnotation && selectedResource
      ? contentResourceItems.find(
          (item) => item.annotationIndex === selectedAnnotationIndex,
        ) ?? null
      : null;
  const contentResourceOptions = baseContentResourceOptions.filter(
    (option) =>
      (option.value !== "Light" && option.value !== "Camera") || isSceneContainer,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  function commitManifestChange(): void {
    updateManifestObj(manifestObj.clone());
  }

  function syncManifestLabel({
    previousValue,
    previousLanguageCode,
    value,
    languageCode,
  }: {
    previousValue: string;
    previousLanguageCode: string;
    value: string;
    languageCode: string;
  }): void {
    const currentManifestLabel = manifestObj.getLabelValue().trim();
    const currentManifestLabelLanguage = manifestObj.getLabelLanguage();
    const isManifestLabelBlank =
      currentManifestLabel.length === 0 ||
      currentManifestLabel === DEFAULT_MANIFEST_LABEL;
    const matchesPreviousResourceLabel =
      currentManifestLabel === previousValue.trim() &&
      currentManifestLabelLanguage === previousLanguageCode;

    if (!value.trim() || (!isManifestLabelBlank && !matchesPreviousResourceLabel)) {
      return;
    }

    manifestObj.setLabel(value);
    manifestObj.setLabelLanguage(languageCode);
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30">
      <div
        className="absolute inset-0 h-full w-full bg-slate-900/35"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full items-start justify-center overflow-y-auto p-4 sm:p-6">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          aria-describedby={dialogDescriptionId}
          onKeyDown={handleDialogKeyDown}
          className={`w-full rounded-3xl bg-white shadow-2xl ${
            view === "picker" ? "max-w-3xl" : "max-w-2xl"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
            <div className="space-y-1">
              <h2
                id={dialogTitleId}
                className="text-2xl font-semibold tracking-tight text-slate-950"
              >
                {view === "picker" ? "Add content" : "Content resource"}
              </h2>
              <p id={dialogDescriptionId} className="text-sm text-slate-500">
                {view === "picker"
                  ? "Choose the content resource type you want to add."
                  : "Complete the content resource details below."}
              </p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-4xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={onClose}
              aria-label="Close content resource modal"
            >
              &times;
            </button>
          </div>

          <div className="px-6 py-6 sm:px-7 sm:py-7">
            {view === "picker" ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {contentResourceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="group flex h-full flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-pink-300 hover:bg-rose-50/50"
                    onClick={() => onSelectType(option.value)}
                  >
                    <div className="flex w-full items-center justify-center rounded-xl bg-slate-200 py-6 transition group-hover:bg-white">
                      {option.icon}
                    </div>
                    <div className="pt-4">
                      <p className="text-xl font-semibold text-slate-950">
                        {option.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : selectedAnnotation && selectedResource ? (
              <section className="rounded-2xl border border-pink-200 bg-slate-100 p-5">
                <button
                  type="button"
                  className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-pink-200"
                >
                  Content Resource {selectedResourceItem?.resourceNumber ?? 1}
                </button>

                <ContentResourceEditor
                  annotation={selectedAnnotation}
                  resource={selectedResource}
                  idPrefix={`content-resource-modal-${selectedAnnotationIndex}`}
                  onCommit={commitManifestChange}
                  onResourceLabelSync={syncManifestLabel}
                  className="pt-5"
                  showTypeSelector={false}
                  showMetadataAction={false}
                />

                {selectedResource instanceof Camera ? (
                  <div className="pt-6">
                    <CameraResourceTechnicalEditor
                      annotation={selectedAnnotation}
                      resource={selectedResource}
                      idPrefix={`content-resource-modal-camera-${selectedAnnotationIndex}`}
                      onCommit={commitManifestChange}
                    />
                  </div>
                ) : null}

                {selectedResource instanceof Light ? (
                  <div className="pt-6">
                    <LightResourceTechnicalEditor
                      annotation={selectedAnnotation}
                      resource={selectedResource}
                      idPrefix={`content-resource-modal-light-${selectedAnnotationIndex}`}
                      onCommit={commitManifestChange}
                    />
                  </div>
                ) : null}
              </section>
            ) : (
              <p className="text-sm text-slate-500">
                No content resource is available to edit.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentResourceModal;
