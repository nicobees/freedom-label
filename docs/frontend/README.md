# Freedom Label Frontend Documentation

This documentation provides a technical overview of the frontend application in `packages/frontend` and a guide for contributors.

- Audience: developers joining or working on the project.
- Scope: project structure, routing, UI and responsiveness, styling, testing, and key runtime flows.

## Contents

- Overview
- Project structure
- Routing
- Layout & UI
- Styling & themes
- Create Label Form (architecture)
  - Validation
- Testing
- Next steps
- Persistence (Printed Labels)
- Testing (updated)
- Maintenance & future enhancements

## Overview

The application is a React + TypeScript SPA built with Vite. Navigation uses TanStack Router. The app follows a mobile-first, pure CSS approach to ensure compatibility with the production environment.

Key libraries:

- React 19
- TanStack Router v1
- TanStack React Form v1 (Create Label form)
- Zod (validation integrated with the form and submit transforms)
- Testing Library + Vitest

## Project structure

Inside `packages/frontend/src`:

- `assets/` – static assets like images and SVGs.
- `components/` – reusable presentational and container components.
- `config/` – configuration modules.
- `contexts/` – React contexts and providers.
- `hooks/` – custom React hooks.
- `routes/` – route tree and view components per route. Entry: `routes/index.tsx`.
- `services/` – API clients and service modules.
- `styles/` – global styles and CSS variables.
- `utils/` – utilities and helpers.
- `validation/` – Zod schemas and validators.

Entry points:

- `main.tsx` – app bootstrap, sets up the router and global styles.

## Routing

The application uses TanStack Router v1 with a root layout and child routes. The router is created in `src/routes/index.tsx`.

Highlights:

- Route tree is built from a `rootRoute` created via `createRootRouteWithContext`.
- A small `Paths` const centralizes path strings for Home, Create, and List.
- We export `createAppRouter(history?)`, `router`, and `createMemoryAppRouter([...])` for tests.
- Router type is registered via module augmentation inside `src/routes/index.tsx` (no separate `.d.ts`).

Routes:

- `/` – Home view implemented in `src/routes/HomePage/HomePage.tsx`. It shows two primary actions centered on the page: a "Create Label" link and a disabled "Label List" button with tooltip "Not available yet" (stacked vertically on small screens).
- `/create` – Create Label view implemented in `src/routes/CreateLabelPage/CreateLabelPage.tsx` with a TanStack Form: two sections (Patient Info, Lens specs) and actions (Save disabled, Print). The page renders a single `AppForm` instance that wraps sections and actions.
- `/list` – List Label view (disabled for MVP; route exists and shows a disabled message). The header link is disabled and shows a tooltip "Not available yet".
- `*` – Not Found page.

Testing the routing:

- `src/routes/index.test.tsx` asserts that each path renders the correct page using a memory router.
- `src/routes/HomePage/HomePage.test.tsx` verifies the homepage actions render and navigation to Create works.
- `src/routes/CreateLabelPage/CreateLabelPage.test.tsx` asserts form presence, the two sections, and the actions.

## Layout & UI

- A sticky Header component (`src/components/Header/Header.tsx`) is always visible.
- It shows a dynamic title based on the current route (Home, Create Label, List Label, Not Found).
- Left control: on Home it shows a disabled hamburger button with tooltip "Not available yet"; on other views it shows a back arrow link to Home with a small rotation hover/focus animation.
- Right control: a language icon button toggles an accessible dropdown with a single option (English) for now. It does not refresh the page; i18n integration will come in a later story.
- Main content is wrapped in `<main.app-main>`; layout is responsive and mobile-first.
- Accessibility: semantic landmarks and live region on the header title via `aria-live="polite"`. Secondary section headings are `aria-hidden` to avoid duplicate accessible headings.

## Styling & themes

- Pure CSS with a mobile-first approach. No external CSS frameworks.
- Global styles and CSS variables in `src/styles/global.css`.
- Current variables (dark baseline):
  - `--bg`, `--fg`, `--muted`, `--primary`.
