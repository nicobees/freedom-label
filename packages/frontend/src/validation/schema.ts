import { z } from 'zod';

export const LensSpecsSchema = z.object({
  add: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid ADD format'),
  ax: z.string().regex(/^\d{3}$/, 'Invalid AX format'),
  bc: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid BC format'),
  cyl: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid CYL format'),
  dia: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid DIA format'),
  pwr: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid PWR format'),
  sag: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid SAG format'),
});

export type LeftRightSpecs = z.infer<typeof LensSpecsSchema>;

const LensesSpecsSchema = z.object({
  left: LensSpecsSchema.optional(),
  right: LensSpecsSchema.optional(),
});

export type LensesSpecs = z.infer<typeof LensesSpecsSchema>;

const PatientInfoSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
});

export type PatientInfo = z.infer<typeof PatientInfoSchema>;

const dateStringRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const dateStringValidationErrorMessage = 'Invalid date format (DD/MM/YYYY)';

export const LabelDataSchema = z.object({
  description: z.string().min(2).max(24),
  due_date: z.string().regex(dateStringRegex, dateStringValidationErrorMessage),
  lens_specs: LensesSpecsSchema,
  patient_info: PatientInfoSchema,
  production_date: z
    .string()
    .regex(dateStringRegex, dateStringValidationErrorMessage),
});

export type LabelData = z.infer<typeof LabelDataSchema>;

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
