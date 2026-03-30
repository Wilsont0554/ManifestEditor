# Manifest Editor

TypeScript/TSX manifest editor for building IIIF Presentation 4 manifests with
scene, canvas, and timeline containers.

## Current Scope

- Manifest-level editing for descriptive and technical fields
- Content resource editing for models, images, lights, and cameras
- Metadata editing for manifests and content resources
- Text annotation editing with 3D point targets
- JSON preview and manifest download from the editor UI

## 3D / Voyager Notes

- Scene manifests can include models, lights, cameras, and text annotations
- `SpecificResource.source` is exported as an array to match the older
  Voyager-tested draft shape used by `develop`
- Text annotations are exported as scene-level point annotations with a visible
  `label`, which allows the Voyager demo to render hotspot labels on the model

## Project Structure

- `src/ManifestClasses`: mutable domain model and JSON serialization
- `src/context`: React context for the editor state and snapshots
- `src/pages`: top-level app pages
- `src/components/editors/manifest`: manifest editor UI, tabs, modal, and shared
  controls

## Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Verify types:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```
