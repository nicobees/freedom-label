# Practical Guide to Writing Tests

This guide provides practical advice, best practices, and tips for writing effective unit and integration tests, primarily using Jest and React Testing Library (RTL).

## Core Philosophy for Component Tests

Our testing approach for UI components emphasizes:

- **User-centric testing:** Tests should verify component behavior from a user's perspective.
- **Behavior over implementation:** Focus on _what_ a component does, not _how_ it internally achieves it. This makes tests more resilient to refactoring.
- **Accessibility:** Prioritize querying elements in a way that mirrors how users (especially those using assistive technologies) interact with them.

## Tools Recap

- **Jest:** Test runner, assertion library, mocking framework.
- **React Testing Library (RTL):** Utilities for testing React components in a user-focused way.
- **`@testing-library/user-event`:** Companion to RTL for simulating user interactions more realistically than `fireEvent`.
- **`@testing-library/jest-dom`:** Custom Jest matchers for asserting DOM states (e.g., `toBeInTheDocument()`, `toHaveAttribute()`).

## Best Practices for Writing Tests

### 1. Follow the AAA Pattern

Structure your tests clearly:

- **Arrange:** Set up the test conditions. Render the component with necessary props, context providers, and mock any dependencies.
- **Act:** Perform the action or interaction you want to test (e.g., click a button, type in an input).
- **Assert:** Verify that the outcome is as expected.

```typescript
test('should display welcome message after login', async () => {
  // Arrange
  const mockLogin = jest.fn();
  render(<LoginComponent onLogin={mockLogin} />);
  await userEvent.type(screen.getByLabelText('Username'), 'testuser');
  await userEvent.type(screen.getByLabelText('Password'), 'password');

  // Act
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));
  mockLogin(); // Simulate successful login callback if needed for UI update

  // Assert
  // expect(await screen.findByText(/welcome, testuser/i)).toBeInTheDocument(); // If UI updates based on onLogin
  expect(mockLogin).toHaveBeenCalledTimes(1);
});
```

_Separate each phase with a blank line for readability._

### 2. Adhere to RTL Guiding Principles

