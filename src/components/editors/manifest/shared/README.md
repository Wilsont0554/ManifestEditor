# Manifest Shared UI

This folder contains reusable UI building blocks for the manifest editor tabs.

Use these components when building or updating a manifest tab so the editor stays visually consistent and style changes stay centralized.

## Rules

- Keep one-off layout classes inside the tab component.
- Extract repeated manifest-tab UI into shared components here.
- Do not create a new shared component for a single use case.
- Do not move manifest-specific UI into `src/components/shared` unless it is truly app-wide.
- Keep global CSS in `src/index.css` only for global concerns such as resets and custom scrollbars.

## What To Use

### `ManifestTabBody`

Use for the outer wrapper of a manifest tab.

Use when:
- You need the default vertical spacing between sections.
- You want the standard manifest tab base height/layout.

### `ManifestField`

Use for a labeled section that renders custom content.

Use when:
- You need a section label and your content is not a plain input.
- You are composing cards, upload areas, custom selectors, or grouped controls.

### `ManifestInput`

Use for plain text-like inputs inside manifest tabs.

Use when:
- You need a standard text input.
- You need a boxed input such as a date/time control.

Variants:
- `appearance="underline"`: underlined field style.
- `appearance="outline"`: outlined field style.

### `SoftActionButton`

Use for the pink secondary action buttons such as `Add Thumbnail` or `Add Provider`.

Use when:
- The action is secondary and should match the manifest editor accent style.

### `EmptyStateCard`

Use for placeholder states such as "No thumbnail" or "No required statement".

Use when:
- A section has no data yet.
- You need a centered or left-aligned empty state with optional action content.

### `InputWithLanguage`

This component lives in `src/components/shared/inputWithLanguage.tsx`, but it should be the default choice for manifest fields like `Label` and `Summary`.

Use when:
- The field value is language-aware.
- You need the language chip and language picker behavior.

## Typical Imports

```tsx
import InputWithLanguage from "@components/shared/inputWithLanguage";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestField from "../shared/manifest-field";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";
```

## Example

```tsx
function ExampleTab() {
  const [title, setTitle] = useState("");
  const [navDate, setNavDate] = useState("");

  return (
    <ManifestTabBody>
      <ManifestInput
        label="Title"
        id="manifest-title"
        value={title}
        onChange={setTitle}
      />

      <ManifestInput
        label="Nav Date"
        id="manifest-nav-date"
        type="datetime-local"
        value={navDate}
        onChange={setNavDate}
        appearance="outline"
      />

      <ManifestField label="Provider" className="space-y-3">
        <EmptyStateCard
          description="Add a provider to attach your institution name and logo to this Manifest."
          align="left"
          className="border border-slate-200 bg-slate-50"
        />
        <SoftActionButton>Add Provider</SoftActionButton>
      </ManifestField>
    </ManifestTabBody>
  );
}
```

## When To Add Another Shared Component

Add a new shared component only if:
- The same UI pattern appears in multiple manifest tabs.
- Centralizing it will reduce repeated class strings or repeated markup.
- The component API stays small and obvious.

If the pattern is only used once, keep it local to the tab.
