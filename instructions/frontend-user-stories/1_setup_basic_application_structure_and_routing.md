# 1 - Setup basic application structure and routing

```json
{
  "priority": "P0",
  "labels": ["frontend", "enhancement"]
}
```

### User Story title

As a developer, I want to set up the basic application structure and routing, so that we have a solid foundation for building the rest of the application.

### Acceptance Criteria (this is mandatory section)

- [ ] 1. The application should have a clear and scalable folder structure.
- [ ] 2. The application should use Tanstack/Router for routing.
- [ ] 3. The application should have three main routes: "Home", "Create Label", and "List Label".
- [ ] 4. The "List Label" route should be disabled for now as it's not part of the MVP.
- [ ] 5. The navigation between views should be synchronized with the browser history.
- [ ] 6. A basic "Not Found" page should be implemented for unknown routes.
- [ ] 7. Unit tests should be created for the routing configuration, checking that the correct components are rendered for each route.
- [ ] 8. The main application layout should be responsive and follow a mobile-first approach, ensuring the content is readable and usable on small screens.

### Technical details (this is optional section, add it if necessary)

1.  The main root of the application is `packages/frontend` folder: inside here there is an already existing `src` folder where all the code has to be added.
2.  Inside existing `src`, create the following folders: `components`, `routes`, `hooks`, `styles`, `utils`, `assets`, `contexts`, `services`, `config`.
3.  The main application entry point should be `src/main.tsx`.
4.  The routing configuration should be in `src/routes/index.tsx`.
5.  Use the latest version of `@tanstack/router` for routing.
6.  Use `@testing-library/react` for testing the components and routes.
