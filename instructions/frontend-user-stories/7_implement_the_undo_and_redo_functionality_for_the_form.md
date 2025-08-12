# 7 - Implement the undo and redo functionality for the form

```json
{
  "priority": "P1",
  "labels": [
    "frontend",
    "enhancement"
  ]
}
```

### User Story title

As a user, I want to be able to undo and redo my changes in the form, so that I can easily correct mistakes without having to re-enter all the data.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The form should keep a history of all changes made to its fields.
- [ ] 2. There should be two buttons, "undo" and "redo", to navigate through the history of changes.
- [ ] 3. The "undo" button should revert the last change made to the form.
- [ ] 4. The "redo" button should re-apply the last undone change.
- [ ] 5. The undo/redo functionality should also work for the debounced fields, after the debounce interval.
- [ ] 6. The copy functionality in the lens-spec section should be treated as a single change in the history.
- [ ] 7. Unit tests should be created for the undo/redo functionality, checking that the form state is correctly updated after each action.
- [ ] 8. The undo/redo buttons should be easily accessible on mobile devices, without obstructing the form fields.

### Technical details (this is optional section, add it if necessary)

1.  This functionality should be implemented using the features provided by `@tanstack/react-form`.
2.  The undo and redo buttons should be placed in a convenient location, for example, near the form buttons.
3.  Use `@testing-library/react` for testing the component.
