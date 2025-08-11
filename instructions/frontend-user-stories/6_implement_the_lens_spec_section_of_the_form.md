# 6 - Implement the Lens Spec section of the form

```json
{
  "priority": "P0",
  "labels": ["frontend", "enhancement"]
}
```

### User Story title

As a user, I want to fill in the lens specification in the label creation form, so that the label contains the correct technical details for the lenses.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The "lens-spec-section" should have a two-column layout for the left and right lens: the two-column layout has to be responsive, switching to a single-column layout on smaller screens.
- [ ] 2. Each column should have a checkbox to activate or deactivate the lens spec.
- [ ] 3. At least one of the two lens specs must be activated for the form to be valid.
- [ ] 4. Each lens spec should have three fields: "BC", "power", and "saggital".
- [ ] 5. The "BC" field should be a float with the format `##.##`.
- [ ] 6. The "power" field should be a float with the format `+/-##.##`, with the sign selected from a dropdown.
- [ ] 7. The "saggital" field should be a float with the format `##.##`.
- [ ] 8. There should be buttons to copy the values from the left lens to the right lens and vice-versa.
- [ ] 9. Unit tests should be created for the Lens Spec section, covering field validation, user interactions, and the copy functionality.
- [ ] 10. The two-column layout should switch to a single-column layout on smaller screens to ensure a good user experience on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  The lens spec section should be a separate component in `src/components/CreateLabelForm/LensSpecSection`.
2.  Use Zod for validation of the fields, with the provided regex.
3.  The copy functionality should be implemented as a single action in the form's history.
4.  Use `@testing-library/react` for testing the component.
