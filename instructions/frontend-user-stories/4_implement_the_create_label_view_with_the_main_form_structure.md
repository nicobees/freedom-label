# 4 - Implement the Create Label view with the main form structure

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

As a user, I want to access a form to create a new label, so that I can input the necessary information for printing.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. A "Create Label" view should be created.
- [ ] 2. The view should contain a form element.
- [ ] 3. The form should be implemented using `@tanstack/react-form`.
- [ ] 4. The form should have two main sections: "anagraphic-section" and "lens-spec-section".
- [ ] 5. The form should have two buttons at the end: "save" and "print".
- [ ] 6. The "save" button should be disabled as it's not part of the MVP.
- [ ] 7. Unit tests should be created for the Create Label view, checking that the form and its sections are rendered correctly.
- [ ] 8. The form layout should be responsive, with a single-column layout on smaller screens to ensure a good user experience on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  Create a `CreateLabelPage` component in `src/routes/CreateLabelPage`.
2.  The component should be styled with pure CSS, following the guidelines in `docs/development_guidelines/styling-approach.md`.
3.  Use the latest version of `@tanstack/react-form`.
4.  Create custom hooks for the form to improve code maintainability, as suggested in the business requirements.
5.  Integrate Zod for validation, as suggested in the business requirements.
6.  Use `@testing-library/react` for testing the component.
