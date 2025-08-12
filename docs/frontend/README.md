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

Routes:

- `/` – Home view, minimal landing content.
- `/create` – Create Label view (form to be implemented in later stories).
- `/list` – List Label view (disabled for MVP; route exists and shows a disabled message). The header link is disabled and shows a tooltip "Not available yet".
- `*` – Not Found page.

Key files:

- `src/routes/index.tsx` – route tree, header, layout, and simple pages.
- `src/main.tsx` – mounts the router using `<RouterProvider />` and imports global CSS.

Testing the routing:

- `src/routes/index.test.tsx` asserts that each path renders the correct page using a memory router.

## Layout & UI

- A sticky header (`<header.app-header>`) is always visible and contains navigation links.
- Main content is wrapped in `<main.app-main>`; layout is responsive and mobile-first.
- Accessibility: semantic landmarks (header, nav[aria-label], main[role="main"]).

Future header features per requirements:

- Dynamic title based on current view.
- Hamburger menu (disabled for MVP with tooltip).
- Back navigation behavior when leaving non-home views.
- Language switcher (i18n) without page reload.

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
