# 6 - Implement the Lens Spec section of the form

```json
{
  "priority": "P0",
  "labels": ["frontend", "enhancement"]
}
```

### User Story title

As a User, I want to fill in the lens specification in the label creation form, so that the label contains the correct technical details for the lenses.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The "lens-spec-section" should have a two-column layout for the left and right lens: the two-column layout has to be responsive, switching to a single-column layout on smaller screens.
- [ ] 2. Each column should have a checkbox to activate or deactivate the lens spec.
- [ ] 3. At least one of the two lens specs must be activated for the form to be valid.
- [ ] 4. Each lens spec should have the fields specified in the already existing `LensesSpecsSchema`
- [ ] 8. There should be buttons to copy the values from the left lens to the right lens and vice-versa.
- [ ] 9. Unit tests should be created for the Lens Spec section, covering field validation, user interactions, and the copy functionality: take example from the already existing test files and test cases
- [ ] 10. The two-column layout should switch to a single-column layout on smaller screens to ensure a good user experience on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  The lens spec section should be a separate component in `src/components/CreateLabelForm/LensSpecSection`.
2.  Create reusable LensSpec component, that can be used for both left and right LensSpec.
3.  Create also reusable FloatNumberField component inside `fields` folder following same tanstack form pattern of the already existing ones
4.  Use Zod for validation of the fields, with the provided regex, in the already existing schema.
5.  The copy functionality should be implemented as a single action in the form's history.
6.  Use `@testing-library/react` for testing the component: use already existing implementation and wrappers to properly test it.
