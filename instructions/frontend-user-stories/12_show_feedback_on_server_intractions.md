# 12 - Show feedback on server interactions

```json
{
  "priority": "P1",
  "labels": ["frontend", "enhancement"]
}
```

As a User, I want to see feedback messages in the current view when interacting with the backend: at the moment the only interaction is for the Print process.

### Acceptance Criteria (frontend)

- [ ] 1. create reusable snackbar component (positioned in the bottom center of the view), which appears to show success or errors message from the API request
- [ ] 2. in case of success, the banner is visible for a fixed amount of time (e.g. 2 seconds), while in case of errors the banner is always visible and it will have a "x" close button in the top right corner
- [ ] 3. the success banner has green background, with white text
- [ ] 4. the error banner has red background, with white text
- [ ] 5. add loading view, which overlays the entire body while waiting for the response on the Print action
