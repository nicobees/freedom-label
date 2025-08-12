---
applyTo: "/packages/frontend/**"
---

# Frontend - User Stories instructions

Please let's focus on the frontend application available at @packages/frontend: there are some specific business logic instructions in the
file @instructions/4_frontend_mvp_business_requirements.md.

Based on these instructions, please create User Stories to accomplish all the required features. The User Stories has to be compliant with all the best practices of Agile development guidelines (some examples in https://www.atlassian.com/agile/project-management/user-stories and https://www.atlassian.com/work-management/project-management/acceptance-criteria), and they have to include detailed Acceptance Criteria on how to achieve the requirements.

The frontend application is already setup in terms of: eslint, prettier, .gitignore, Dockerfile, tsconfig, vite config. Hence, please refer to this settings when writing the User Stories, if needed.

There should be no need to update these settings, but if there is the need, please choose one of the following (prefer the first option):

1. add these changes in separate User Story
2. create explicit Acceptance Criteria and/or Technical details in the same User Stories of other changes

Please, also consider checking and referring the general instructions and guidelines for the frontend code development available in @docs/development_guidelines folder.

The User Stories will be used later on as input to an Agentic AI (Claude Code, Gemini CLI, Cursor, GitHub Copilot, Windsurf, ...) that will actually implement the Acceptance Criteria and business requirements in the code: for this reason, please be very specific and detailed in the User Stories definition.

The User Stories will be then imported as GitHub issues, with additional info on fields such as "labels" and "priority"

## User Stories details

Please save the User stories inside the folder @instructions/frontend-user-stories: they will be saved as markdown content, each User Story will be saved as standalone file, filename will contain incremental integer number and User Story title in snake case.

For example:
title `2-HomePage View scaffolding` -> filename `2_home_page_view_scaffolding.md`
title `4-Form history management` -> filename `4_form_history_management.md`

Inside the markdown content, there will be also a block code with json object containing GitHub related info. At the moment, "labels" and "priority" are the two fields considered, with the following specs:

- labels: array of strings, possible values are ["backend", "bug","devops","documentation","duplicate","enhancement","frontend"], more than one value can be selected
- priority: string, possible values are ["Blocker", "Critical", "P0", "P1", "P2"] (sorted from most important to least important), one only value can be selected

This is the markdown format of a User Story (between """):

"""

# 1 - Short title description that will be reported also as file name in snake case

```json
{
  "priority": "P0",
  "labels": ["backend", "devops", "enhancement"]
}
```

### User Story title

Normal paragraph with usually 2-3 lines with the actual user-story-like title "As a [...], I want to [...], so that [...]"

### Acceptance Criteria (this is mandatory section)

- [ ] 1. list of acceptance criteria as ordered list and checkbox list
- [ ] 2. each item is ordered list and also checkbox item
- [ ] 3. ...

### Technical details (this is optional section, add it if necessary)

1. list of technical details as normal ordered list
2. here specific technical instructions are added
3. such as reference to specific folders, modules, files, libraries, coding approaches, best practices, ...
4. ...

"""
