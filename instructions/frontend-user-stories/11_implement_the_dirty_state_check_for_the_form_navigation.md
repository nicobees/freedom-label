# 11 - Implement the dirty state check for the form navigation

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

As a user, I want to be warned before navigating away from the "Create Label" page if I have unsaved changes, so that I don't accidentally lose my work.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The application should detect when the form has un-submitted/pending changes (is "dirty").
- [ ] 2. If the form is dirty and the user tries to navigate away from the "Create Label" page, a confirmation dialog should be displayed.
- [ ] 3. The confirmation dialog should ask the user if they want to continue and lose their changes.
- [ ] 4. If the user confirms, they should be navigated to the new page.
- [ ] 5. If the user cancels, they should remain on the "Create Label" page.
- [ ] 6. Unit tests should be created for the dirty state check, mocking the navigation and checking that the confirmation dialog is displayed.
- [ ] 7. The confirmation dialog should be clearly visible and easy to interact with on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  This functionality should be implemented using the features provided by `@tanstack/react-form` and `@tanstack/router`.
2.  The confirmation dialog should be a simple browser confirmation for now.
3.  Use `@testing-library/react` for testing the component.
