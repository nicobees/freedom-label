# 3 - Implement the Homepage view

```json
{
  "priority": "P0",
  "labels": [
    "frontend",
    "enhancement"
  ]
}
```

### User Story title

As a user, I want to see a simple and clear homepage with navigation options, so that I can easily access the main features of the application.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The Homepage view should display two buttons/links.
- [ ] 2. The first button should navigate to the "Create Label" view.
- [ ] 3. The second button should be for the "Label List" view, but it should be disabled.
- [ ] 4. The disabled "Label List" button should have a tooltip with the text "Not available yet".
- [ ] 5. The buttons should be horizontally and vertically centered in the view.
- [ ] 6. Unit tests should be created for the Homepage view, checking that the buttons are rendered and that the navigation works correctly.
- [ ] 7. The buttons should be stacked vertically on smaller screens to improve usability on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  Create a `HomePage` component in `src/routes/HomePage`.
2.  The component should be styled with pure CSS, following the guidelines in `docs/development_guidelines/styling-approach.md`.
3.  Use the `Link` component from Tanstack/Router for navigation.
4.  Use `@testing-library/react` for testing the component.
