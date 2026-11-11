import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { SessionUser } from '@/types';

export interface AuthState {
  user: SessionUser | null;
  status: 'guest' | 'authenticated';
}

const initialState: AuthState = { user: null, status: 'guest' };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<SessionUser>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    loggedOut(state) {
      state.user = null;
      state.status = 'guest';
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
