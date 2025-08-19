import { z } from 'zod';

export const LensSpecsDataSchema = z.object({
  add: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid ADD format'),
  ax: z.string().regex(/^\d{3}$/, 'Invalid AX format'),
  bc: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid BC format'),
  cyl: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid CYL format'),
  dia: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid DIA format'),
  pwr: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid PWR format'),
  sag: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid SAG format'),
});

// type LensSpecsData = z.infer<typeof LensSpecsDataSchema>;

export const LensSide = {
  Left: 'left',
  Right: 'right',
} as const;
export type LensSide = (typeof LensSide)[keyof typeof LensSide];

const LensSpecsGridSchema = z.object({
  data: z.optional(LensSpecsDataSchema).nullable(),
  enabled: z.boolean(),
});

type LensSpecsGrid = z.infer<typeof LensSpecsGridSchema>;

const LensesSpecsSchema = z.object({
  [LensSide.Left]: LensSpecsGridSchema,
  [LensSide.Right]: LensSpecsGridSchema,
});

export type LensesSpecs = z.infer<typeof LensesSpecsSchema>;

export type LensesSpecsKeys = keyof LensesSpecs;

const PatientInfoSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
});

export type PatientInfo = z.infer<typeof PatientInfoSchema>;

const dateStringRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const dateStringValidationErrorMessage = 'Invalid date format (DD/MM/YYYY)';

export const LabelDataSchemaBase = z.object({
  description: z.string().min(2).max(24),
  due_date: z.string().regex(dateStringRegex, dateStringValidationErrorMessage),
  lens_specs: LensesSpecsSchema,
  patient_info: PatientInfoSchema,
  production_date: z
    .string()
    .regex(dateStringRegex, dateStringValidationErrorMessage),
});

export const LabelDataSchema = z
  .object({
    description: z.string().min(2).max(24),
    due_date: z
      .string()
      .regex(dateStringRegex, dateStringValidationErrorMessage),
    lens_specs: LensesSpecsSchema,
    patient_info: PatientInfoSchema,
    production_date: z
      .string()
      .regex(dateStringRegex, dateStringValidationErrorMessage),
  })
  .superRefine((data, ctx) => {
    // check lens_specs enabled
    const { lens_specs } = data;

    const { left, right } = lens_specs;

    const leftEnabled = left?.enabled ?? false;
    const leftData = left?.data;
    const rightEnabled = right?.enabled ?? false;
    const rightData = right?.data;

    if (!leftEnabled && !rightEnabled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least one LensSpec side',
        path: [`lens_specs.${LensSide.Left}.enabled`],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least one LensSpec side',
        path: [`lens_specs.${LensSide.Right}.enabled`],
      });

      return;
    }

    // check lens_specs data properly filled
    const leftResults = LensSpecsDataSchema.safeParse(leftData);
    const rightResults = LensSpecsDataSchema.safeParse(rightData);

    if (leftEnabled && !leftResults.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Properly fill all data',
        path: [`lens_specs.${LensSide.Left}.enabled`],
      });
    }

    if (rightEnabled && !rightResults.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Properly fill all data',
        path: [`lens_specs.${LensSide.Right}.enabled`],
      });
    }
  });

export type LabelData = z.infer<typeof LabelDataSchema>;

const LensSpecDataTransform = (value: LensSpecsGrid) => {
  const { data, enabled } = value;

  if (!enabled) return null;

  return { ...data };
};

const LensSpecsGridSubmitSchema = z
  .object({
    data: z.optional(LensSpecsDataSchema).nullable(),
    enabled: z.boolean(),
  })
  .transform(LensSpecDataTransform);

const LensesSpecsSubmitSchema = z.object({
  [LensSide.Left]: LensSpecsGridSubmitSchema,
  [LensSide.Right]: LensSpecsGridSubmitSchema,
});

export const LabelDataSubmitSchema = LabelDataSchemaBase.extend({
  lens_specs: LensesSpecsSubmitSchema,
});

export type LabelDataSubmit = z.infer<typeof LabelDataSubmitSchema>;

// TODO: remove the commented code
/**
 * "patient_info": {
        "name": "gabriele",
        "surname": "cara"
    },
    "description": "Lente sclerale F2mid",
    "batch": "25-0001",
    "due_date": "04/2026",
    "lens_specs": {
        "left": {
            "bc": "1.24",
            "dia": "1.24",
            "pwr": "+1.24",
            "cyl": "+1.24",
            "ax": "123",
            "add": "+1.24",
            "sag": "10.04"
        }
    }
 */
