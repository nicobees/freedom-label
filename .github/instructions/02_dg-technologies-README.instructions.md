# Technology Stack Overview

This document provides an overview of the key technologies, libraries, and tools used in Web app development. For more granular details or specific versions, refer to `package.json` files within individual packages or more specialized documentation.

## Core Frontend Technologies

- **React (v18+):** The primary JavaScript library for building user interfaces.
- **TypeScript (v5+):** A typed superset of JavaScript, used throughout the monorepo for enhanced code quality and developer experience.
- **Next.js:** A React framework used for features like server-side rendering (SSR), static site generation (SSG), routing, and API routes.
- **Node.js (v20+):** The JavaScript runtime environment for backend services (like the `Display` package) and build tooling.

## State Management

- **Immer:** Simplifies working with immutable state within Redux reducers.
- **Zustand:** A lightweight, simpler state management solution used in some newer modules or for less complex global state.
- **React Context API:** Used for sharing state across component trees where Zustand might be overkill (e.g., theming, user authentication status).
- **Node.js AsyncLocalStorage:** Used similar to React Context API but in the node application to share state and data across modules.

## Data Fetching & API Interaction

- **SWR:** React Hooks library for data fetching, providing features like caching, revalidation, and optimistic UI.
- **Tanstack Query:** React Hooks library for data fetching, providing features like state management, caching, revalidation, and optimistic UI.
- **Isomorphic Unfetch:** A fetch polyfill ensuring consistent fetch behavior on client and server.

## Testing

- **Jest:** The primary JavaScript testing framework for unit and integration tests.
- **React Testing Library (RTL):** For testing React components in a user-centric way.
- **`@testing-library/user-event`:** Simulates user interactions more realistically than `fireEvent`.
- **Playwright:** For end-to-end (E2E) browser automation testing.
- **Mock Service Worker (MSW):** For mocking API requests at the network level during tests.

## Monorepo Management & Development Tools

- **ESLint:** For static code analysis and enforcing coding standards in JavaScript/TypeScript.
- **Prettier:** An opinionated code formatter for consistent code style.
- **Husky & Lint Staged:** For running linters and formatters on staged Git files before commits.
- **Changesets:** For version management and changelog generation for packages.

## Build Tools

- **Webpack:** A static module bundler for JavaScript applications, used extensively for creating production bundles for frontend applications.
- **Babel:** A JavaScript compiler, used to transpile modern JavaScript (ES6+) and TypeScript into browser-compatible versions.

## Infrastructure & Deployment

- **Docker:** For containerizing applications, ensuring consistent environments across development and production.
- **GitHub CI/CD:** For continuous integration and continuous deployment pipelines.

## Monitoring & Logging


## Internationalization (i18n)

- Please add proper i18n solution for React/typescript application
