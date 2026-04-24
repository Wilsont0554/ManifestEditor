# Manifest Tabs

This folder contains the inspector tab bodies for the manifest editor.

## Responsibilities

- Each file owns one tab section of the right-side manifest inspector.
- Tabs should focus on UI for one concern and read/write data through `manifestObjContext`.
- Shared layout and field components should come from `../shared` or `src/components/shared`.

## Current Behavior

- `overview-tab.tsx`: shows only fields that have been edited relative to the initial manifest snapshot. Edited descriptive and technical fields remain editable from Overview.
- `descriptive-tab.tsx`: edits manifest-level descriptive fields such as `label`, `summary`, `rights`, and `navDate`.
- `environment-tab.tsx`: edits manifest-level environment fields such as `id`, `viewingDirection`, built-in `behavior` values, and custom behaviors.
- The remaining tab files are placeholders or future expansion points.

## State Rules

- Do not keep duplicate manifest values in local component state when the value belongs in the manifest model.
- Local state is fine for UI-only concerns such as temporary file previews, toggles, or open/closed controls.
- When a tab mutates `manifestObj`, it should call `updateManifestObj(manifestObj.clone())` so the rest of the editor updates.
