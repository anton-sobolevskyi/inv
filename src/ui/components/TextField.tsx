'use client';

import { useTranslations } from 'next-intl';
import { useId, type ComponentProps } from 'react';

import { cn } from '@/utils/cn';

export function TextField({
  label,
  error,
  className,
  ...input
}: { label: string; error?: string } & ComponentProps<'input'>) {
  const id = useId();
  const tv = useTranslations('Validation');
  return (
    <div className={cn('mb-4', className)}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={cn('form-control', error && 'is-invalid')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...input}
      />
      {error && (
        <span id={`${id}-error`} className="invalid-feedback" role="alert">
          {tv(error as never)}
        </span>
      )}
    </div>
  );
}
