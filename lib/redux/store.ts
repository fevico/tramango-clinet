import { configureStore } from '@reduxjs/toolkit';
import { packagesApi } from './services/packagesApi';

export const store = configureStore({
  reducer: {
    [packagesApi.reducerPath]: packagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(packagesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
