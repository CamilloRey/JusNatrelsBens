import { z } from 'zod';

export const productSchema = z.object({
  name:      z.string().min(2, 'Minimum 2 caractères'),
  category:  z.enum(['Jus', 'Tisanes', 'Épices', 'Cosmétiques']),
  price:     z.number().positive('Le prix doit être positif'),
  formats:   z.array(z.string()).min(1, 'Au moins un format requis'),
  desc:      z.string().max(500).optional().default(''),
  tag:       z.string().optional().default(''),
  img:       z.string().min(1, 'Une icône ou photo est requise'),
  available: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
