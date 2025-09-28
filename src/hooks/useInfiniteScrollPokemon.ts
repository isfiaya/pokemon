import { useState, useEffect } from 'react';
import { useGetPokemonListQuery } from '../services';
import type { PokemonListDisplayItem } from '../types';
import { POKEMON_PER_PAGE } from '../constants';

export function useInfiniteScrollPokemon() {
  const [page, setPage] = useState(0);
  const [allPokemon, setAllPokemon] = useState<PokemonListDisplayItem[]>([]);

  // Fetch current page
  const { data, isFetching, isError } = useGetPokemonListQuery({
    offset: page * POKEMON_PER_PAGE,
    limit: POKEMON_PER_PAGE,
  });

  // Accumulate results whenever a new page is fetched
  useEffect(() => {
    if (data) {
      setAllPokemon(prev => {
        const existing = new Set(prev.map(p => p.id));
        const newOnes = data.filter(p => !existing.has(p.id));
        return [...prev, ...newOnes];
      });
    }
  }, [data]);

  const loadMore = () => {
    if (!isFetching && data?.length === POKEMON_PER_PAGE) {
      setPage(p => p + 1);
    }
  };

  // Only show initial loading when we have no Pokemon loaded yet
  const isInitialLoading = isFetching && allPokemon.length === 0;
  // Show loading more when fetching and we already have some Pokemon
  const isLoadingMore = isFetching && allPokemon.length > 0;

  return {
    pokemonList: allPokemon,
    isLoading: isInitialLoading,
    isError,
    hasMore: data?.length === POKEMON_PER_PAGE,
    loadMore,
    isLoadingMore,
    refetch: () => {
      setAllPokemon([]);
      setPage(0);
    },
    totalLoaded: allPokemon.length,
  };
}
