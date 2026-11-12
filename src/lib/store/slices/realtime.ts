import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface RealtimeState {
  /** Number of open app tabs, as reported by the Socket.io server. */
  sessions: number;
  connected: boolean;
}

const initialState: RealtimeState = { sessions: 0, connected: false };

export const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<number>) {
      state.sessions = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
      if (!action.payload) state.sessions = 0;
    },
  },
});

export const { setSessions, setConnected } = realtimeSlice.actions;
