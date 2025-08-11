# Code Style and Quality

Maintaining a consistent code style and high code quality is crucial for readability, maintainability, and collaboration. This document outlines our approach, tools, and key guidelines.

## General Approach: Enforced Code Style

We primarily rely on automated tools to enforce code style. This offers several advantages:

- **Consistency:** Ensures all developers adhere to the same formatting and style rules.
- **Efficiency:** Developers don't need to memorize every rule; tools highlight and often auto-fix issues.
- **Reduced Review Friction:** Code reviews can focus on logic and architecture rather than stylistic debates.

However, not all best practices can be automated. This document also covers guidelines that require manual attention.

## Core Styling and Linting Tools

- **Prettier:** An opinionated code formatter that automatically formats code to ensure a consistent style.
  - Configuration: `.prettierrc.js` at the monorepo root.
- **ESLint:** A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript and TypeScript. It helps catch potential bugs and enforce coding standards.
  - Configuration: `.eslintrc.js` at the monorepo root, with potential overrides in package-specific ESLint configs. Shared configurations might be in `packages/configs/eslint/`.
- **Stylelint:** A linter for CSS, SCSS, and CSS-in-JS (like `styled-components`). It helps prevent errors and enforce conventions in stylesheets.
  - Configuration: `.stylelintrc` at the monorepo root.

Run these tools locally before committing:

```sh
# Run ESLint for all files (or specific files/directories)
npm run eslint

# Run Stylelint (if configured as a separate script)
# npm run stylelint

# Many issues can be auto-fixed:
npm run eslint -- --fix
# npm run stylelint -- --fix

# Prettier is often run via a pre-commit hook (e.g., with lint-staged)
# or can be run manually:
npm run prettier -- --write .
```

Refer to `package.json` for the exact linting and formatting commands.

## General Coding Guidelines

Beyond automated linting and formatting:

1.  **Readability:** Write code that is easy for other developers to understand.
    - Use descriptive variable and function names.
    - Keep functions small and focused on a single responsibility.
    - Add comments only when necessary to explain complex logic or non-obvious decisions. Prefer self-documenting code.
2.  **Simplicity (KISS - Keep It Simple, Stupid):** Prefer simpler solutions over complex ones if they meet requirements.
3.  **DRY (Don't Repeat Yourself):** Avoid duplicating code. Utilize functions, components, and utilities from shared folders where appropriate.
4.  **TypeScript Best Practices:**
    - Leverage TypeScript's type system to catch errors at compile time.
    - Prefer type inference when the type is obvious and explicit types don't improve clarity. Use explicit types for function signatures, complex objects, and when inference might be ambiguous.
    - Use `unknown` instead of `any` where possible for better type safety.
    - Utilize utility types (e.g., `Partial`, `Readonly`, `ReturnType`) effectively.
    - Generally prefer `type` aliases for defining object shapes and function signatures, and `interface` when you need declaration merging or plan for extensibility via `extends`. (The original rule "Usually prefer type rather then interface. Use interface only when you specifically need to extend it." is noted).
5.  **Imports:**
    - Prefer direct imports to specific modules/files rather than importing through barrel files (`index.ts` re-exporting multiple modules). This can improve tree-shaking and reduce bundle sizes.
    - Organize imports: typically standard library/React imports first, then third-party, then local relative imports. ESLint rules often manage this.
    - Prefer `import type ...` when only types are imported: also if runtime variables are imported, the use `import {type TestType, RuntimeModule} from 'test-module'`
6.  **Object Properties:** Consider ordering object properties alphabetically for consistency, especially in large object literals or type definitions, if not managed by Prettier.
7.  **File and Folder Structure:** Follow existing conventions within each package. For new components, generally co-locate related files (component, styles, tests, stories).

## Disabling Linting Rules

Sometimes, a specific linting rule might not be appropriate for a particular piece of code. In such cases, you can disable the rule for a line or a block.

- **Always provide a clear, concise comment explaining _why_ the rule is being disabled.** This is crucial for future maintainability and code reviews.
- Place the explanatory comment directly before the linter disabling comment.

**Example (ESLint):**

```typescript
// This function needs to interact with a legacy global object that uses 'var'.
// eslint-disable-next-line no-var
var legacyGlobal = window.someOldApi;

// This specific regex is intentionally complex for performance reasons.
// eslint-disable-next-line prefer-regex-literals
const complexRegex = new RegExp("pattern", "g");
```

If disabling multiple rules, you can list them or provide separate explanations if needed:

```typescript
// Reason for rule1: ...
// Reason for rule2: ...
// eslint-disable-next-line rule1, rule2
// problematic code
```

## Typescript types

- Usually prefer type rather then interface. Use interface only when you specifically need to extend it.

## Type Checking

Ensure your code passes TypeScript type checks:

```sh
# Run type checking for all packages
npm run type-check
```

Address any TypeScript errors before committing.

## Testing

While not strictly "code style," writing good tests is a core part of code quality.

- Follow the guidelines in [Practical Guide to Writing Tests](./writing-tests-guide.md).
- Ensure new code is adequately covered by tests.
