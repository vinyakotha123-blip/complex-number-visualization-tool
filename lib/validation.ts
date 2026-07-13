import { z } from 'zod';

export const savedGraphInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(60, 'Name must be 60 characters or fewer.'),
  re: z
    .number({ invalid_type_error: 'Real part must be a number.' })
    .finite('Real part must be a finite number.'),
  im: z
    .number({ invalid_type_error: 'Imaginary part must be a number.' })
    .finite('Imaginary part must be a finite number.'),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Color must be a valid hex code.')
    .optional(),
});

export const savedGraphUpdateSchema = savedGraphInputSchema.partial();

export type SavedGraphInputParsed = z.infer<typeof savedGraphInputSchema>;
