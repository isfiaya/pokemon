import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PokemonListResponse,
  PokemonDetail,
  PokemonListDisplayItem,
} from '../types';
import { getApiBaseUrl, extractPokemonId } from '../utils';
import { CACHE_TIMES } from '../constants';

// Define our API slice
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
  }),
  tagTypes: ['Pokemon', 'PokemonList'],
  keepUnusedDataFor: CACHE_TIMES.UNUSED_DATA,
  refetchOnMountOrArgChange: CACHE_TIMES.REFETCH_THRESHOLD,

  endpoints: builder => ({
    getPokemonList: builder.query<
      PokemonListDisplayItem[],
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: '/pokemon',
        params: { limit, offset },
      }),
      transformResponse: (
        response: PokemonListResponse
      ): PokemonListDisplayItem[] => {
        return response.results.map(pokemon => ({
          ...pokemon,
          id: extractPokemonId(pokemon.url),
        }));
      },
      providesTags: (_result, _error, { limit = 20, offset = 0 }) => [
        'PokemonList',
        // Create more specific cache tags for pagination
        { type: 'PokemonList' as const, id: `${limit}-${offset}` },
      ],
      // Better cache key serialization for pagination
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { limit = 20, offset = 0 } = queryArgs || {};
        return `${endpointName}(limit:${limit},offset:${offset})`;
      },
      // Keep list data for longer since Pokemon data is relatively static
      keepUnusedDataFor: CACHE_TIMES.POKEMON_LIST,
    }),
    getPokemonById: builder.query<PokemonDetail, number | string>({
      query: id => `/pokemon/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Pokemon', id },
        { type: 'Pokemon', id: 'PARTIAL-LIST' }, // For potential cache invalidation
      ],
      // Keep Pokemon details for 30 minutes since they rarely change
      keepUnusedDataFor: CACHE_TIMES.POKEMON_DETAIL,
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetPokemonListQuery, useGetPokemonByIdQuery } = pokemonApi;
