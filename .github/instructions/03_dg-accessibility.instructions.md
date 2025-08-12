# Accessibility (a11y) Guidelines

## Introduction

Ensuring the produced contentis accessible to all users, including those with disabilities, is a core development principle. This document outlines accessibility (a11y) considerations, best practices, and common patterns to follow. Adherence to these guidelines is not only a legal requirement in many regions but also aligns with our commitment to inclusive design, ultimately benefiting all users.

## Key Accessibility Pillars

### 1. Semantic HTML

Using correct HTML elements for their intended purpose provides a strong foundation for accessibility.

- **Use the right element for the job:** `<button>` for actions, `<a>` for navigation, `<ul>`/`<ol>` for lists, `<table>` for tabular data.
- **Heading Hierarchy:** Use `<h1>` through `<h6>` tags in a logical, hierarchical order. Do not skip levels.
- **Landmark Elements:** Employ HTML5 landmark elements like `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, and `<article>` to define page structure.
- **Form Labels:** Always associate `<label>` elements with their respective form controls (`<input>`, `<select>`, `<textarea>`) using the `for` attribute or by wrapping the control.

**Example:**

```html
<!-- Good: Semantic and accessible -->
<button onClick="{handleClick}">Submit Action</button>

<nav aria-label="Main navigation">
	<ul>
		<li><a href="/home">Home</a></li>
		<li><a href="/products">Products</a></li>
	</ul>
</nav>
```

### 2. ARIA (Accessible Rich Internet Applications)

ARIA attributes supplement HTML to make custom widgets and dynamic content more accessible to assistive technologies.

- **Core Principles:**
    1.  Prioritize native HTML elements with built-in accessibility before resorting to ARIA.
    2.  Do not change native semantics unless absolutely necessary (e.g., don't put `role="button"` on an `<h1>`).
    3.  All interactive ARIA widgets must be keyboard accessible.
    4.  Avoid `role="presentation"` or `aria-hidden="true"` on focusable or critical elements.
    5.  All interactive elements must have an accessible name (via content, `aria-label`, or `aria-labelledby`).
- **Common ARIA Attributes:**
    - Structural Roles: `role="dialog"`, `role="listbox"`, `role="option"`, `role="menu"`, `role="menuitem"`.
    - States & Properties: `aria-expanded`, `aria-pressed`, `aria-disabled`, `aria-invalid`, `aria-labelledby`, `aria-describedby`, `aria-current`.
    - Live Regions: `aria-live="polite"` (for non-urgent updates), `aria-live="assertive"` (for urgent updates).

**Example (Custom Dropdown):**

```tsx
<button
  aria-expanded={isOpen}
  aria-haspopup="true"
  aria-controls="dropdown-menu"
  onClick={toggleDropdown}
>
  Options
</button>
<ul id="dropdown-menu" role="menu" hidden={!isOpen}>
  <li role="menuitem">Option 1</li>
  <li role="menuitem">Option 2</li>
</ul>
```

### 3. Keyboard Navigation

All interactive functionality must be operable via a keyboard.

- **Focusability:** All interactive elements (links, buttons, form fields, custom widgets) must be focusable using the Tab key.
- **Logical Tab Order:** Ensure the tab order follows the visual and logical flow of the page. Avoid `tabindex` values greater than 0. Use `tabindex="0"` to make non-interactive elements focusable if necessary, and `tabindex="-1"` to allow programmatic focus while excluding from tab order.
- **Custom Widget Interactions:** Complex custom widgets (sliders, tree views, etc.) must implement standard keyboard interaction patterns (e.g., arrow keys for navigation, Enter/Space for activation). Refer to WAI-ARIA Authoring Practices.
- **Focus Trapping:** Modals and dialogs must trap keyboard focus within them until closed.
- **Skip Links:** Provide "skip to main content" links for users to bypass repetitive navigation blocks.

### 4. Focus Management

Clear and predictable focus management is crucial.

- **Visible Focus Indicators:** Ensure keyboard focus is always visually apparent (e.g., outlines). Do not remove default focus styles without providing a clear alternative.
- **Contextual Focus:** When new content appears (e.g., modal opens, section expands), manage focus appropriately (e.g., move focus to the new content).
- **Return Focus:** When a modal or dropdown is closed, return focus to the element that triggered it.

### 5. Screen Reader Support

Design and code with screen reader users in mind.

- **Text Alternatives:** Provide descriptive `alt` text for all informative images. For decorative images, use an empty `alt=""`.
- **Accessible Names:** Ensure all interactive elements have clear, accessible names (via visible text, `aria-label`, or `aria-labelledby`).
- **Hide Decorative Elements:** Use `aria-hidden="true"` for purely decorative elements that add no information.
- **Announce Dynamic Changes:** Use ARIA live regions (`aria-live`, `aria-atomic`, `aria-relevant`) to announce dynamic content changes.

**Example (Icon Button):**

```tsx
<button onClick={handleSave} aria-label="Save document">
	<SaveIcon aria-hidden="true" /> {/* Icon is decorative, label provided by aria-label */}
</button>
```

### 6. Color and Contrast

- **Contrast Ratios (WCAG 2.1 AA):**
    - Text: Minimum 4.5:1 against its background.
    - Large Text (18pt normal or 14pt bold): Minimum 3:1.
    - UI Components & Graphics: Minimum 3:1 for visual information required to identify components and states.
- **Information Conveyance:** Do not rely on color alone to convey information, indicate an action, prompt a response, or distinguish a visual element. Provide additional cues (text, icons, patterns).
- **Color Blindness:** Test color palettes for common forms of color blindness.

## Existing Patterns

Our codebase already implements many of these accessibility patterns. For instance:

- Modal components often include focus trapping and proper ARIA roles (e.g., `role="dialog"`, `aria-modal="true"`).
- Form components aim to correctly associate labels with inputs.
- Buttons and interactive elements are generally designed to be keyboard accessible.

When building new features or components, review existing similar components for established accessibility patterns. Strive for consistency and continuous improvement in accessibility.
