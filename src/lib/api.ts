import { SERVER_ERRORS } from '@/constants';
import { ServerError, SessionUser } from '@/types';
import axios, { isAxiosError } from 'axios';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

export async function login(data: { email: string; password: string }): Promise<SessionUser> {
  try {
    const {
      data: { user },
    } = await http.post<{ user: SessionUser }>('/api/auth/login', data);

    return user;
  } catch (error) {
    const code = isAxiosError(error) ? (error.response?.data?.error as ServerError) : undefined;
    throw code && SERVER_ERRORS.includes(code) ? code : 'network';
  }
}

export async function logout(): Promise<void> {
  try {
    await http.post('/api/auth/logout');
  } catch (error) {
    const code = isAxiosError(error) ? (error.response?.data?.error as ServerError) : undefined;
    throw code && SERVER_ERRORS.includes(code) ? code : 'network';
  }
}
