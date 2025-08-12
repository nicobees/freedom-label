# JavaScript and TypeScript Style Guide

This guide provides specific coding conventions and best practices for writing JavaScript and TypeScript. It complements the general [Code Style and Quality Guide](05_dg-code_style.instructions.md) which covers linting tools and broader principles.

## Naming Conventions

- **Variables and Functions:** Use `camelCase`.
  ```typescript
  const userProfile = {};
  function getUserDetails() {}
  ```
- **Classes and Interfaces/Types (for object shapes):** Use `PascalCase`.
  ```typescript
  class UserAccount {}
  interface UserProfileOptions {}
  type AdminSettings = {};
  ```
- **Constants:** Use `UPPER_SNAKE_CASE` for true constants (values that never change at runtime and are widely used). For constants scoped to a module that might be configurable or less "global", `camelCase` or `PascalCase` (if an object/class) might be acceptable.
  ```typescript
  const MAX_USERS = 100;
  const DEFAULT_TIMEOUT_MS = 5000;
  ```
- **Enums:** Use `PascalCase` for enum names and `PascalCase` or `UPPER_SNAKE_CASE` for enum members, depending on team convention (be consistent).
  ```typescript
  enum UserStatus {
    Active,
    Inactive,
    PendingApproval,
  }
  // OR
  enum UserRole {
    ADMIN = "Admin",
    EDITOR = "Editor",
  }
  ```
- **File Names:**
  - Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`).
  - Other `.ts` or `.js` files (utilities, services, hooks): `camelCase.ts` (e.g., `stringUtils.ts`, `useAuth.ts`).
  - Test files: `componentName.test.tsx` or `fileName.test.ts`.
  - Storybook files: `ComponentName.stories.tsx`.
- **Private/Internal Members (Classes/Objects):** While TypeScript has `private` keyword, if you need to denote an internal-use-only property/method not meant for public API of a module (especially in plain JS or for convention), consider a leading underscore `_internalMethod`. However, prefer TypeScript's access modifiers (`private`, `protected`) where applicable.

## Comments

- Write comments to explain _why_ something is done, not _what_ is being done (the code should explain the "what").
- Use `//` for single-line comments.
- Use `/** ... */` for JSDoc-style comments for functions, classes, and complex type definitions, especially for exported members.
  ```typescript
  /**
   * Fetches user data from the API.
   * @param userId - The ID of the user to fetch.
   * @returns A Promise resolving to the user object or null if not found.
   */
  async function fetchUser(userId: string): Promise<User | null> {
    // ...
  }
  ```
- `TODO:` and `FIXME:` comments should include a reference to a Github issue or a brief explanation and your name/date if it's a quick note.
  ```typescript
  // TODO: #1234 - Refactor this to use the new caching service - [Your Name] [Date]
  // FIXME: This temporary workaround causes performance issues under high load.
  ```

## Variables and Declarations

- **Prefer `const`:** Use `const` by default for all variable declarations.
- **Use `let` only** if the variable's value needs to be reassigned.
- **Avoid `var`:** Do not use `var` due to its function-scoping and hoisting behavior.
- **Destructuring:** Use object and array destructuring for clarity and conciseness.
  ```typescript
  const { userName, email } = user;
  const [firstItem, ...restItems] = myArray;
  ```
- **Spread Syntax:** Use spread syntax for copying arrays and objects or for passing props.
  ```typescript
  const newArray = [...oldArray, newItem];
  const mergedObject = { ...objA, ...objB };
  ```

## Functions

- **Arrow Functions vs. Function Declarations:**
  - Prefer arrow functions for callbacks, inline functions, and when preserving `this` context from the lexical scope is important (though less common in React functional components).
  - Function declarations (`function myFunction() {}`) are fine for top-level module functions or when hoisting is beneficial (use with caution). Be consistent within a module/package.
- **Parameters:**
  - Use default parameters for optional values.
  - For functions with many parameters (e.g., > 3), consider using an options object for better readability and easier extension.
  ```typescript
  interface ProcessOptions {
    force?: boolean;
    retries?: number;
    timeout?: number;
  }
  function processData(
    data: DataType,
    { force = false, retries = 3 }: ProcessOptions = {}
  ) {
    // ...
  }
  ```
- **Return Types (TypeScript):** Explicitly type function return values unless it's very obvious from a short, simple function. This improves clarity and helps catch errors.
- **Async/Await:** Prefer `async/await` for asynchronous operations over raw Promises for better readability. Always handle potential errors with `try...catch`.

## TypeScript Specifics

- **Type Inference:** Use TypeScript's type inference where it's clear and doesn't reduce readability. For complex types, function signatures, or public APIs of modules/classes, explicit types are preferred.
- **`any` vs. `unknown`:** Avoid `any` as much as possible. If a type is truly unknown, use `unknown` and perform necessary type checks before operating on the value.
- **Utility Types:** Make use of TypeScript's built-in utility types like `Partial<T>`, `Readonly<T>`, `Record<K, T>`, `Pick<T, K>`, `Omit<T, K>`, `ReturnType<F>` to create more precise and maintainable types.
- **Non-null Assertion Operator (`!`):** Use with extreme caution. Only use it when you are _absolutely certain_ that a value will not be `null` or `undefined` at runtime, and TypeScript's type checker cannot infer this. Prefer explicit checks or type guards.
  ```typescript
  // Prefer this:
  if (user.name) {
    console.log(user.name.toUpperCase());
  }
  // Over this, unless absolutely certain:
  // console.log(user.name!.toUpperCase());
  ```
- **Type vs. Interface:**
  - Use `type` for defining function types, union types, intersection types, or simple object shapes.
  - Use `interface` for defining object shapes that might be extended or implemented by classes (declaration merging).
  - The project guideline is: "Usually prefer `type` rather than `interface`. Use `interface` only when you specifically need to extend it." Strive for consistency.

## Error Handling

- Use `try...catch...finally` blocks for operations that might throw errors, especially I/O or async operations.
- Throw `Error` objects or custom error classes that extend `Error`.
- Avoid catching errors silently without logging or re-throwing appropriately.

## Modules and Imports/Exports

- **ESM Syntax:** Use ES Module syntax (`import`/`export`).
- **Named Exports:** Prefer named exports for clarity and better tree-shaking.

  ```typescript
  // utils.ts
  export const helperOne = () => {
    /* ... */
  };
  export const helperTwo = () => {
    /* ... */
  };

  // main.ts
  import { helperOne, helperTwo } from "./utils";
  ```

- **Default Exports:** Use default exports sparingly, typically for the main export of a module (e.g., a React component in a file).
- **Avoid Barrel Files:** Do not use `index.ts` files solely for re-exporting multiple modules from a directory (barrel files). Import directly from the source file. This improves clarity and can aid tree-shaking.
  - Bad: `import { MyComponent } from '../components'; // where index.ts re-exports MyComponent`
  - Good: `import MyComponent from '../components/MyComponent/MyComponent';`
- **Path Aliases (tsconfig.json):** Utilize path aliases defined in `tsconfig.json` for cleaner imports from other packages within the monorepo.

Adherence to these guidelines, along with the automated linting and formatting rules, will help maintain a high-quality and consistent codebase.
