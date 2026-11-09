import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from './slices';

export const reducer = {
  auth: authSlice.reducer,
};

export const makeStore = () => {
  return configureStore({
    reducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