- Themes (from business requirements):
  - Freedom Blue (light) and Freedom Darker (dark). Theme implementation will be added in a dedicated story; variables should be extended there.
- Icons must be stored as SVGs within the repo (e.g., `src/assets`).

## Create Label Form (architecture)

Location: `src/components/CreateLabelForm`

Main pieces:

- `LensSpecSection.tsx` – Renders the two-column Lens Specs UI inside the form.
- `LensSpecColumn.tsx` – Column component bound to one side (left or right); includes an Enable toggle and a copy action to mirror values across sides.
- `ManufacturingSection.tsx` – Description and date fields using shared field components.
- `PatientInfoSection.tsx` – Name and Surname fields.
- `fields/` – Reusable field components:
  - `TextField.tsx`, `DateField.tsx`
  - `FloatNumberField.tsx` – numeric input with optional sign select (`withSign`), used by PWR/CYL/ADD; supports controlled value and disabled state when needed.
  - `CheckboxField.tsx` – only the box toggles (text is non-clickable) to avoid accidental changes.
- `SubmitButton.tsx` – `PrintButton` subscribes to form state and enables only when not submitting, not pristine, and touched.
- `defaultValues.ts` – Form default values used by sections and tests.

Form hook and contexts:

- `src/hooks/useCreateLabelForm.ts` creates the form with TanStack React Form v1 (`createFormHook`), exports `withForm` HOC and field components, and wires validators (Zod) with sensible debounce.
- Test wrappers use a single `AppForm` instance to provide context in tests (see Testing section).

Lens Specs UX:

- Each side has an Enable toggle and a grid of fields (BC, DIA, PWR±, CYL±, AX, ADD±, SAG).
- Copy actions: "Copy left → right" and "Copy right ← left" mirror values across sides.
- When a side is disabled, its values are preserved for display and can be re-enabled later without losing them.

### Validation

File: `src/validation/schema.ts`

- `LensSide` is a const object export (not a TS enum) for compatibility with the current TS config (`erasableSyntaxOnly`). Use `type LensSide = typeof LensSide[keyof typeof LensSide]`.
- Lens Specs are modeled as a grid per side: `{ enabled: boolean, data?: LensSpecsData | null }` for both `left` and `right`.
- `LabelDataSchema` is used for on-change/on-mount validation during editing.
- `LabelDataSubmitSchema` transforms each side to `null` when disabled and enforces "at least one side" via `superRefine` at submit time.
- Note: Avoid accessing `.shape` on a Zod schema after `superRefine` (it becomes a `ZodEffects`). Use explicit validators (e.g., `z.boolean()` for the enable toggle) and perform transforms at submit.

## Testing

- Test runner: Vitest (jsdom environment).
- Utilities: Testing Library, jest-dom.
- Config files:
  - `vitest.config.ts` – test environment and setup.
  - `vitest.setup.ts` – imports jest-dom matchers.

Utilities and wrappers:

- `src/test-utils/form.tsx` provides `renderWithForm` and `renderWithFormAndButtons` which wrap components in a real `AppForm` context (and include the `PrintButton` when needed). Use these for form-bound components to avoid context errors.

### a11y testing helpers (for debugging)

When diagnosing selector issues in tests, you can temporarily use the accessibility helpers in `src/test-utils/a11y.ts`:

- `debugRoles(container)` logs all available ARIA roles in the rendered output.
- `assertHasRole(container, role)` ensures at least one element with a given role exists.
- `assertRoleCount(container, role, count)` asserts the exact count for a role.

Usage example (keep commented or remove before committing):

```tsx
// import { debugRoles, assertHasRole } from '@/test-utils/a11y';
// const { container } = render(<MyComponent />);
// debugRoles(container); // prints roles to the console
// assertHasRole(container, 'button');
```

## Persistence (Printed Labels)

