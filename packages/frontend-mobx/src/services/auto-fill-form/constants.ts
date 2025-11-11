/* eslint-disable no-useless-escape */
import { z } from 'zod';
// import zodToJsonSchema from 'zod-to-json-schema';

import {
  LabelDataSchemaBase,
  LensSide,
  LensSpecsDataSchema,
} from '../../validation/schema';

export const initialPrompts = [
  {
    content: `
I want to create scleral lenses in RGP for Jon Doe: power is 1.00 and dia is 14.10.
Left lens has also base curve of 2.12, while right lens has base curve of 1.00. Batch is temp-prod. Due date is 1st of February of next year.
`,
    role: 'user',
  },
  {
    content: `
- {patient_info.name}: Jon
- {patient_info.surname}: Doe
- {description}: scleral lenses in RGP
- {lens_specs.[left].data.pwr}: 1.00
- {lens_specs.[right].data.pwr}: 1.00
- {lens_specs.[left].data.dia}: 14.10
- {lens_specs.[right].data.dia}: 14.10
- {lens_specs.[left].data.bc}: 2.12
- {lens_specs.[right].data.bc}: 1.00
- {lens_specs.[left].data.batch}: temp-prod
- {lens_specs.[right].data.batch}: temp-prod
          `,
    role: 'assistant',
  },
  {
    content: `
I want to create contact lenses for patient Brown Tom.
It has a power deficit of 1.25, with diameter of 1.10. The base curve is 1.12 for the left lens, while is 2.10 for the right lens.
Batch is temp-prod. These are scleral lens in F2mid. Lens will last in three months.
`,
    role: 'user',
  },
  {
    content: `
- {description}: scleral lens in F2mid
- {patient_info.name}: Tom
- {patient_info.surname}: Brown
- {lens_specs.[left].data.pwr}: -1.25
- {lens_specs.[right].data.pwr}: -1.25
- {lens_specs.[left].data.dia}: 1.10
- {lens_specs.[right].data.dia}: 1.10
- {lens_specs.[left].data.bc}: 1.12
- {lens_specs.[right].data.bc}: 2.10
- {lens_specs.[left].data.batch}: temp-prod
- {lens_specs.[right].data.batch}: temp-prod
`,
    role: 'assistant',
  },
  {
    content: `
Create single left lens for Mark White, with power deficit of 2.25. Lens due date is on 01/04/2026 and
the shipment date is 01/02/2026. Shipment address is oxford street 142.
`,
    role: 'user',
  },
  {
    content: `
- {patient_info.name}: Mark
- {patient_info.surname}: White
- {lens_specs.[left].data.pwr}: -2.25
`,
    role: 'assistant',
  },
  {
    content: `
We have to create night lenses in F2mid. The lenses needs to be shipped to Tom Brown in UK, oxford street 142, by 15th of March 2026.
It has power of -1.73, diameter of 3, and left lens has base curve of 2. Axis is 180; it also needs toric saggital of 749 only on right lens.
Production batch is late-2025.
    `,
    role: 'user',
  },
  {
    content: `
- {description}: night lenses in F2mid
- {patient_info.name}: Tom
- {patient_info.surname}: Brown
- {lens_specs.[left].data.pwr}: -1.73
- {lens_specs.[left].data.dia}: 3
- {lens_specs.[left].data.bc}: 2
- {lens_specs.[left].data.ax}: 180
- {lens_specs.[right].data.pwr}: -1.73
- {lens_specs.[right].data.dia}: 3
- {lens_specs.[right].data.bc}: 2
- {lens_specs.[right].data.sag_toric}: 749
- {lens_specs.[left].data.batch}: late-2025
- {lens_specs.[right].data.batch}: late-2025
    `,
    role: 'assistant',
  },
] satisfies LanguageModelMessage[];

