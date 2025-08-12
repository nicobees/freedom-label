# 2 - Implement the main application Header

```json
{
  "priority": "P0",
  "labels": ["frontend", "enhancement"]
}
```

### User Story title

As a user, I want to see a clear and informative header at the top of the application, so that I can easily understand the current context and navigate between different views.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The header should always be visible at the top of the application.
- [ ] 2. The header should dynamically display the title of the current view.
- [ ] 3. The header should have a hamburger menu button on the left side.
- [ ] 4. The hamburger menu button should be disabled and show a tooltip "Not available yet" on hover.
- [ ] 5. The hamburger icon should change to a left-arrow icon when navigating away from the Homepage View, with a rotational animation typical of material ui design.
- [ ] 6. Clicking the left-arrow icon should navigate the user back to the Homepage View.
- [ ] 7. The header should have a language-switch button on the right side: please select a specific icon for this.
- [ ] 8. Clicking the language-switch button should open a dropdown with available languages (only English for now).
- [ ] 9. Unit tests should be created for the Header component, checking that the title is correctly displayed and that the navigation works as expected.
- [ ] 10. The header should be responsive, ensuring that the title and buttons are correctly displayed on smaller screens.

### Technical details (this is optional section, add it if necessary)

1.  Create a `Header` component in `src/components/Header`.
2.  The component should be styled with pure CSS, following the guidelines in `docs/development_guidelines/styling-approach.md`.
3.  The header title should be updated based on the current route from Tanstack/Router.
4.  The language switch will be implemented in a separate user story.
5.  Use `@testing-library/react` for testing the component.
