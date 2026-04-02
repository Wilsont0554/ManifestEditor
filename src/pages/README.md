# Pages

This folder contains route-level page components.

## `manifest-editor.tsx`

This page assembles the manifest editing experience.

It is responsible for:

- rendering the editor shell
- opening and resizing the inspector panel
- switching the container type
- adding content resources
- showing the live JSON preview
- downloading the serialized manifest JSON

## Data Flow

- The page reads `manifestObj` from `manifestObjContext`.
- It passes the inspector UI through `ManifestComponent`.
- It renders the JSON preview from serialized manifest data so the preview matches the downloaded file.
