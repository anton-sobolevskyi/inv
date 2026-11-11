'use client';

import { TextField } from '@/ui/components/TextField';

import { useTranslations } from 'next-intl';
import { useLoginForm } from '@/hooks/useLoginForm';

export default function LoginForm() {
  const t = useTranslations('Login');
  const { register, errors, isSubmitting, onSubmit, serverError } = useLoginForm();

  return (
    <form onSubmit={onSubmit} noValidate>
      <TextField
        label={t('email')}
        type="email"
        autoComplete="username"
        error={errors.email?.message}
        data-autofocus
        {...register('email')}
      />
      <TextField
        label={t('password')}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {serverError && <div className="alert alert-danger mb-4">{t(serverError)}</div>}
      <button type="submit" className="w-100 btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
