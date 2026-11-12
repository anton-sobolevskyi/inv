import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import { authSlice, AuthState, realtimeSlice, setProductType, uiSlice } from './slices';
import { api } from '@/lib/api';
import { UI_STORAGE_KEY } from '@/constants';
import { storage } from './storage';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  realtime: realtimeSlice.reducer,
  ui: uiSlice.reducer,
  [api.reducerPath]: api.reducer,
});

const persistListener = createListenerMiddleware();
persistListener.startListening({
  actionCreator: setProductType,
  effect: (action) => storage.write(UI_STORAGE_KEY, { productType: action.payload }),
});

export const makeStore = (initialState: AuthState | undefined) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: { auth: initialState },
    middleware: (getDefault) => getDefault().concat(api.middleware, persistListener.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