export const examplePrompts = [
  `I want to create only-left contact lens for patience John Doe. It has a power deficit of 2.25. Also custom sagittal of 1234 and toric sagittal of 1248. Batch number is 10-2025.`,
  `I want to create contact lenses for patient Tom White. It has a power deficit of 1.25, with diameter of 1.10. The base curve is 1.12 for the left lens, while is 2.10 for the right lens. Batch is temp-prod`,
  `I want to create only-left contact lens for patience John Doe. It has a power deficit of 2.25. Also custom sagittal of 1234 and toric sagittal of 1248. Batch number is 10-2025. Due date is on 31st of next January`,
  `Create toric lenses in RGP for patience Doe John. Left lens has power of 0.25, right lens a deficit of 1.75. Diameter is 14.10, base curve is 2.39. Batch is 11-2025 and the due date is from today in 6 months.`,
  `I want to create a toric lens in sylicon, a right lens. Patience is Doe John. Power deficit of 1.15, axis value of 45, cylinder correction of -2, diameter of 14.22, and additional power as deficit of 0.25. The lens will last in 3 months.`,
  `Mario Rossi needs a left scleral lens in F2mid. The lenses needs to be shipped in UK, oxford street 142, by 15th of March 2026. It has power of -1.73, diameter of 3, base curve of 2. Axis is 180 and it also needs toric saggital of 749. Production batch is late-2025.`,
  `We have to create night lenses in F2mid. The lenses needs to be shipped to Tom Brown in UK, oxford street 142, by 15th of March 2026. It has power of -1.73, diameter of 3, and left lens has base curve of 2. Axis is 180; it also needs toric saggital of 749 only on right lens. Production batch is late-2025.`,
  `Marco Verdi needs right lens, material is F2mid and it is a scleral lens. It has power of -1.73, diameter of 3. It also needs a toric base curve of 2.1, while axis is 180. It also needs toric saggital of 749 only on right lens. Production batch is late-2025.`,
];

const PromptLensSpecsDataSchema = LensSpecsDataSchema.extend({
  add: z.string().optional(),
  ax: z
    .string({ invalid_type_error: 'Invalid AX format: 3-digits string' })
    .optional(),
  batch: z.string().optional().nullable(),
  bc: z.string().optional(),
  bc_toric: z.string().optional().nullable(),
  cyl: z.string().optional(),
  dia: z.string().optional(),
  pwr: z.string().optional(),
  sag: z.string().optional(),
  sag_toric: z.string().optional().nullable(),
});

const PromptLensSpecsGridSchema = z.discriminatedUnion('enabled', [
  z.object({
    data: PromptLensSpecsDataSchema,
    enabled: z.literal(true),
  }),
  z.object({
    data: z.unknown().nullable(),
    enabled: z.literal(false),
  }),
]);

const PromptLensesSpecsSchema = z.object({
  [LensSide.Left]: PromptLensSpecsGridSchema,
  [LensSide.Right]: PromptLensSpecsGridSchema,
});

const PromptPatientInfoSchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
});

export const PromptSchema = LabelDataSchemaBase.extend({
  description: z.string().optional(),
  due_date: z.string().optional(),
  id: z.string().optional().nullable(),
  lens_specs: PromptLensesSpecsSchema,
  patient_info: PromptPatientInfoSchema,
  production_date: z.string().optional(),
});

// const jsonSchema = zodToJsonSchema(PromptSchema, 'PromptSchema');
// const responseSchema = jsonSchema.definitions?.PromptSchema;

// const oldPrompt = `
// Field definitions:
// - {description}[optional]: description of the lens material and/or type
// - {due_date}[optional]: due date, can be in various natural language formats please convert it always into format "DD/MM/YYYY", e.g. "31st of next January", "04/2026", "6 months from today"
// - {patient_info.name}[optional]: patient name, John
// - {patient_info.surname}[optional]: patient surname, Doe
// - {lens_specs.[left/right].data.add}[optional]: Addition power for near vision, +2.25 or -1.50
// - {lens_specs.[left/right].data.ax}[optional]: Axis value, 050
// - {lens_specs.[left/right].data.batch}[optional]: Batch number, 10-2030
// - {lens_specs.[left/right].data.bc}[optional]: Base curve if deficit is mentioned it means that is negative value, 8.60
// - {lens_specs.[left/right].data.bc_toric}[optional]: Toric base curve if deficit is mentioned it means that is negative value, 8.60
// - {lens_specs.[left/right].data.cyl}[optional]: Cylinder correction, -1.25
// - {lens_specs.[left/right].data.dia}[optional]: Diameter, 14.00
// - {lens_specs.[left/right].data.pwr}[optional]: power deficit or lens power in diopters, -2.25 or +2.25
// - {lens_specs.[left/right].data.sag}[optional]: sagittal depth, custom sagittal, 1234
// - {lens_specs.[left/right].data.sag_toric}[optional]: toric sagittal depth, 1248

