import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { LoginInput, loginSchema } from '@/lib/shemas';
import { login } from '@/lib/api';
import { loggedIn, useAppDispatch } from '@/lib/store';

export function useLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);

    try {
      const user = await login(values);

      dispatch(loggedIn(user));

      router.replace('/');
      router.refresh();
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
