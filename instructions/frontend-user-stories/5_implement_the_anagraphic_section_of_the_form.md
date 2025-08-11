# 5 - Implement the Anagraphic section of the form

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

As a user, I want to fill in the anagraphic information in the label creation form, so that the label can be associated with a specific person.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The "anagraphic-section" should contain three fields: "name", "surname", "production_date", and "due_date".
- [ ] 2. The "name" field should be a debounced text input with a 200ms interval.
- [ ] 3. The "name" field should be mandatory, with a minimum length of 2 and a maximum length of 30.
- [ ] 4. The "surname" field should be a debounced text input with a 200ms interval.
- [ ] 5. The "surname" field should be mandatory, with a minimum length of 2 and a maximum length of 30.
- [ ] 6. The "production_date" field should be composed of three dropdowns for day, month, and year.
- [ ] 7. The "production_date" field should be pre-filled with the current date.
- [ ] 8. The "due_date" field should be composed of three dropdowns for day, month, and year.
- [ ] 9. The "due_date" field should only allow the selection of future dates.
- [ ] 10. Unit tests should be created for the Anagraphic section, covering field validation and user interactions.
- [ ] 11. The fields should be displayed in a clear and readable way on mobile devices, with appropriate spacing and font sizes.

### Technical details (this is optional section, add it if necessary)

1.  The anagraphic section should be a separate component in `src/components/CreateLabelForm/AnagraphicSection`.
2.  Use Zod for validation of the fields.
3.  The date dropdowns should be implemented as reusable components.
4.  The day dropdown should dynamically update based on the selected month and year.
5.  Use `@testing-library/react` for testing the component.
