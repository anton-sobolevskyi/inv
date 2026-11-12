import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authSlice, AuthState, realtimeSlice } from './slices';
import { api } from '@/lib/api';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  realtime: realtimeSlice.reducer,
  [api.reducerPath]: api.reducer,
});

export const makeStore = (initialState: AuthState | undefined) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { auth: initialState },
    middleware: (getDefault) => getDefault().concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
