Prompt title
“Style existing app with pure CSS + simple Material-like theming (light/black)”

System/role

- Act as Frontend Agent with instructions here [****]
- Objective: add clean, maintainable, pure‑CSS styling to an already working web app, with a simple Material‑inspired look (shapes, spacing, color roles, subtle elevation), and a two-theme system (light, black). No UI libraries.

Context

- Existing, functioning codebase; components are in src/components, views in src/routers.
- There is a basic stylesheet at src/styles/global.css (keep, extend, or refactor minimally).
- Keep the design simple and practical; avoid over-engineering.
- Use only plain CSS. You may use modern CSS features (custom properties, @layer, :focus-visible, prefers-\* media queries, container queries if needed). No preprocessors or frameworks.
- Aim for accessibility (WCAG AA contrast), visible focus states, sensible spacing, and reduced-motion respect.

Theming (variables to define)

- Implement CSS custom properties in a central tokens file and theme scopes.
- Provide two themes: light and black (true black suitable for OLED).
- THEMES (replace these values with my palette before coding):

Theme "Freedom Blue":

- primary color: #005392
- secondary color: #0180d1
- accent color: #148b8d
- background: white or light grey

Theme "Freedom Darker" (this will be considered the "dark" theme option)

- primary color: #005392
- secondary color: #000a92
- accent color: #009288
- background: black or dark grey

  - "Freedom Blue" --> Light theme:

    - primary color: #005392
    - secondary color: #0180d1
    - accent color: #148b8d
    - background: white or light grey

    - --color-on-primary: #FFFFFF
    - --color-surface: #FFFFFF
    - --color-on-surface: #1C1B1F
    - --color-surface-variant: #F2EEF6
    - --color-outline: #8E8A92
    - --color-background: #FAFAFB
    - --color-on-background: #1C1B1F
    - --radius-s: 6px; --radius-m: 10px; --radius-l: 14px
    - --elevation-1: 0 1px 2px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.06)

  - "Freedom Darker" --> Dark theme:

    - primary color: #005392
    - secondary color: #000a92
    - accent color: #009288
    - background: black or dark grey

    - --color-on-primary: #000000
    - --color-surface: #000000
    - --color-on-surface: #E6E1E5
    - --color-surface-variant: #2A2830
    - --color-outline: #928F99
    - --color-background: #000000
    - --color-on-background: #E6E1E5
    - --radius-s: 6px; --radius-m: 10px; --radius-l: 14px
    - --elevation-1: 0 1px 2px rgba(255,255,255,.14), 0 1px 3px rgba(255,255,255,.08)

Requirements and constraints

- Keep code simple and easy to maintain. Prefer straightforward class names and small, focused files.
- Do not change component logic; only add classes/attributes and CSS.
- Provide unobtrusive, Material‑like styling cues:
  - Rounded corners (radius-m for most surfaces).
  - Subtle elevation/shadow for cards/toolbars.
  - Clear focus states (outline with good contrast).
  - Simple button variants (filled, outline, text).
  - Simple text inputs (outlined), labels, helper/error text.
- Respect reduced motion and color scheme preferences (optional auto-default).
- Minimize global overrides; keep styles predictable and scoped.
- Keep global.css, but move tokens, base, and components into new files for clarity.

Plan (step-by-step)

1. Add a small style structure:
   - src/styles/tokens.css (CSS variables + themes)
   - src/styles/base.css (reset/normalize-lite + typography scale + links + focus styles)
   - src/styles/layout.css (containers, spacing utilities, simple grid/stack helpers)
   - generic components:
     - src/styles/components/Button.css
     - src/styles/components/Input.css (text field, text area)
     - src/styles/components/Card.css
     - src/styles/components/Toolbar.css (app header/top bar)
   - specific components, already existing but without styles:
     - src/components/CreateLabelForm/fields/CheckboxField.css
     - src/components/CreateLabelForm/fields/DateField.css
     - src/components/CreateLabelForm/fields/FloatNumberField.css
     - src/components/CreateLabelForm/fields/TextField.css
   - Leave src/styles/global.css in place; import the new files there or at app root.
2. Implement theme switching using data-theme attribute on <html> or <body>. Provide a tiny JS snippet to toggle 'light'/'black' via data-theme.
3. Scan src/components and src/routers to infer common elements (buttons, inputs, headers, cards, nav). Propose minimal class contracts without renaming components.
4. Generate the CSS files:
   - Use tokens (colors, radius, elevation, spacing).
   - Keep selectors simple: .btn, .btn--filled, .btn--outline, .btn--text; .field, .field**label, .field**input, .field\_\_assist; .card; .toolbar.
   - Add hover/active/focus-visible and disabled states.
5. Provide minimal code diffs showing how to add classes to typical components (Button, Input, Page header, Card).
6. Add a quick checklist to verify: contrast, keyboard focus, theme toggle, reduced motion.

Output format (return all of the following)

- File tree of new/modified files.
- Full contents for:
  - src/styles/tokens.css
  - src/styles/base.css
  - src/styles/layout.css
  - src/styles/components/Button.css
  - src/styles/components/Input.css
  - src/styles/components/Card.css
  - src/styles/components/Toolbar.css
- A small JS snippet for theme toggle (data-theme on documentElement).
- 3–4 example unified diffs (or code snippets) showing how to add classes to existing components in src/components and views in src/routers.
- A short verification checklist.

Styling specifics (keep it simple)

- Typography: base 16px, body line-height ~1.5, heading scale with sensible steps (e.g., h1 2rem, h2 1.5rem, h3 1.25rem). Use system font stack.
- Spacing: establish a small scale (4, 8, 12, 16, 24).
- Buttons:
  - .btn: inline-flex, center alignment, height ~40–44px, min-tap target 44px, padding 0 16px, border-radius var(--radius-m).
  - Variants:
    - .btn--filled: background var(--color-primary), color var(--color-on-primary).
    - .btn--outline: border 1px var(--color-outline), color var(--color-on-surface); transparent bg.
    - .btn--text: no border, transparent bg, color var(--color-primary).
  - :hover/:active use subtle opacity layer; :disabled reduces opacity and blocks pointer events.
  - :focus-visible: 2px outline with good contrast (e.g., outline-color: var(--color-primary)).
- Inputs (outlined):
  - .field: display:block; margin-bottom: 12px;
  - .field**label: small, subtle color; .field**assist: small helper/error text.
  - .field\_\_input: border 1px var(--color-outline), border-radius var(--radius-m), padding 10–12px; focus-visible border-color var(--color-primary); invalid state .is-error adjusts border and assist color.
- Card:
  - .card: background var(--color-surface), color var(--color-on-surface), border-radius var(--radius-m), box-shadow var(--elevation-1), padding 16–20px.
- Toolbar:
  - .toolbar: height ~56px, horizontal padding 16px, background var(--color-surface), color var(--color-on-surface), subtle bottom border or shadow; inner .toolbar\_\_title strong and readable.

Accessibility and motion

- Ensure contrast meets AA in both themes.
- :focus-visible clearly visible on interactive elements.
- @media (prefers-reduced-motion: reduce) disables transitions/animations.

Repo modifications

- Do not rewrite components. Only add className and minimal wrappers if needed for structure (e.g., a .field wrapper around input + label + assist).
- Import the new CSS in a single place (e.g., in global.css or main entry) to avoid duplication.

Now perform

- Inspect the project (src/components, src/routers, src/styles/global.css).
- Generate the style files and class contracts as specified.
- Provide minimal diffs to apply classes in representative components and views.
- Use the THEMES above (will be replaced with my palette), and ensure both themes render correctly.
- propose a v1 with minimal classes, then refine
