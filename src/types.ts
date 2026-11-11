export type Locale = 'en' | 'uk';

export interface SessionUser {
  id: number;
  email: string;
  displayName: string;
}

export type ServerError = 'invalidCredentials' | 'invalidInput' | 'network';