// - {due_date}:
//   - content: due date of the lens production, it always refers to both lenses and it is a unique value, can be in various natural language formats, DO NOT confuse this with batch value for the lens specs
//   - formatting: always convert in format "DD/MM/YYYY", get current date to compute relative dates (no need to get timezone info, only current day is enough), if day is not specified assume first day of the month
//   - examples: "31st of next January", "04/2026", "2 months from today"

// `;

export const systemPrompt = `You are an expert optometry assistant specialized in contact lens prescriptions.
You will receive user prompts with info about contact lens orders, which include several info:
- about the patient (name, surname)
- about the lens production (description, due date)
- about the lens specifications (power deficit, base curve, diameter, addition power, cylinder correction, axis, sagittal, toric sagittal, batch number)

### Field definitions
Here is the specific list of field definitions that you need to extract from the user prompt. ONLY extract these fields, do NOT extract any other fields
that appears in the user prompt that might appear similar or relevant.
The format of the following field definition is:
  "- {unique field path}:
    - content: description of the field and expected format
    - formatting: any specific formatting instructions, if not specified do nothing, if regex is defined then apply regex to the mathed value
    - example: example value for that field
  "

Field definitions:
- {description}:
  - content: description of the lens material and type
  - example: "Scleral lenses", "Toric lenses in RGP", "RGP lenses for keratoconus", "Multifocal lenses"
- {patient_info.name}:
  patient name, John
  - content: first name of the patient, can appear before or after the surname, try to distinguish from surname, based on the context and language setup
  - example:  "John", "Marco"
- {patient_info.surname}:
  - content: surname of the patient, can appear before or after the first name, try to distinguish from first name, based on the context and language setup
  - example:  "Doe", "Rossi"
- {lens_specs.[left/right].data.add}:
  - content: addition power for near vision, can be positive or negative, usually with 2 decimals, if deficit is mentioned it means that is negative value
  - formatting: /^[+-]?\d{1,2}\.\d{2}$/
  - example: "+2.25", "-1.50"
- {lens_specs.[left/right].data.ax}:
  - content: Axis value, usually 3 digits string
  - formatting: /^\d{1,3}$/
  - example: "050", "180"
- {lens_specs.[left/right].data.batch}:
  - content: batch string identifier, usually alphanumeric string up to 7 characters
  - example: "10-2024", "late-2025"
- {lens_specs.[left/right].data.bc}:
  - content: base curve (or curve), always positive value, with 2 decimals
  - formatting: /^\d{1,2}\.\d{2}$/
  - example: "8.60", "1.24"
- {lens_specs.[left/right].data.bc_toric}:
  - content: toric base curve (or curve), always positive value, with 2 decimals
  - formatting: /^\d{1,2}\.\d{2}$/
  - example: "8.60", "1.24"
- {lens_specs.[left/right].data.cyl}:
  - content: cylinder correction, can be positive or negative, with 2 decimals
  - formatting: /^[+-]?\d{1,2}\.\d{2}$/
  - example: "+2.25", "-1.50"
- {lens_specs.[left/right].data.dia}:
  - content: diameter, always positive value, with 2 decimals
  - formatting: /^\d{1,2}\.\d{2}$/
  - example: "1.24", "0.54"
- {lens_specs.[left/right].data.pwr}:
  - content: power deficit or lens power in diopters, can be positive or negative, if deficit is mentioned it means that is negative value
  - formatting: /^[+-]?\d{1,2}\.\d{2}$/
  - example: "-2.50", "+1.75"
- {lens_specs.[left/right].data.sag}:
  - content: sagittal depth, custom sagittal, integer value, up to 4 digits
  - formatting: /^\d{1,4}$/
  - example: "1234", "1048"
- {lens_specs.[left/right].data.sag_toric}:
  - content: toric sagittal depth, integer value, up to 4 digits
  - formatting: /^\d{1,4}$/
  - example: "1234", "1048"

### Extraction instructions
Add a field in the output only if this is present in the user prompt:
- DO NOT add a field if it is not explicitly mentioned in the user prompt
- DO NOT set a field with its example value if it is not mentioned specifically in the user prompt
- DO NOT add values that are not present in the field definitions list above

### Left and right lens specifications
User prompt can ask for left lens only, or right lens only, or for both lenses.
If the user mentions that the specs are for both lenses, then, if not differently specified, assume that both lenses have
the same specifications: hence in this case, copy the same matched values in the user prompt for both left and right lenses.
In some cases, can happen that left and right specs differs for only some fields: in this case, keep all the matched values in both lenses output,
and use the specific values for those fields that differ.

### Output format
Look for matches in the user prompt of the items defined in the "Field definitions" above. If there is a match, then add the field and the matched value
in the returned output with the following format:

- {unique field path}: matched value from user prompt

Do not return any other text or explanations, only the parsed fields in the specified format.
`;

