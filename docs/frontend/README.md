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
- Testing
- Next steps

## Overview

The application is a React + TypeScript SPA built with Vite. Navigation uses TanStack Router. The app follows a mobile-first, pure CSS approach to ensure compatibility with the production environment.

Key libraries:

- React 19
- TanStack Router v1
- TanStack Form (to be used in form user stories)
- Zod (validation; to be integrated with the form)
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
- `/create` – Create Label view (form to be implemented in later stories).
- `/list` – List Label view (disabled for MVP; route exists and shows a disabled message). The header link is disabled and shows a tooltip "Not available yet".
- `*` – Not Found page.

Key files:

- `src/routes/index.tsx` – route tree, header, layout, and simple pages.
- `src/main.tsx` – mounts the router using `<RouterProvider />` and imports global CSS.

Testing the routing:

- `src/routes/index.test.tsx` asserts that each path renders the correct page using a memory router.
- `src/routes/HomePage/HomePage.test.tsx` verifies the homepage actions render and navigation to Create works.

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

## Testing

- Test runner: Vitest (jsdom environment).
- Utilities: Testing Library, jest-dom.
- Config files:
  - `vitest.config.ts` – test environment and setup.
  - `vitest.setup.ts` – imports jest-dom matchers.
- Example tests:
  - `src/routes/index.test.tsx` checks that each route renders the expected page/component.
  - `src/components/Header/Header.test.tsx` checks dynamic title, disabled menu on Home, and back navigation from Create to Home.

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

## Next steps

- Implement header behaviors (dynamic title, back arrow logic, language switch per MVP scope).
- Implement the Create Label form with TanStack Form and Zod, including debounced inputs and undo/redo history.
- Introduce theme management with CSS variables for “Freedom Blue” and “Freedom Darker.”
- Add E2E tests when relevant.
