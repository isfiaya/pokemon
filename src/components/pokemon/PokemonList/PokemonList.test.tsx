import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PokemonList } from './PokemonList';
import { PokemonCard } from './PokemonCard';
import { mockPokemonList } from '../../../test/mockData';
import type { PokemonListDisplayItem } from '../../../types';

// Mock the useInfiniteScrollPokemon hook
vi.mock('../../../hooks/useInfiniteScrollPokemon', () => ({
  useInfiniteScrollPokemon: vi.fn(),
}));

// Mock the child components to focus on PokemonList logic
vi.mock('../../shared/LoadingSpinner/LoadingSpinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => (
    <div data-testid='loading-spinner'>{message}</div>
  ),
}));

vi.mock('../../shared/ErrorMessage/ErrorMessage', () => ({
  ErrorMessage: ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div data-testid='error-message'>
      {message}
      <button data-testid='retry-button' onClick={onRetry}>
        Retry
      </button>
    </div>
  ),
}));

vi.mock('../../shared/LazyImage', () => ({
  LazyImage: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid='pokemon-image'
    />
  ),
}));

import { useInfiniteScrollPokemon } from '../../../hooks/useInfiniteScrollPokemon';

const mockUseInfiniteScrollPokemon = vi.mocked(useInfiniteScrollPokemon);

// Test helper for rendering components with router
const renderWithRouter = (
  component: React.ReactElement,
  initialRoute = '/'
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>
  );
};

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: [],
      isLoading: true,
      isError: false,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
      refetch: vi.fn(),
      totalLoaded: 0,
    });

    render(<PokemonList />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
  });

  it('should render error state with retry functionality', () => {
    const mockRefetch = vi.fn();
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: [],
      isLoading: false,
      isError: true,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
      refetch: mockRefetch,
      totalLoaded: 0,
    });

    render(<PokemonList />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Failed to load Pokemon list')).toBeInTheDocument();

    const retryButton = screen.getByTestId('retry-button');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledOnce();
  });

  it('should render empty state when no pokemon found', () => {
    const mockRefetch = vi.fn();
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: [],
      isLoading: false,
      isError: false,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
      refetch: mockRefetch,
      totalLoaded: 0,
    });

    render(<PokemonList />);

    expect(screen.getByText('No Pokemon found.')).toBeInTheDocument();
    const tryAgainButton = screen.getByText('Try again');
    expect(tryAgainButton).toBeInTheDocument();

    fireEvent.click(tryAgainButton);
    expect(mockRefetch).toHaveBeenCalledOnce();
  });

  it('should render pokemon list successfully', () => {
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      isLoading: false,
      isError: false,
      hasMore: true,
      loadMore: vi.fn(),
      isLoadingMore: false,
      refetch: vi.fn(),
      totalLoaded: 3,
    });

    renderWithRouter(<PokemonList />);

    expect(screen.getByText('Pokemon List')).toBeInTheDocument();
    expect(screen.getByText('3 Pokemon loaded')).toBeInTheDocument();

    // Check that all pokemon are rendered
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText('Venusaur')).toBeInTheDocument();

    // Check that pokemon IDs are displayed
    expect(screen.getByText('#001')).toBeInTheDocument();
    expect(screen.getByText('#002')).toBeInTheDocument();
    expect(screen.getByText('#003')).toBeInTheDocument();
  });

  it('should render load more button when hasMore is true', () => {
    const mockLoadMore = vi.fn();
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      isLoading: false,
      isError: false,
      hasMore: true,
      loadMore: mockLoadMore,
      isLoadingMore: false,
      refetch: vi.fn(),
      totalLoaded: 3,
    });

    renderWithRouter(<PokemonList />);

    const loadMoreButton = screen.getByText('Load More Pokemon');
    expect(loadMoreButton).toBeInTheDocument();
    expect(loadMoreButton).not.toBeDisabled();

    fireEvent.click(loadMoreButton);
    expect(mockLoadMore).toHaveBeenCalledOnce();
  });

  it('should show loading state for load more button', () => {
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      isLoading: false,
      isError: false,
      hasMore: true,
      loadMore: vi.fn(),
      isLoadingMore: true,
      refetch: vi.fn(),
      totalLoaded: 3,
    });

    renderWithRouter(<PokemonList />);

    expect(screen.getByText('Loading more Pokemon...')).toBeInTheDocument();
    const loadMoreButton = screen.getByRole('button', {
      name: /loading more pokemon/i,
    });
    expect(loadMoreButton).toBeDisabled();
    expect(loadMoreButton).toHaveClass('loading');
  });

  it('should show end message when no more pokemon to load', () => {
    mockUseInfiniteScrollPokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      isLoading: false,
      isError: false,
      hasMore: false,
      loadMore: vi.fn(),
      isLoadingMore: false,
      refetch: vi.fn(),
      totalLoaded: 3,
    });

    renderWithRouter(<PokemonList />);

    expect(
      screen.getByText("🎉 You've seen all available Pokemon!")
    ).toBeInTheDocument();
    expect(screen.getByText('Total: 3 Pokemon')).toBeInTheDocument();
    expect(screen.queryByText('Load More Pokemon')).not.toBeInTheDocument();
  });
});

describe('PokemonCard', () => {
  const samplePokemon: PokemonListDisplayItem = {
    id: 25,
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/',
  };

  it('should render pokemon card with correct information', () => {
    renderWithRouter(<PokemonCard pokemon={samplePokemon} />);

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('View Details →')).toBeInTheDocument();
  });

  it('should render pokemon image with correct attributes', () => {
    renderWithRouter(<PokemonCard pokemon={samplePokemon} />);

    const image = screen.getByTestId('pokemon-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg'
    );
    expect(image).toHaveAttribute('alt', 'Pikachu');
  });

  it('should format pokemon name correctly', () => {
    const pokemonWithLowerCase: PokemonListDisplayItem = {
      id: 1,
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    };

    renderWithRouter(<PokemonCard pokemon={pokemonWithLowerCase} />);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('should format pokemon ID with leading zeros', () => {
    const pokemonWithSingleDigitId: PokemonListDisplayItem = {
      id: 7,
      name: 'squirtle',
      url: 'https://pokeapi.co/api/v2/pokemon/7/',
    };

    renderWithRouter(<PokemonCard pokemon={pokemonWithSingleDigitId} />);

    expect(screen.getByText('#007')).toBeInTheDocument();
  });

  it('should render as a link to pokemon detail page', () => {
    renderWithRouter(<PokemonCard pokemon={samplePokemon} />);

    const cardLink = screen.getByTestId('pokemon-25');
    expect(cardLink).toBeInTheDocument();
    expect(cardLink).toHaveAttribute('href', '/pokemon/25');
    expect(cardLink).toHaveClass('pokemon-card');
  });

  it('should handle pokemon with three-digit ID correctly', () => {
    const pokemonWithThreeDigitId: PokemonListDisplayItem = {
      id: 150,
      name: 'mewtwo',
      url: 'https://pokeapi.co/api/v2/pokemon/150/',
    };

    renderWithRouter(<PokemonCard pokemon={pokemonWithThreeDigitId} />);

    expect(screen.getByText('#150')).toBeInTheDocument();
    expect(screen.getByText('Mewtwo')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-150')).toHaveAttribute(
      'href',
      '/pokemon/150'
    );
  });

  it('should render card with proper CSS classes', () => {
    renderWithRouter(<PokemonCard pokemon={samplePokemon} />);

    const cardLink = screen.getByTestId('pokemon-25');
    expect(cardLink).toHaveClass('pokemon-card');

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('View Details →')).toBeInTheDocument();
  });
});
