# 8 - Implement the form submission (mocked)

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

As a user, I want to be able to submit the form, so that the label can be printed.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. When the "print" button is clicked, the form data should be validated.
- [ ] 2. If the form is valid, a POST request should be sent to the backend server.
- [ ] 3. For the MVP, the API request should be mocked, and a 200 OK response should be returned.
- [ ] 4. If the form is invalid, the user should be notified of the errors.
- [ ] 5. Unit tests should be created for the form submission, checking that the API request is sent with the correct data and that the UI is updated accordingly.
- [ ] 6. The submission feedback (success or error messages) should be clearly visible on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  The form submission logic should be handled in the `CreateLabelPage` component.
2.  Use a library like `msw` (Mock Service Worker) to mock the API request, as suggested in the development guidelines.
3.  The mocked API endpoint should be `/api/print`.
4.  Use `@testing-library/react` and `msw` for testing the component.
