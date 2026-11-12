import { Locale, ServerError } from '@/types';

export const LOCALES: Locale[] = ['en', 'uk'] as const;
export const INTL_LOCALE: Record<Locale, string> = { uk: 'uk-UA', en: 'en-GB' };

export const AUTH_COOKIE = 'inv_token';
export const TOKEN_TTL_SECONDS = 60 * 60 * 8;

export const SERVER_ERRORS: ServerError[] = ['invalidCredentials', 'invalidInput', 'network'];

export const LOCALE_COOKIE = 'inv_locale';
