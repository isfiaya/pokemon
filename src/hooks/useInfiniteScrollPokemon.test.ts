import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInfiniteScrollPokemon } from './useInfiniteScrollPokemon';
import { useGetPokemonListQuery } from '../services';

// Mock the API service
vi.mock('../services', () => ({
  useGetPokemonListQuery: vi.fn(),
}));

const mockUseGetPokemonListQuery = vi.mocked(useGetPokemonListQuery);

// Create a helper to generate complete mock return values
const createMockQueryResult = (overrides: Record<string, unknown> = {}) => ({
  data: undefined,
  isFetching: false,
  isError: false,
  isLoading: false,
  isSuccess: false,
  isUninitialized: false,
  refetch: vi.fn(),
  ...overrides,
});

describe('useInfiniteScrollPokemon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    mockUseGetPokemonListQuery.mockReturnValue(createMockQueryResult());

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    expect(result.current.pokemonList).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
    expect(result.current.totalLoaded).toBe(0);
  });

  it('should show initial loading when fetching first page', () => {
    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        isFetching: true,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it('should accumulate pokemon data correctly', () => {
    const mockPokemon1 = [
      { id: 1, name: 'bulbasaur', url: 'url1' },
      { id: 2, name: 'charmander', url: 'url2' },
    ];

    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemon1,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    expect(result.current.pokemonList).toEqual(mockPokemon1);
    expect(result.current.totalLoaded).toBe(2);
  });

  it('should handle load more functionality', () => {
    const mockPokemon = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `pokemon-${i + 1}`,
      url: `url${i + 1}`,
    }));

    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemon,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    // Should call the hook with next page
    expect(mockUseGetPokemonListQuery).toHaveBeenCalledWith({
      offset: 20,
      limit: 20,
    });
  });

  it('should not load more when already fetching', () => {
    const mockPokemon = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `pokemon-${i + 1}`,
      url: `url${i + 1}`,
    }));

    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemon,
        isFetching: true,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    const initialCallCount = mockUseGetPokemonListQuery.mock.calls.length;

    act(() => {
      result.current.loadMore();
    });

    // Should not make additional calls when already fetching
    expect(mockUseGetPokemonListQuery.mock.calls.length).toBe(initialCallCount);
  });

  it('should not load more when data length is less than POKEMON_PER_PAGE', () => {
    const mockPokemon = [
      { id: 1, name: 'bulbasaur', url: 'url1' },
      { id: 2, name: 'charmander', url: 'url2' },
    ];

    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemon,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    expect(result.current.hasMore).toBe(false);

    const callsBefore = mockUseGetPokemonListQuery.mock.calls.length;

    act(() => {
      result.current.loadMore();
    });

    const callsAfter = mockUseGetPokemonListQuery.mock.calls.length;

    // Should not make additional calls when hasMore is false
    expect(callsAfter).toBe(callsBefore);
  });

  it('should handle error state correctly', () => {
    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        isError: true,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    expect(result.current.isError).toBe(true);
  });

  it('should refetch and reset data correctly', () => {
    const mockPokemon = [
      { id: 1, name: 'bulbasaur', url: 'url1' },
      { id: 2, name: 'charmander', url: 'url2' },
    ];

    mockUseGetPokemonListQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemon,
      })
    );

    const { result } = renderHook(() => useInfiniteScrollPokemon());

    // Initially has data
    expect(result.current.pokemonList).toEqual(mockPokemon);

    act(() => {
      result.current.refetch();
    });

    // Should reset to empty and start from page 0
    expect(result.current.pokemonList).toEqual([]);
  });
});
