import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'required').pipe(z.email('invalidEmail')),
  password: z.string().min(8, 'passwordMin'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);

    try {
      // TODO: Implement login logic
    } catch (error) {
      setError(error as string);
    }
  });

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    serverError: error,
  };
}
