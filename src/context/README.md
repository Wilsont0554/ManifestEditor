# Manifest Context

This folder contains React context used to share manifest editor state.

## `manifest.tsx`

`ManifestObjProvider` is the source of truth for the live `ManifestObject` instance used across the editor.

It exposes:

- `manifestObj`: the current mutable manifest model.
- `updateManifestObj(...)`: replaces the root manifest object so React re-renders after model mutations.
- `isFieldEdited(...)`: compares selected manifest fields against the initial snapshot captured when the provider is created.

## Why The Snapshot Exists

Overview needs to know which fields were actually changed without hard-coding default text or language values inside the tab.

The provider captures an initial snapshot once, then compares current values against that baseline. This keeps edit detection centralized and avoids magic values in UI components.