- [RTL Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Common Mistakes with RTL by Kent C. Dodds](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 3. Querying Elements

Prioritize queries that reflect how users find elements:

1.  **Queries Accessible to Everyone:**
    - `getByRole`: For elements with ARIA roles (buttons, links, navigation, etc.). This is the most preferred.
    - `getByLabelText`: For form fields associated with a label.
    - `getByPlaceholderText`: For form fields with placeholder text.
    - `getByText`: For non-interactive elements found by their text content.
    - `getByDisplayValue`: For form fields with a current value.
2.  **Semantic Queries:**
    - `getByAltText`: For images.
    - `getByTitle`: For elements with a `title` attribute.
3.  **Test IDs (Use Sparingly):**
    - `getByTestId`: Use `data-testid` attributes as a last resort if no other accessible or semantic query works. Avoid overusing them, as they don't reflect user interaction.

**Utilities for Querying:**

- `screen.debug()`: Prints the current DOM structure to the console.
- `getRoles(container)` and `logRoles(container)` (from `@testing-library/dom`): List all ARIA roles available in the rendered output, which helps in choosing `getByRole` queries.
    ```typescript
    import { getRoles } from '@testing-library/dom';
    // Inside a test:
    const { container } = render(<MyComponent />);
    console.log(getRoles(container));
    ```

### 4. Simulating User Interactions

- **Prefer `@testing-library/user-event` over `fireEvent`**. `user-event` simulates full user interactions (e.g., `type` includes focus, keydown, keypress, keyup events), while `fireEvent` only dispatches a single event.

```typescript
import userEvent from '@testing-library/user-event';

// Good: Simulates a user typing
await userEvent.type(screen.getByRole('textbox'), 'Hello world!');

// Less ideal for typing, but okay for simple events:
// fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello world!' } });
```

### 5. Using Matchers

- Utilize the custom matchers from `@testing-library/jest-dom` for more expressive and readable assertions related to DOM attributes and states.
    ```typescript
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Error!')).toBeVisible();
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    ```

### 6. Test Structure and Naming

- **File per Component:** Typically, one test file per component (e.g., `MyComponent.test.tsx`).
- **Isolate Complex Scenarios:** For components with significantly different behaviors (e.g., based on major prop variations), consider splitting tests into multiple files (e.g., `MyForm.basic.test.tsx`, `MyForm.advanced.test.tsx`).
- **Avoid Excessive Nesting:** Prefer flat `test(...)` blocks over deeply nested `describe > describe > test`. Use `describe` for logical grouping if a component has many distinct areas of functionality.
- **Clear Test Descriptions:** Start test descriptions with "should" and clearly state the expected behavior (e.g., `test('should disable submit button when form is invalid')`).

### 7. Setup Functions

For repetitive setup logic within a test file, create a global `setup` function within that file:

```typescript
const setup = (propsOverride = {}) => {
  const defaultProps = { /* ... your default props ... */ };
  const props = { ...defaultProps, ...propsOverride };
  return render(<MyComponent {...props} />);
};

test('should render with default title', () => {
  setup(); // Uses default props
  expect(screen.getByRole('heading')).toHaveTextContent('Default Title');
});

test('should render with provided title', () => {
  setup({ title: 'Custom Title' });
  expect(screen.getByRole('heading')).toHaveTextContent('Custom Title');
});
```

## Tips & Tricks

### Debugging Tests

- `screen.debug(element?, maxLength?, options?)`: Prints the DOM. `screen.debug(undefined, Infinity)` prints the entire DOM.
    - Set `DEBUG_PRINT_LIMIT=Infinity` as an environment variable before running tests for unlimited debug output.
- `screen.logTestingPlaygroundURL()`: Prints a URL to [testing-playground.com](https://testing-playground.com/) with the current DOM, helping you find the best queries.
- Temporarily use `screen.getByRole('nonExistentRole')`. The error message will list all available roles and their corresponding DOM nodes, which is very helpful for debugging `getByRole` queries.

### Testing Playground Tool

[Testing Playground](https://testing-playground.com/) is an invaluable online tool:

1.  Paste your rendered HTML (from `screen.debug()`).
2.  Use its inspector to click on elements.
3.  It suggests the best RTL queries to select those elements.

### Snapshot Testing

Snapshots can be useful but should be used judiciously.

- **Avoid Large Snapshots:** They become hard to review and maintain.
- **Purpose:** Best for ensuring complex UI structures don't change unexpectedly (e.g., generated SVG icons, complex static layouts).
- **Consider `snapshot-diff`:** For testing how a component changes between states rather than snapshotting entire structures.
- **Review Snapshots Carefully:** Treat snapshot changes as code changes during review. Understand _why_ a snapshot changed.

Reference: [Effective Snapshot Testing by Kent C. Dodds](https://kentcdodds.com/blog/effective-snapshot-testing)

### Custom Test Snippets (VS Code)

The `.vscode/custom-test-react.code-snippets` file in the monorepo allows defining custom snippets for common test patterns, speeding up test writing.

- To use: Type the snippet prefix (e.g., `test_setup_formik`) in a `.tsx` or `.jsx` file and press Enter, or use the "Snippets: Insert Snippet" command from the VS Code command palette.

## IDE Integration (Visual Studio Code)

Recommended VS Code extensions for an improved testing workflow:

- **Jest Runner (`firsttris.vscode-jest-runner`):**
    - Adds "Run" and "Debug" CodeLens links directly above `test` and `describe` blocks in your test files.
    - Provides command palette shortcuts for running tests (e.g., "Jest: Run File").
- **ES7+ React/Redux/React-Native snippets (`dsznajder.es7-react-js-snippets`):** Includes many useful snippets for React and testing, and can be extended with custom snippets.
- **ESLint (`dbaeumer.vscode-eslint`):** Integrates ESLint into the editor, highlighting issues related to testing best practices if ESLint testing plugins (like `eslint-plugin-testing-library`) are configured.

By following these guidelines and utilizing the available tools, you can write effective, maintainable, and user-focused tests for components.
