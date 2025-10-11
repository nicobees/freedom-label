# Create Label Page (Scaffold)

This route provides the initial structure for the Create Label view as per MVP story:

- Form built with TanStack Form (scaffolded)
- Two sections: anagraphic and lens specs
- Save (disabled) and Print actions
- Pure CSS responsive layout (single-column, two-column lens grid ≥768px)

Follow-up stories will:

- Replace simple text inputs with validated, debounced fields and date dropdowns
- Add copy left↔right lens helpers and history/undo/redo via form state
- Integrate Zod validation rules and submission wiring
