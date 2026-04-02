# Shared Components

This folder contains app-wide React components that are not specific to one editor surface.

## Current Focus

- `inputWithLanguage.tsx`: renders a language-aware textarea with a language picker.

## `InputWithLanguage`

Use this component for manifest fields whose value is stored as a language map.

Behavior:

- It is a controlled component. The caller owns the value and language code.
- It does not store manifest data itself.
- It shows the currently selected language code in the action chip.
- It only offers supported IIIF language codes. English is the default fallback in the model.

## Usage Guidance

- Keep manifest-specific labels and wiring in the tab components.
- Keep reusable interaction and presentational behavior here.
- If a component becomes editor-specific, move it into the relevant feature folder instead of growing this folder into a catch-all.
