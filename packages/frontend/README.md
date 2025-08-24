# Frontend Application

This is the frontend application for the Freedom Label monorepo, built with React and Vite. It implements a lightweight design system using pure CSS with themeable design tokens (light and dark themes) and layered architecture.

## Local Development Setup

To run the frontend application locally, follow these steps:

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).
    It will automatically proxy API requests to the backend running on port 8000.

## Docker Environments

The frontend application can be run in two Docker environments: `test` and `prod`.

### Test Environment

To run the frontend in the test environment, navigate to the `devops` directory and run:

```bash
docker-compose -f docker-compose.yml up -d frontend
```

#### Commands to handle docker images

docker build . -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_FRONTEND:f-0.0.1

docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPOSITORY_NAME/$GITHUB_IMAGE_FRONTEND:f-0.0.1

## Styling & Theming System

### Goals

- Pure CSS (no CSS-in-JS) for fast first paint and smaller runtime.
- Deterministic cascade using `@layer` (tokens, base, layout, components, overrides).
- Theme support via `data-theme` attribute on `<html>` using custom properties.
- Accessible, minimal class contracts for primitives: buttons, inputs, cards, toolbar, layout utilities.

### File Structure

```
src/styles/
    tokens.css        # Design tokens + theme custom properties
    base.css          # Reset, base elements, typography, focus styles
    layout.css        # Generic layout utilities (.row, .stack, spacing helpers)
    components/
        Button.css
        Input.css
        Card.css
        Toolbar.css
    global.css        # Imports all layers (order matters)
```

### Layers

We rely on native CSS cascade layers (import order inside `global.css`):

1. `tokens` – root and theme-specific custom properties.
2. `base` – resets, element defaults, typography.
3. `layout` – structural utilities.
4. `components` – component class rules (Buttons, Inputs, Cards, Toolbar, etc.).
5. `overrides` – (reserved) any future context-specific tweaks.

This ensures component rules never accidentally override tokens or base definitions unless explicitly intended.

### Themes

`data-theme="light" | "dark"` on `<html>` switches between variable sets defined in `tokens.css`:

Example snippet (simplified):

```css
:root[data-theme='light'] {
  --color-bg: #ffffff;
  --color-fg: #141414;
}
:root[data-theme='dark'] {
  --color-bg: #0f0f11;
  --color-fg: #e9e9ea;
}
```

All component styles consume only custom properties (no hard-coded theme colors) so new themes can be added by extending `tokens.css`.

### Runtime Theme API

`src/utils/theme.ts` exposes:

- `initTheme()` – Called once before React render (see `main.tsx`). Chooses stored theme or system preference.
- `toggleTheme()` – Flips current theme and persists to `localStorage`.
- `applyTheme(theme)` – Low-level setter used by the above.

The header adds a simple toggle button (🌓) invoking `toggleTheme()`.

### Core Class Contracts

Buttons:

- Base: `.btn`
- Variants: `.btn--filled`, `.btn--outline`, `.btn--text`
- Disabled state: `[disabled]` or `.is-disabled`

Fields (input, checkbox, etc.):

- Wrapper: `.field` (error modifier: `.is-error`)
- Label: `.field__label`
- Input: `.field__input` (checkbox: `.field__input--checkbox`)
- Assist/Error text container: `.field__assist`

Cards (form sections):

- Container: `.card`
- Title: `.card__title`
- Section / body grouping: `.card__section`

Toolbar/Header:

- Root: `.toolbar`
- Action groups: `.toolbar__actions`
- Title: `.toolbar__title`

Layout utilities:

- `.stack` / `.row` for flex stacks.
- Spacing via CSS custom property `--gap` on these containers when needed.

### Accessibility Notes

- Inputs set `aria-invalid` when validation fails.
- Error messaging placed in `.field__assist` with `role="status"` and `aria-live="polite"`.
- Groupings (previously `<fieldset>`) now use `role="group"` + `aria-label` within `.card` containers for simpler styling; retain explicit heading semantics with `role="heading"` + `aria-level` on `.card__title`.

### Extending the System

1. Add new token variables to `tokens.css` inside both theme blocks.
2. Reference them exclusively via `var(--token-name)` in component CSS.
3. For a new component type, create `src/styles/components/ComponentName.css` and import it in `global.css` under the `@layer components` section.
4. Keep selectors flat (`.component`, `.component__part`, `.component--modifier`)—avoid deep nesting to reduce specificity wars.

### Example: Creating a Tertiary Button Variant

Tokens may already support color roles. Add style:

```css
@layer components {
  .btn.btn--tertiary {
    background: var(--color-surface-alt);
    color: var(--color-fg);
  }
  .btn.btn--tertiary:hover {
    background: var(--color-surface-alt-hover);
  }
}
```

Then use `<button className="btn btn--tertiary">More</button>`.

### Testing Considerations

Component tests should not assert on specific color values. Prefer role / accessible name queries and presence of state classes (e.g., `.is-error`).

### Future Improvements (Backlog)

- Motion tokens & reduced-motion progressive enhancement.
- High-contrast accessibility theme.
- Component-level dark adaptive elevation overlays.
- CSS container queries for responsive adjustments without media queries.

## Create Label Form Notes

Updated form sections now use `.card` wrappers (see `PatientInfoSection.tsx`, `ManufacturingSection.tsx`, `LensSpecSection.tsx`). Field components (`TextField`, `CheckboxField`) implement the shared field contract.

---

Legacy references (AnagraphicSection, DateDropdown) were replaced/refactored; tests should be updated to the new structure where applicable.
