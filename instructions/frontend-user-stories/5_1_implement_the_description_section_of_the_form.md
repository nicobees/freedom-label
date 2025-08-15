# 5 - Implement the Description section of the form

```json
{
  "priority": "P0",
  "labels": ["frontend", "enhancement"]
}
```

### User Story title

As a user, I want to fill in the description information in the label creation form, so that the label can have the proper info.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The "production_date" field should be composed of three dropdowns for day, month, and year.
- [ ] 2. The "production_date" field should be pre-filled with the current date.
- [ ] 3. The "due_date" field should be composed of three dropdowns for day, month, and year.
- [ ] 4. The "due_date" field should only allow the selection of future dates.
- [ ] 5. Unit tests should be created for the Anagraphic section, covering field validation and user interactions.
- [ ] 6. The fields should be displayed in a clear and readable way on mobile devices, with appropriate spacing and font sizes.

### Technical details (this is optional section, add it if necessary)

1.  The description section should be a separate component in `src/components/CreateLabelForm/DescriptionSection`.
2.  Use Zod for validation of the fields.
3.  The date dropdowns should be implemented as reusable components.
4.  The day dropdown should dynamically update based on the selected month and year.
5.  Use `@testing-library/react` for testing the component.
