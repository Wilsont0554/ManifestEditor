import { type KeyboardEvent as ReactKeyboardEvent, useState } from "react";
import SoftActionButton from "./inputs/soft-action-button";

function ManifestCustomBehaviorEditor({
  behaviors,
  reservedBehaviors,
  onAddBehavior,
  onRemoveBehavior,
}) {
  const reservedBehaviorSet = new Set<string>(reservedBehaviors);
  const [isFormVisible, setFormVisible] = useState(false);
  const [draft, setDraft] = useState("");
  const trimmedDraft = draft.trim();
  const isReservedDraft =
    trimmedDraft.length > 0 && reservedBehaviorSet.has(trimmedDraft);
  const isDuplicateDraft =
    trimmedDraft.length > 0 && behaviors.includes(trimmedDraft);
  const canAddBehavior =
    trimmedDraft.length > 0 && !isReservedDraft && !isDuplicateDraft;

  function resetForm(): void {
    setDraft("");
    setFormVisible(false);
  }

  function handleAddBehavior(): void {
    if (!canAddBehavior) {
      return;
    }

    if (onAddBehavior(trimmedDraft)) {
      resetForm();
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddBehavior();
    }

    if (event.key === "Escape") {
      resetForm();
    }
  }

  let message: string | null = null;

  if (isReservedDraft) {
    message = "Use the built-in behavior controls above for this value.";
  } else if (isDuplicateDraft) {
    message = "This behavior is already attached to the manifest.";
  }

  return (
    <div className="space-y-4">
      {behaviors.length > 0 ? (
        <div className="overflow-hidden border-t border-slate-200">
          {behaviors.map((behavior) => (
            <div
              key={behavior}
              className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4"
            >
              <span className="text-base text-slate-900">{behavior}</span>
              <button
                type="button"
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-sm bg-white px-3 text-2xl leading-none text-rose-500 transition hover:text-rose-700"
                onClick={() => onRemoveBehavior(behavior)}
                aria-label={`Remove custom behavior ${behavior}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {isFormVisible ? (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <label
            htmlFor="manifest-custom-behavior"
            className="block text-sm font-medium text-slate-700"
          >
            Custom behavior
          </label>
          <input
            id="manifest-custom-behavior"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:border-pink-500 focus:outline-none"
            placeholder="e.g. preview"
            autoFocus
          />
          {message ? <p className="text-sm text-rose-600">{message}</p> : null}
          <div className="flex flex-wrap gap-2">
            <SoftActionButton
              onClick={handleAddBehavior}
              disabled={!canAddBehavior}
            >
              Save behavior
            </SoftActionButton>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-4 py-2 text-base font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <SoftActionButton onClick={() => setFormVisible(true)}>
        <span className="text-2xl leading-none">+</span>
        <span className="text-base">Add custom behavior</span>
      </SoftActionButton>
    </div>
  );
}

export default ManifestCustomBehaviorEditor;
