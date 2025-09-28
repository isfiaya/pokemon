import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../services/pokemonApi';

// Create a test store with the same configuration as the main store
export const createTestStore = () => {
  return configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
};

export type TestStore = ReturnType<typeof createTestStore>;
