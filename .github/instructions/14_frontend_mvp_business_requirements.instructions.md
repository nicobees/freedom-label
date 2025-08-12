---
applyTo: "/packages/frontend/**"
---

# Freedom Label frontend application

## Project overall description

The project consists of a web application written in React and TypeScript.
The Users of the application are the workers of an Optical Lens factory: they build customised contact lenses for their customers and they need to create labels to attach to the lenses boxes. These labels will contain all the info that identifies the customer and the lens specs.

Now we want to build the MVP of the application: further details later on will tell which parts will be included in the MVP.

## Single Page App (SPA)

The application is structured, created and styled with the "mobile first" approach, even if it will be mainly used in a desktop environment. This is a very important aspect to consider during the build of the application.
The style will be handled by pure CSS, and there will be no style libraries involved.

This is a single page app (SPA) that consists of three main views: first is the "Home View", which allows to navigate to the "Create Label View" view and to the "List Label View". List label view is not part of the MVP.
An Header will be also always visible on top of the application.

The navigation through views is handled with the best practices of a SPA: the User navigation will be synchronised with the browser history.

> Important note
> The frontend application already has settings for linting (eslint), prettifying (prettier), .gitignore, docker (Dockerfile), typescript (tsconfig), vite. These settings (available in the root of the frontend package) are not meant to be changed, unless there is an explicit User Story to handle this.

### 1. Header

The application will always show a header on top, which shows dynamically the title of the current View.
On the left side of the header there is an hamburger menu button. At the moment, the icon is disabled since this is not part of the MVP: a tooltip telling "Not available yet" will be shown when the User hover with the mouse on the icon.

The Header will handle the main navigation of the application:

- use Tanstack/Router to handle navigation
- it shows dynamically the title of the current View
- the hamburger icon on the left becomes the usual left-arrow icon when User navigates from Homepage View to the other Views: if the User clicks on the left arrow icon than it will navigate back to the Homepage View
- considering that now the only view is the "Create Label" one, please setup a check on the "dirtyness" of the form of Create Label View: if the form has un-submitted/pending values, than the dirty state is also propagated to the navigation that will know and prevent the User to loose pending changes (message appear for the User asking to continue going back or not)

On the right side of the header there is a "language-switch" button: when the User clicks on it, a dropdown appears with the available languages.
In the MVP, only english is the supported languages at the moment. Please use the best practices (as of 2025) to handle translations and localisation in a React app with typescript, and use the best modules and libraries available. Every text visible to the User will have its proper translations, including the tooltip messages and the labels of the form input fields.
The language switch has to be seamless, without page refresh: when the User clicks on the different language, then suddenly all the strings will be updated in the view with the new values.
The header is also showing the title of the current View where the User is at the moment.

### 2. Views

#### 2.1. Homepage

The "Homepage" view, other than the header on top, will show only two buttons/links. These two buttons/links will allow the User tonavigate towards theother views.
At the moment only two buttons will be visible: the first is for the "Create Label" view and the second is for the "Label List" view.
The buttons are horizontally and vertically centered, and placed vertically in the view.
Considering the "Label list" view is not part of the MVP, its relative button here will be disabled and it will have a tooltip ("Not available yet").

#### 2.2. Create Label View

This view consists of a form which will allow the User to insert all the data of the label.
On form submit, the data will be sent to the backend server which will handle the printing itself: the API request to the server is not part of this MVP and now it will be simply mocked with a return value of 200 OK.

This is the most important view of the entire application, since it will be the most used by the User.

The form will have these specs:

- React Form from Tanstack is used (@tanstack/react-form)
- proper custom hooks are created in order to make the code more maintanable and accessible
- Zod validation in integrated in the form: some fields needs proper regex, which will be provided specifically
- debounce strategy for input text fields: 200ms interval, so that the form update is triggered not that often when the User is typing in a free input text field
- history of every change will be kept by the form itself: we want the User to be able to "undo" and "redo" every change that is applied to the form values (of course, for the debounced fields, the history update is triggered only after the 200ms interval)

Form consists of two sections: anagraphic-section, lens-spec-section.

##### 2.2.1 anagraphic-section

Three fields will be visible at the moment:

- name (`name`): string, mandatory, min length 2, max length 30, debounced field
- surname (`surname`): string, mandatory, min length 2, max length 30, debounced field
- production date (`production_date`): mandatory, this field will save data as string "DD/MM/YYYY", but it actually consists of three separated dropdown items, one for the day, one for the month and one for the year, also current date can be selected, it is prefilled with the current day, check "Dropdown details" below
- due date (`due_date`): mandatory, this field will save data as string "DD/MM/YYYY", but it actually consists of three separated dropdown items, one for the day, one for the month and one for the year, only future dates can be selected (i.e. if the year selected is the current one, the month listed will be only the future ones), check the "Dropdown details" below

