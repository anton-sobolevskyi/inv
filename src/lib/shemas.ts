import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'required').pipe(z.email('invalidEmail')),
  password: z.string().min(8, 'passwordMin'),
});

export type LoginInput = z.infer<typeof loginSchema>;
