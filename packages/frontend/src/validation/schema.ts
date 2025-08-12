import { z } from 'zod';

// Zod schema for PatientInfo
const PatientInfoSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
});

export type PatientInfo = z.infer<typeof PatientInfoSchema>;

// Zod schema for LeftRightSpecs
const LensSpecsSchema = z.object({
  add: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid ADD format'),
  ax: z.string().regex(/^\d{3}$/, 'Invalid AX format'),
  bc: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid BC format'),
  cyl: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid CYL format'),
  dia: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid DIA format'),
  pwr: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid PWR format'),
  sag: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid SAG format'),
});

export type LeftRightSpecs = z.infer<typeof LensSpecsSchema>;

// Zod schema for LensesSpecs
const LensesSpecsSchema = z.object({
  left: LensSpecsSchema.optional(),
  right: LensSpecsSchema.optional(),
});

export type LensesSpecs = z.infer<typeof LensesSpecsSchema>;

// Zod schema for the main LabelData
export const LabelDataSchema = z.object({
  batch: z
    .string()
    .regex(/^\d{2}-\d{4}$/, 'Invalid batch format (e.g., 25-0001)'),
  description: z.string().min(0).max(24),
  due_date: z.string().regex(/^\d{2}\/\d{4}$/, 'Invalid date format (MM/YYYY)'),
  lens_specs: LensesSpecsSchema,
  patient_info: PatientInfoSchema,
});

export type LabelData = z.infer<typeof LabelDataSchema>;
