import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authSlice, AuthState } from './slices';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

export const makeStore = (initialState: AuthState | undefined) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { auth: initialState },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
