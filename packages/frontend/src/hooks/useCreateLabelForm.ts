import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

// Minimal schema scaffold; fields will be enforced in dedicated stories
const anagraphicSchema = z
  .object({
    due_date: z.string().optional(),
    name: z.string().optional(),
    production_date: z.string().optional(),
    surname: z.string().optional(),
  })
  .optional();

const lensSpecSchema = z
  .object({
    bc: z.string().optional(),
    enabled: z.boolean().optional(),
    pwr: z.string().optional(),
    pwrSign: z.enum(['+', '-']).optional(),
    sag: z.string().optional(),
  })
  .optional();

export const createLabelSchema = z.object({
  anagraphic: anagraphicSchema,
  lenses: z
    .object({
      left: lensSpecSchema,
      right: lensSpecSchema,
    })
    .optional(),
});

export type CreateLabelFormValues = z.infer<typeof createLabelSchema>;

const defaultValues: CreateLabelFormValues = {
  anagraphic: {
    due_date: '',
    name: '',
    production_date: '',
    surname: '',
  },
  lenses: {
    left: { bc: '', enabled: true, pwr: '', pwrSign: '+', sag: '' },
    right: { bc: '', enabled: false, pwr: '', pwrSign: '+', sag: '' },
  },
};

export function useCreateLabelForm() {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Validate against Zod schema at submit time (integration for MVP scope)
      await createLabelSchema.parseAsync(value);
    },
  });

  return form;
}
