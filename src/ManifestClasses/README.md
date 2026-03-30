# Manifest Classes

This folder contains the mutable domain model used by the manifest editor.

## What Lives Here

- `ManifestObject.ts`: the root manifest model. It owns manifest-level fields
  such as `label`, `summary`, `rights`, `navDate`, `behavior`, and the top-level
  `items` array.
- `Container.ts`: the current `Scene`, `Canvas`, or `Timeline` wrapper under the
  manifest.
- `AnnotationPage.ts`: holds the list of annotations for a container.
- `Annotation.ts`: represents a single annotation and its target/body metadata.
- `TextAnnotation.ts`: comment-style point annotation used for visible 3D text
  hotspots.
- `ContentResource.ts`: base annotation body data such as format, dimensions,
  duration, label, summary, and metadata.
- `Light.ts`: scene light resource with color, angle, intensity, look-at, and
  point target support.
- `Camera.ts`: scene camera resource with clipping planes, orthographic or
  perspective settings, and point target support.
- `Target.ts`: serializes `SpecificResource` point targets used by cameras,
  lights, content resources, and text annotations.
- `Label.ts`: wraps language-mapped text values such as `{ "en": ["Title"] }`.

## How The Editor Uses These Classes

- The React UI keeps a single `ManifestObject` instance in context.
- Editor components mutate that object through explicit methods such as
  `setLabel(...)`, `setSummary(...)`, `setX(...)`, or `setFieldOfView(...)`.
- After a mutation, the UI replaces the root object with `manifestObj.clone()`
  so React re-renders.
- Download and JSON preview both serialize this model through
  `JSON.stringify(...)`, which uses the `toJSON()` methods defined here.

## Serialization Notes

- Serialization rules live with the model classes through `toJSON()`.
- `Target.ts` exports `SpecificResource.source` as an array to match the
  Voyager-tested draft format used on `develop`.
- Scene text annotations are emitted in the scene annotation page with a point
  `target` and visible `label` so the Voyager demo can render them as hotspots.
- Cameras, lights, and content resources with coordinates also use point-target
  serialization through `Target.ts`.

## Conventions

- Keep serialization rules close to the model by using `toJSON()` on classes
  that need custom output.
- Keep language-aware text inside `Label`.
- Prefer adding small, explicit mutation methods instead of letting UI code
  assign directly to fields.
- Treat these classes as the source of truth for manifest structure, not the UI
  components.