Printed label submissions are persisted locally to allow future retrieval (e.g. a forthcoming Label List or re-print feature) without requiring an immediate backend dependency.

Implementation details:

- Hook: `src/hooks/useLabelLocalStorage.ts`
  - Storage key: `freedom-label:printed-labels:v1`.
  - Structure stored: a `Map<string, { hash: string; payload: LabelDataSubmit; timestamp: number }>`.
  - Hashing: Uses a deterministic `djb2` hash (`src/utils/hash.ts`) of the JSON-stringified label payload to deduplicate entries.
  - On first import, ensures an empty Map is initialized if the key is missing.
  - `saveLabel(labelData)` computes the hash, checks Map existence, and inserts only if new.
  - `getLabels()` returns an array of stored objects (values of the Map).
- Serialization helpers: `jsonStringify` / `jsonParse` in `src/utils/jsonHandler.ts` transparently serialize Maps via a `{ dataType: 'Map', value: [ [k,v], ...] }` wrapper and revive them on parse.
- Consumer flow (Print): `CreateLabelPage` passes a validated `LabelDataSubmit` object to `saveLabel` inside the `onSubmitHandler` invoked by the form's `PrintButton` (which triggers `form.handleSubmit()`).

Why a Map?

- O(1) duplicate detection via hash key.
- Natural iteration while keeping insertion order (helpful for future chronological listing).
- Simple migration path: a future version key (e.g., `:v2`) could represent a different stored shape; current parser fails gracefully if JSON shape is unexpected.

Error tolerance:

- If JSON parsing throws a `SyntaxError`, `getItemFromLocalStorage` returns the raw string, protecting against corrupted entries while avoiding a hard crash.

### Example (conceptual)

```
freedom-label:printed-labels:v1 => {
  dataType: 'Map',
  value: [
    [ '12345678', { hash: '12345678', payload: { ...LabelDataSubmit }, timestamp: 1735123456789 } ],
    [ 'abcd9012', { hash: 'abcd9012', payload: { ... }, timestamp: 1735123499999 } ]
  ]
}
```

## Testing (updated)

New tests were added to cover persistence logic:

- `src/utils/tests/localStorage.test.ts`
  - Verifies presence checks, primitive round-trip, Map serialization + revival, null handling, and malformed JSON fallback.
- `src/routes/CreateLabelPage/tests/CreateLabelPage.test.tsx`
  - Adds a test that fills the form (using the temporary fill button) and clicks Print, asserting that the storage key is populated with a serialized Map containing at least one entry.

All tests follow the documented guidelines: flat `test()` blocks, AAA pattern, minimal mocking.

Running the full suite:

```
npx vitest run
```

## Maintenance & future enhancements

Potential improvements to persistence and related UX:

- Introduce a central `storageVersion` constant and migration utility to evolve the stored shape safely.
- Add a `removeLabel(hash)` API and pruning strategy (e.g. keep last N or TTL-based cleanup) to control unbounded growth.
- Provide a derived selector (e.g. `getLatestLabels(limit)`) for efficient listing once the Label List page is implemented.
- Encrypt or obfuscate sensitive patient data at rest if regulatory requirements arise (currently stored in plain text JSON).
- Add a bulk export/import feature (e.g., JSON file download/upload) for portability.
- Mock the network mutation in tests to silence console warnings (`Failed to parse URL from /api/label/create-print`) and assert mutation invocation explicitly.
- Add an integration test scenario verifying that two sequential identical prints do not duplicate the Map entry (hash dedupe) and that distinct payloads do.

## Next steps

- Implement header behaviors (dynamic title, back arrow logic, language switch per MVP scope).
- Extend the Create Label form: add undo/redo history in a dedicated story.
- Introduce theme management with CSS variables for “Freedom Blue” and “Freedom Darker.”
- Add E2E tests when relevant.
- Implement Label List view consuming `getLabels()` (with sorting and basic filtering).
- Add undo/redo persistence snapshot history (separate from print history) if required by future stories.
