# 9 - Implement the internationalization (i18n) feature

```json
{
  "priority": "P1",
  "labels": ["frontend", "enhancement"]
}
```

### User Story title

As a user, I want to be able to switch the language of the application, so that I can use it in my preferred language.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The application should support internationalization (i18n).
- [ ] 2. A language-switch button should be available in the header.
- [ ] 3. When the language-switch button is clicked, a dropdown with available languages should be displayed.
- [ ] 4. For the MVP, only English and Italian languages should be available.
- [ ] 5. All user-visible strings should be translated, including tooltips and form labels.
- [ ] 6. The language switch should be seamless, without a page refresh.
- [ ] 7. Unit tests should be created for the i18n feature, checking that the correct translations are loaded and displayed.
- [ ] 8. The language dropdown should be easily accessible on mobile devices.

### Technical details (this is optional section, add it if necessary)

1.  Use a modern and well-maintained i18n library for React/TypeScript, such as `react-i18next`.
2.  The translation files should be stored in a dedicated `locales` folder in `src/assets`.
3.  The i18n setup should follow the best practices for 2025.
4.  Use `@testing-library/react` for testing the component.