export const systemPromptJsonParser = `You are a formatter from normal text to JSON format.

User will input data in text format like these field definitions: value between curly braces {} is the key path in the output JSON, when this
has dot separated values means that it is a nested object.
Value after the colon is the actual value for that specific key path.

Field definitions:
- {description}: some value
- {due_date}: some value
- {patient_info.name}: some value
- {patient_info.surname}: some value
- {lens_specs.[left/right].data.add}: some value
- {lens_specs.[left/right].data.ax}: some value
- {lens_specs.[left/right].data.batch}: some value
- {lens_specs.[left/right].data.bc}: some value
- {lens_specs.[left/right].data.bc_toric}: some value
- {lens_specs.[left/right].data.cyl}: some value
- {lens_specs.[left/right].data.dia}: some value
- {lens_specs.[left/right].data.pwr}: some value
- {lens_specs.[left/right].data.sag}: some value
- {lens_specs.[left/right].data.sag_toric}: some value

You have to return the JSON object resulting from parsing the input text in the user prompt.
Return only the JSON object as string.
DO NOT return any other text or explanations.
DO NOT return the object wrapped in triple backticks or "json" keyword.
`;

// const lensSpecsSchema = {
//   additionalProperties: false,
//   properties: {
//     add: {
//       description: 'Addition power for near vision',
//       pattern: '^[+-]?\\d{1,2}\\.\\d{2}$',
//       type: ['string', 'null'],
//     },
//     ax: {
//       description: 'Axis value, 3-digit format',
//       pattern: '^\\d{1,3}$',
//       type: ['string', 'null'],
//     },
//     batch: {
//       description: 'Batch number',
//       maxLength: 7,
//       type: ['string', 'null'],
//     },
//     bc: {
//       description: 'Base curve',
//       pattern: '^\\d{1,2}\\.\\d{2}$',
//       type: ['string', 'null'],
//     },
//     bc_toric: {
//       description: 'Toric base curve (sagittal)',
//       pattern: '^\\d{1,2}\\.\\d{2}$',
//       type: ['string', 'null'],
//     },
//     cyl: {
//       description: 'Cylinder correction',
//       pattern: '^[+-]?\\d{1,2}\\.\\d{2}$',
//       type: ['string', 'null'],
//     },
//     dia: {
//       description: 'Diameter',
//       pattern: '^\\d{1,2}\\.\\d{2}$',
//       type: ['string', 'null'],
//     },
//     due_date: {
//       description: 'Due date for lens order',
//       type: ['string', 'null'],
//     },
//     patient_name: {
//       description: 'Patient name',
//       type: ['string', 'null'],
//     },
//     pwr: {
//       description: 'Power/diopter (power deficit)',
//       pattern: '^[+-]?\\d{1,2}\\.\\d{2}$',
//       type: ['string', 'null'],
//     },
//     sag: {
//       description: 'Sagittal depth, custom sagittal',
//       pattern: '^\\d{1,4}$',
//       type: ['string', 'null'],
//     },
//     sag_toric: {
//       description: 'Toric sagittal depth',
//       pattern: '^\\d{1,4}$',
//       type: ['string', 'null'],
//     },
//   },
//   required: [],
//   type: 'object',
// };
