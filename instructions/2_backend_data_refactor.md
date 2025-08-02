# Main data structure

Consider the following data structure, made of several fields with their respective names

- patient_info: object/class with following nested fields
  - name: string, min length: 2, max length: 14
  - surname: string, min length: 2, max length: 14
- description: string, min length: 0, max length: 24
- batch: string, made of two parts separated by hyphen: first part is the year (only last two digits), second part is 4 digits incremental number (with leading zeros), e.g. `25-0001`, `26-0294`
- due_date: data with only months (two digits) and year (full 4 digits), with separator forward slash `/`, e.g. `04/2026`
- lens_specs: nested object/class
  - left: object/class with the following nested fields, which will be described as numbers but actually will be all handled as strings, so eventually please provide regex for them
    - bc: dot separated decimal number, with two decimals digits, max two digits for the integer part, e.g. `8.42`, `12.01`, `4.40`
    - dia: same as previous `bc`
    - pwr: same as previous `bc` but with + or - sign in front (a total maximum of 6 chars, including + or minus and .), e.g. `+8.42`, `-12.01`, `+4.40`
    - cyl: same as previous `pwr`
    - ax: integer, three digits number, e.g. `124`, `102`
    - add: same as previous `pwr`
    - sag: same as previous `bc`
  - right: same as `left` nested object

I would like to convert this data structure into python3 code and into typescript code. Please make this happen using the following rules, respectively for python and typescript.

### General rules

Please always follow best practices and suggest usage of most used modules/tools to accomplish the final result. Please also add comments in important items in the code (both objects or methods or variables).

### Python specs

Conver the data structure into a typed class, using `pydantic` module: use also `typing` module only if needed. Please add the proper validation and keep the nested structure. The nested object/class `lens_spec` should be defined separately (since it will be re-used in other parts of the code) and then injected into the main data structure definition.

Add this new definition inside file @backend/app/main.py

### Typescript

Convert the data structure into a `zod` object implementing the proper validation: use regex where needed, please consider that all values are strings, even if they have actual values as numbers.
Please create specific type for the data structure, inferred by the zod object.
Please define the nested object `lens_specs` as standalone data structure and then inject in the main data structure.

Add this new definition inside file @frontend/src/App.tsx