> Dropdown details:
>
> - day: mandatory, dropdown element that shows all the days of the month, as integers, default from 1 to 31, it automatically aligns to the relative days of the month when this is selected
> - month: mandatory, dropdown element that shows all the 12 months as integers from 1 to 12
> - year: mandatory, dropdown element that shows all the years from the current one to the next five

##### 2.2.2 lens-spec-section

The horizontal space is splitted in two columns layout, one for the left lens and the other for the right lens.
Each lens-spec column will have the same type of fields.
On top of the lens-spec column there is a checkbox/button that allows to activate or deactivate the specific lens spec. If both left and right lens are disabled, are unchecked, then the form is invalid because at least one of the two should be activated, should be checked and its field should be filled.

Each lens spec has three fields, at the moment:

- BC (`bc`): float (two inter digits, two decimal digits), regex is `/^\d{1,2}\.\d{2}$/`, mandatory
- power (`pwr`): float (+/- sign, two inter digits, two decimal digits), regex is `/^[+-]?\d{1,2}\.\d{2}$/`, mandatory
- saggital (`sag`): float (two inter digits, two decimal digits), regex is `/^\d{1,2}\.\d{2}$/`, mandatory

It is needed that the User will insert the +/- sign using a dropdown menu, while the proper numeric value will be inserted in a usual input field.

The User will also be able to automatically copy the left-lens-spec values to the right-lens-spec, and vice versa, in order to optimise the data insertion in the form. Two specific buttons will handle this feature: they will include proper text and proper icon so that will be clear to the User what they are meant to do.
Also very important things to consider: also the automatic copy from left-to-right and viceversa in the lens-spec section will be added as entry in the history state of the form changes, hence this can also be "undo" and "redo" as the other changes. Please consider this changes as a whole: meaning that, if the User clicks on the "copy left lens spec to right" and then clicks on the "undo" button, than the all changes in the right-lens spec will be moved back to the previous history state (not one field only in the right-lens spec)

At end of the form there will be two buttons:

- "save": form data will be stored in the browser local storage. Not available in the MVP.
- "print": form data will be sent as body of POST request to the backend server, only validation of the data will be checked at the moment and the API request will be only mocked with mocked return value 200 OK from the server.

### UI

The application should be build as mobile-first. It will be mainly used in the Desktop browser, but UI should be compliant to mobile, tablet and desktop, in a responsive way.

Please consider this important aspect when writing the User Stories and updating the code in the workspace.

### Style

Please handle all the style using pure CSS: unfortunately some style libraries are not supported in the Production environment (Raspberry Pi 2 model B), which is 32 bit.

Please feel free to handle variables for theming if needed and possible.

Main requirement for the style is to use a material ui style, with simple elements/component.

The following two themes will be available: "Freedom Blue" and "Freedom Darker".
At the moment, only the Developers can set the theme, but the following two will be anyway available. Here below the main color palettes for the two themes: use the colors where specified, create colors based on description where hex code is not defined

Theme "Freedom Blue":

- primary color: #005392
- secondary color: #0180d1
- accent color: #148b8d
- background: white or light grey

Theme "Freedom Darker" (this will be considered the "dark" theme option)

- primary color: #005392
- secondary color: #000a92
- accent color: #009288
- background: black or dark grey

Style the main components in the page accordingly to the available themes: please make use of css variable and css best practices to properly handle the style following the themes. Please always consider that all the code must be runnable in 32-bit system.

Also please handle theme management in React application following best practices in 2025.

#### Icons

All icons has to be stored in the repo and has to be in svg format

### Documentation

A comprehensive documentation is present in @docs/frontend with the main goal of having an overall overview and awareness about the application structure and content. Documentation is mainly technical and related to implementation of the code, reasons behind specific choices, points of improvements.

The documentation has these main goals:

- depicts the overall project structure: there will be a section (with specific subfolders) for all the most important sub parts of the application
  - e.g. `components` section, `utilities` section
- depicts the main project specs and related to the relative files/folders: typescript config, styling rules, UI and responsiveness, form handling, custom hooks, form validation, unit tests,
- share common knowledge about the run time flows for the main features the application is exposing to the Users
  - e.g. label creation consists of form validation, form submission
- entry point for new developers joining the Team: for this reason documentation must be comprehensive, clear and easy to read as well
- documentation will be gradually implemented as long as the features and the code will be added: every User Story implementation also completes with the update of the documentation in all the parts where this is needed
- initially the documetation is empty: but still this can be created on the basis of business requirements instructions (@instructions/4_frontend_mvp_business_requirements.md), user stories instructions (@instructions/5_user_stories_instructions.md), development guidelines (@docs/development_guidelines)
