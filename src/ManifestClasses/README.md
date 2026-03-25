# Manifest Classes

This folder contains the mutable domain model used by the manifest editor.

## What Lives Here

- `ManifestObject.ts`: the root manifest model. It owns manifest-level fields such as `label`, `summary`, `rights`, `navDate`, and the top-level `items` array.
- `Container.ts`: the current canvas/scene/timeline-like wrapper under the manifest.
- `AnnotationPage.ts`: holds the list of annotations for a container.
- `Annotation.ts`: represents a single annotation and its target/body metadata.
- `ContentResource.ts`: represents annotation body data such as format, dimensions, duration, label, and summary.
- `Label.ts`: wraps language-mapped text values such as `{ "en": ["Title"] }`.

## How The Editor Uses These Classes

- The React UI keeps a single `ManifestObject` instance in context.
- Tab components mutate that object through explicit methods such as `setLabel(...)` or `setSummary(...)`.
- After a mutation, the UI replaces the root object with `manifestObj.clone()` so React re-renders.
- Download and JSON preview both serialize this model through `JSON.stringify(...)`, which uses the `toJSON()` methods defined here.

## Conventions

- Keep serialization rules close to the model by using `toJSON()` on classes that need custom output.
- Keep language-aware text inside `Label`.
- Prefer adding small, explicit mutation methods instead of letting UI code assign directly to fields.
- Treat these classes as the source of truth for manifest structure, not the tab components.

The branch develop has a lights and 3d dimentions features, like color for the lights, angle and coordinates. Add a new button in the content resource called Light next to the model, and when you click on that it will take you content resource popup where you add a URL, annotation label and content resorce label. After everything is filled out you should be able to edit those lights and coordinates stuffs from the Technical Tab. Add a section below the identifier for those changes. And then, all the changes to the Technical tab should be shown in the overview tab just like the other tabs. And ofcourse the json it creates. The functionality of that should be exactly like in the develop branch. When you pull from the develop branch don't merge any of the json files and keep the folder structure exactly like what we have right now. Simply just pull the Lights and 3d coordinates. I think thats the last two commits on the develop branch.