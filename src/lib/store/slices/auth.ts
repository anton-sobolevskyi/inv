import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
}

export interface AuthState {
  user: AuthUser | null;
  status: 'guest' | 'authenticated';
}

const initialState: AuthState = { user: null, status: 'guest' };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    loggedOut(state) {
      state.user = null;
      state.status = 'guest';
    },
  },
});
