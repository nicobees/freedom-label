# State Management

This document provides an overview of the state management strategies. A combination of approaches is used to handle diverse state requirements effectively.

## Core State Management Approaches

The platform primarily utilizes the following for managing state:

1.  **Zustand:** A lightweight alternative to Redux for simpler global or feature-specific state, increasingly adopted for new modules.
2.  **React Context API:** For sharing state across component trees without prop drilling, suitable for theming, user authentication status, or localized feature state.
3.  **Local Component State (`useState`, `useReducer`):** For UI-specific state that doesn't need to be shared beyond a single component or its immediate children.

## 1. Zustand

Zustand is a small, fast, and scalable state management solution that is often simpler to implement than Redux.

### Advantages & Usage

- **Minimal Boilerplate:** Less setup required compared to Redux.
- **Hook-Based API:** Integrates naturally with React functional components.
- **Good TypeScript Support.**

```typescript
import { create } from "zustand";

interface ThirdPartyScriptsState {
  consentsStatus: Record<string, boolean>;
  setConsentsStatus: (consents: Record<string, boolean>) => void;
  setCasperSession: (session?: string) => void;
}

const useThirdPartyScriptsStore = create<ThirdPartyScriptsState>((set) => ({
  consentsStatus: {},
  setConsentsStatus: (consentsStatus) => set({ consentsStatus }),
  setCasperSession: (casperSession) => set({ casperSession }),
}));

// Selector hooks for components to consume parts of the store
export const useConsentsStatus = () =>
  useThirdPartyScriptsStore((state) => state.consentsStatus);
```

### When to Consider Zustand

- For new features requiring global or shared state where Redux's complexity isn't necessary.
- When a simpler, hook-based API is preferred.
- For managing feature-specific state that needs to be accessed by multiple, potentially distant, components.

## 2. React Context API

The React Context API is used for passing data through the component tree without having to pass props down manually at every level.

### Common Patterns

- **Context Creation & Provider:**

  ```typescript
  // MyContext.ts
  import React, { createContext, useContext, useState, useMemo } from "react";

  interface MyContextType {
    theme: string;
    setTheme: (theme: string) => void;
  }

  const MyContext = createContext<MyContextType | undefined>(undefined);

  export const MyProvider: FunctionComponent<{ children: ReactNode }> = ({
    children,
  }) => {
    const [theme, setTheme] = useState("light");
    const value = useMemo(() => ({ theme, setTheme }), [theme]);
    return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
  };

  export const useMyContext = () => {
    const context = useContext(MyContext);
    if (context === undefined) {
      throw new Error("useMyContext must be used within a MyProvider");
    }
    return context;
  };
  ```

- **Consumer Hook:** A custom hook (`useMyContext` in the example) is the standard way to consume the context.

### When to Use React Context

- For state that doesn't change very frequently (to avoid performance issues due to re-renders).
- For theming, user authentication, localization.
- When you need to share state within a specific subtree of your application rather than globally.

## 3. Local Component State (`useState`, `useReducer`)

Standard React local state is used for UI-specific concerns that don't need to be shared.

### When to Use Local State

- Managing form input values and validation states.
- Toggle states (e.g., visibility of a dropdown, open/closed state of an accordion).
- UI interaction states within a component (e.g., loading indicators, error messages specific to that component's actions).
- Data that is only relevant to a single component and its direct children (can be passed down as props).

**Example:**

```typescript
function MyInteractiveComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Input</button>
      {isOpen && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      )}
    </div>
  );
}
```

## Choosing the Right Approach: General Guidelines

1.  **Start Local:** Always try to manage state locally within a component first.
2.  **Lift State Up:** If multiple components need access to the same state, lift it to their closest common ancestor.
3.  **Context for Subtrees:** If prop drilling becomes excessive, consider React Context for sharing state within a well-defined part of the component tree.
4.  **Zustand for Simpler Global/Feature State:** For state that needs to be accessed across different parts of the application but doesn't warrant the complexity of Redux, Zustand is a good choice.

## Anti-Patterns to Avoid

- **Prop Drilling:** Excessively passing props through many layers of intermediate components.
- **Overuse of Global State:** Putting everything into Zustand, even if it's only used locally or in a small section.
- **Massive Context Providers:** Creating single, large context providers for unrelated pieces of state. Prefer smaller, more focused contexts.
- **Frequent Updates in Context:** Be cautious with state in Context that updates very frequently, as it can cause performance issues due to widespread re-renders. Optimize with `useMemo` or consider other solutions.

By understanding these different state management tools and principles, developers can make informed decisions to manage application state effectively and maintainably.
