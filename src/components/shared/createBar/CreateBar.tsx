import Button from "../button";

interface CreateBarProps {
  isAutoUpdateEnabled: boolean;
  gistId: string | null;
  handleOpenContentResourceModal: () => void;
  handleOpenTempModal: () => void;
  handleCreateTextAnnotation: () => void;
  handlePublishManifest: () => void;
}

function CreateBar({
  isAutoUpdateEnabled,
  gistId,
  handleOpenContentResourceModal,
  handleOpenTempModal,
  handleCreateTextAnnotation,
  handlePublishManifest,
}: CreateBarProps) {
  return (
    <div className="mr-auto max-w-245 space-y-4 pb-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {isAutoUpdateEnabled && gistId && (
            <span className="w-full text-xs text-slate-500">
              Auto-Update enabled
            </span>
          )}

          <Button
            type="button"
            className="bg-pink-600! hover:bg-pink-700!"
            onClick={handlePublishManifest}
          >
            Publish
          </Button>

          <Button
            type="button"
            onClick={handleOpenContentResourceModal}
          >
            Create Asset
          </Button>

          <Button
            type="button"
            onClick={handleOpenTempModal}
          >
            Create Environment
          </Button>

          <Button
            type="button"
            onClick={handleCreateTextAnnotation}
          >
            Add Text Annotation
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateBar;
