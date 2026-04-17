import Button
 from "../button";

function CreateBar({isAutoUpdateEnabled, gistId, handleOpenContentResourceModal, handleOpenTempModal, handleCreateTextAnnotation} : any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {isAutoUpdateEnabled && gistId && (
          <span className="w-full text-xs text-slate-500">
            Auto-Update enabled
          </span>
        )}

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
  );
}

export default CreateBar;
