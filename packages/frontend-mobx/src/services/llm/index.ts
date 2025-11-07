import {
  jsonSchema,
  lensSpecsSchema,
  responseSchema,
  systemPrompt,
  systemPromptJsonParser,
} from '../auto-fill-form/chromeBuiltIn/constants';

/**
 * Token Classification
 *
 * natural language understanding task in which a label is assigned to some tokens in a text.
 * Some popular token classification subtasks are:
 * - Named Entity Recognition (NER)
 * - Part-of-Speech (PoS) tagging
 *
 * NER models could be trained to identify specific entities in a text, such as dates, individuals and places.
 * PoS tagging would identify, for example, which words in a text are verbs, nouns, and punctuation marks.
 */

type LlmOptions = {
  temperature: number;
  topK: number;
};

export class LlmService {
  options: LlmOptions;
  session: LanguageModel | null = null;
  sessionJson: LanguageModel | null = null;

  constructor(options: LlmOptions = { temperature: 0.0, topK: 1 }) {
    // setup main options for the model
    this.options = options;
  }

  //   async createSession() {
  //     const session = await LanguageModel.create({
  //       initialPrompts: [
  //         {
  //           content: `You are an expert optometry assistant specialized in contact lens prescriptions.

  // Field definitions:
  // - pwr/power deficit: Lens power in diopters (e.g., 2.25, -1.50)
  // - sag/sagittal/custom sagittal: Sagittal depth value (e.g., 1234)
  // - sag_toric/toric sagittal: Toric sagittal depth (e.g., 1248)
  // - bc: Base curve (e.g., 8.60)
  // - bc_toric: Toric base curve
  // - batch: Batch number (e.g., 10-2025)
  // - add: Addition power for near vision
  // - cyl: Cylinder correction
  // - ax: Axis value
  // - dia: Diameter

  // Extract all mentioned values from user prompts. Return null for unmentioned fields.`,
  //           role: 'system',
  //         },
  //       ],
  //       temperature: 0.0, // Low temperature for precise extraction
  //       topK: 1,
  //     });
  //   }

  async createSession() {
    const { temperature, topK } = this.options;
    this.session = await LanguageModel.create({
      // expectedOutputs: [{ languages: ['en'], type: 'text' }],
      initialPrompts: [
        {
          content: systemPrompt,
          role: 'system',
        },
        {
          content: `
          I want to create scleral lenses in RGP for Jon Doe: power is 1.00 and dia is 14.10.
          Left lens has also base curve of 2.12, while right lens has base curve of 1.00. Batch is temp-prod. Due date is 1st of February of next year.`,
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
        // {
        //   content: `
        //   Format this data
        //   - {description}: This is description text
        //   - {patient_info.name}: Tom
        //   - {lens_specs.[left].data.pwr}: 2.25
        //   - {lens_specs.[right].data.sag}: 1234
        //   - {lens_specs.[left].data.sag_toric}: 1248
        //   - {due_date}: 31st of next January
        //   `,
        //   role: 'user',
        // },
        // {
        //   content: `
        // {
        //   "description": "This is description text",
        //   "patient_info": {"name": "Tom"},
        //   "lens_specs": {
        //     "left": {"data": {"pwr": "2", "sag_toric": "2548"}},
        //     "right": {"data": {"sag": "2246"}}
        //   },
        //   "due_date": "31st of next January"
        // }
        //   `,
        //   role: 'assistant',
        // },
      ],
      temperature: 0.0,
      topK: 2,
    });

    this.sessionJson = await LanguageModel.create({
      initialPrompts: [
        {
          content: systemPromptJsonParser,
          role: 'system',
        },
        {
          content: `
- {patient_info.name}: Name
- {patient_info.surname}: Surname
- {lens_specs.[left].data.pwr}: -0.25
- {lens_specs.[left].data.sag}: 1111
- {lens_specs.[left].data.sag_toric}: 2222
- {lens_specs.[left].data.batch}: 10-2025
          `,
          role: 'user',
        },
        {
          content: `
{
  "patient_info": {
    "name": "Name",
    "surname": "Surname"
  },
  "lens_specs": {
    "left": {
      "data": {
        "pwr": "-0.25",
        "sag": "1111",
        "sag_toric": "2222",
        "batch": "10-2025"
      }
    }
  }
}
          `,
          role: 'assistant',
        },
      ],
      temperature: temperature,
      topK: topK,
    });
    // console.info(
    //   'LlmService: session created: ',
    //   systemPromptShort,
    //   this.session,
    // );
  }

  async init() {
    const available = await LanguageModel.availability();

    if (available === 'unavailable') {
      console.error(
        'Chrome AI not available. Enable chrome://flags/#prompt-api-for-gemini-nano',
      );
      return false;
    }

    // this.session = await LanguageModel.create({
    //   monitor(m) {
    //     m.addEventListener('downloadprogress', (e) => {
    //       console.log(`Downloaded ${e.loaded * 100}%`);
    //     });
    //   },
    // });

    return this.session;
  }

  async prompt(userPrompt: string) {
    if (!this.session || !this.sessionJson) return;
    // const tempPrompt = `
    // Format this data

    // - {patient_info.name}: John
    // - {patient_info.surname}: Doe
    // - {lens_specs.[left].data.pwr}: 2.25
    // - {lens_specs.[left].data.sag}: 1234
    // - {lens_specs.[left].data.sag_toric}: 1248
    // - {lens_specs.[left].data.batch}: 10-2025
    // - {due_date}: 31st of next January
    // `;
    //   const tempPrompt = `
    //       I want to create only-left contact lens for patience John Doe.
    //   It has a power deficit of 2.25. Also custom sagittal of 1234 and toric sagittal of 1248.
    //   Batch number is 10-2025. Due date is on 31st of next January
    //     `;
    //   const tempPrompt = `I want to create contact lenses for patient Tom First.
    //   It has a power deficit of 1.25, with diameter of 1.10. The base curve is 1.12 for the left lens, while is 2.10 for the right lens.
    //   Batch is temp-prod`;
    //   const tempPrompt = `I want to create only-left contact lens for patience John Doe.
    //   It has a power deficit of 2.25. Also custom sagittal of 1234 and toric sagittal of 1248.
    //   Batch number is 10-2025. Due date is on 31st of next January`;
    //   const tempPrompt = `Create toric lenses in RGP for patience Doe John. Left lens has power of 0.25, right lens a deficit of 1.75.
    // Diameter is 14.10, base curve is 2.39. Batch is 11-2025 and the due date is from today in 6 months.`;
    try {
      console.info('prompt: ', userPrompt);
      const result = await this.session.prompt(
        userPrompt,
        // {
        //   responseConstraint: responseSchema,
        // },
      );

      console.info(result);
      // Step 5: Parse guaranteed-valid JSON
      const parsed = result.replace('```json', '').replace('```', '');
      // const extracted = JSON.parse(parsed) as Record<string, unknown>;

      // console.log('Extracted data:', extracted);

      // const parsedJson = await this.sessionJson.prompt(`${parsed}`);

      // console.info('parsed json: ', parsedJson, this.session, this.sessionJson);

      // return extracted;
    } catch (error) {
      console.error('Extraction failed:', error);
    }
  }
}
