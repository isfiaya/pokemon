import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonDetail } from './PokemonDetail';
import * as pokemonApiExports from '../../../services';
import { mockPokemonDetail } from '../../../test/mockData';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../../../test/testUtils';
import { screen, waitFor } from '@testing-library/react';
import { default as userEvent } from '@testing-library/user-event';
// Mock the services
vi.mock('../../../services', () => ({
  useGetPokemonByIdQuery: vi.fn(),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: vi.fn(),
    middleware: vi.fn(),
  },
}));

// Mock scroll functionality
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

const mockUseGetPokemonByIdQuery = vi.mocked(
  pokemonApiExports.useGetPokemonByIdQuery
);

// Custom render function for PokemonDetail with proper routing
const renderPokemonDetail = (initialRoute: string) => {
  const store = createTestStore();

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path='/pokemon/:id' element={<PokemonDetail />} />
          <Route path='/' element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('PokemonDetail Component', () => {
  const mockRefetch = vi.fn();

  const createMockQueryResult = (overrides = {}) => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isError: false,
    refetch: mockRefetch,
    isSuccess: false,
    isFetching: false,
    isUninitialized: false,
    startedTimeStamp: 0,
    fulfilledTimeStamp: 0,
    requestId: '',
    endpointName: 'getPokemonById',
    originalArgs: 1,
    currentData: undefined,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(window.scrollTo).mockClear();
  });

  describe('Route handling and ID validation', () => {
    it('should redirect to home when no ID is provided in the route', () => {
      mockUseGetPokemonByIdQuery.mockReturnValue(createMockQueryResult());

      // Use a route that matches the pattern but has no ID
      render(
        <Provider store={createTestStore()}>
          <MemoryRouter initialEntries={['/pokemon/']}>
            <Routes>
              <Route path='/pokemon/:id' element={<PokemonDetail />} />
              <Route path='/' element={<div>Home Page</div>} />
              <Route path='*' element={<div>Not Found</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Should show Not Found since /pokemon/ doesn't match any route
      expect(screen.getByText('Not Found')).toBeInTheDocument();
    });

    it.each([
      { route: '/pokemon/invalid', description: 'invalid string ID' },
      { route: '/pokemon/-1', description: 'negative ID' },
      { route: '/pokemon/0', description: 'zero ID' },
    ])('should redirect to home when $description is provided', ({ route }) => {
      mockUseGetPokemonByIdQuery.mockReturnValue(createMockQueryResult());

      renderPokemonDetail(route);

      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('should accept valid numeric IDs', () => {
      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
          originalArgs: 25,
        })
      );

      renderPokemonDetail('/pokemon/25');

      expect(mockUseGetPokemonByIdQuery).toHaveBeenCalledWith(25, {
        skip: false,
      });
    });
  });

  describe('Loading states', () => {
    it('should display loading spinner and message while fetching data', () => {
      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
        })
      );

      renderPokemonDetail('/pokemon/1');

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(
        screen.getByText('Loading Pokemon details...')
      ).toBeInTheDocument();
    });

    it('should scroll to top when component mounts', () => {
      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          isLoading: true,
        })
      );

      renderPokemonDetail('/pokemon/1');

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('Error states', () => {
    it.each([
      {
        description: 'API call fails',
        mockState: {
          isError: true,
          error: { status: 404, data: { message: 'Not Found' } },
        },
        expectedHeading: 'Failed to load Pokemon details',
      },
      {
        description: 'pokemon data is null',
        mockState: {
          data: null,
          isSuccess: true,
        },
        expectedHeading: 'Pokemon not found',
      },
    ])(
      'should display error message when $description',
      ({ mockState, expectedHeading }) => {
        mockUseGetPokemonByIdQuery.mockReturnValue(
          createMockQueryResult(mockState)
        );

        renderPokemonDetail('/pokemon/1');

        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(
          screen.getByRole('heading', { name: expectedHeading })
        ).toBeInTheDocument();
      }
    );

    it('should call refetch when retry button is clicked in error state', async () => {
      const user = userEvent.setup();
      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          isError: true,
          error: { status: 500, data: { message: 'Server Error' } },
        })
      );

      renderPokemonDetail('/pokemon/1');

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Successful data rendering', () => {
    beforeEach(() => {
      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          data: mockPokemonDetail,
          isSuccess: true,
          currentData: mockPokemonDetail,
        })
      );
    });

    it('should render pokemon basic information correctly', async () => {
      renderPokemonDetail('/pokemon/1');

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('#001')).toBeInTheDocument();
      });
    });

    it('should render pokemon types with correct styling', () => {
      renderPokemonDetail('/pokemon/1');

      const grassType = screen.getByText('Grass');
      const poisonType = screen.getByText('Poison');

      expect(grassType).toBeInTheDocument();
      expect(poisonType).toBeInTheDocument();
      expect(grassType.closest('.type-badge')).toHaveStyle(
        'background-color: #78C850'
      );
      expect(poisonType.closest('.type-badge')).toHaveStyle(
        'background-color: #A040A0'
      );
    });

    it('should render physical characteristics section', () => {
      renderPokemonDetail('/pokemon/1');

      expect(screen.getByText('Physical Characteristics')).toBeInTheDocument();
      expect(screen.getByText('0.7 m')).toBeInTheDocument(); // height: 7 / 10
      expect(screen.getByText('6.9 kg')).toBeInTheDocument(); // weight: 69 / 10
      expect(screen.getByText('64')).toBeInTheDocument(); // base experience
    });

    it('should render abilities section with hidden ability indicator', () => {
      renderPokemonDetail('/pokemon/1');

      expect(screen.getByText('Abilities')).toBeInTheDocument();
      expect(screen.getByText('Overgrow')).toBeInTheDocument();
      expect(screen.getByText('Chlorophyll')).toBeInTheDocument();
      expect(screen.getByText('Hidden')).toBeInTheDocument();
    });

    it('should render base stats section with proper formatting', () => {
      renderPokemonDetail('/pokemon/1');

      expect(screen.getByText('Base Stats')).toBeInTheDocument();
      expect(screen.getByText('HP')).toBeInTheDocument();
      expect(screen.getByText('Attack')).toBeInTheDocument();
      expect(screen.getByText('Defense')).toBeInTheDocument();
      expect(screen.getByText('Sp. Attack')).toBeInTheDocument();
      expect(screen.getByText('Sp. Defense')).toBeInTheDocument();
      expect(screen.getByText('Speed')).toBeInTheDocument();

      // Check that stat values are present (there are multiple 45s, 49s, and 65s)
      expect(screen.getAllByText('45')).toHaveLength(2); // HP and Speed
      expect(screen.getAllByText('49')).toHaveLength(2); // Attack and Defense
      expect(screen.getAllByText('65')).toHaveLength(2); // Sp. Attack and Sp. Defense
    });

    it('should calculate and display total stats', () => {
      renderPokemonDetail('/pokemon/1');

      // Total should be 45+49+49+65+65+45 = 318
      expect(screen.getByText('Total: 318')).toBeInTheDocument();
    });

    it('should render sprite gallery when sprites are available', () => {
      renderPokemonDetail('/pokemon/1');

      expect(screen.getByText('Sprites')).toBeInTheDocument();

      // Check for sprite images by alt text
      expect(screen.getByAltText('Front Default')).toBeInTheDocument();
      expect(screen.getByAltText('Back Default')).toBeInTheDocument();
      expect(screen.getByAltText('Front Shiny')).toBeInTheDocument();
      expect(screen.getByAltText('Back Shiny')).toBeInTheDocument();
    });

    it('should render navigation back link', () => {
      renderPokemonDetail('/pokemon/1');

      const backLink = screen.getByText('← Back to Pokemon List');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('should use official artwork as primary image when available', () => {
      renderPokemonDetail('/pokemon/1');

      const mainImage = screen.getByAltText('bulbasaur');
      expect(mainImage).toHaveAttribute(
        'src',
        mockPokemonDetail.sprites.other!['official-artwork']!.front_default
      );
    });
  });

  describe('Query behavior', () => {
    it('should skip query when ID is invalid', () => {
      mockUseGetPokemonByIdQuery.mockReturnValue(createMockQueryResult());

      renderPokemonDetail('/pokemon/abc');

      // Invalid ID 'abc' becomes NaN when parsed
      expect(mockUseGetPokemonByIdQuery).toHaveBeenCalledWith(NaN, {
        skip: true,
      });
    });

    it('should not skip query when ID is valid', () => {
      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          data: mockPokemonDetail,
          isSuccess: true,
        })
      );

      renderPokemonDetail('/pokemon/1');

      expect(mockUseGetPokemonByIdQuery).toHaveBeenCalledWith(1, {
        skip: false,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle pokemon with no sprites gracefully', () => {
      const pokemonWithoutSprites = {
        ...mockPokemonDetail,
        sprites: {
          ...mockPokemonDetail.sprites,
          front_default: null,
          back_default: null,
          front_shiny: null,
          back_shiny: null,
          other: {
            'official-artwork': {
              front_default: null,
              front_shiny: null,
            },
          },
        },
      };

      mockUseGetPokemonByIdQuery.mockReturnValue(
        createMockQueryResult({
          data: pokemonWithoutSprites,
          isSuccess: true,
        })
      );

      renderPokemonDetail('/pokemon/1');

      expect(screen.queryByText('Sprites')).not.toBeInTheDocument();
    });

    it.each([
      {
        description: 'single type',
        pokemonData: {
          ...mockPokemonDetail,
          types: [mockPokemonDetail.types[0]], // Only grass type
        },
        expectPresent: 'Grass',
        expectAbsent: 'Poison',
      },
      {
        description: 'no hidden abilities',
        pokemonData: {
          ...mockPokemonDetail,
          abilities: [mockPokemonDetail.abilities[0]], // Only non-hidden ability
        },
        expectPresent: 'Overgrow',
        expectAbsent: 'Hidden',
      },
    ])(
      'should handle pokemon with $description',
      ({ pokemonData, expectPresent, expectAbsent }) => {
        mockUseGetPokemonByIdQuery.mockReturnValue(
          createMockQueryResult({
            data: pokemonData,
            isSuccess: true,
          })
        );

        renderPokemonDetail('/pokemon/1');

        expect(screen.getByText(expectPresent)).toBeInTheDocument();
        expect(screen.queryByText(expectAbsent)).not.toBeInTheDocument();
      }
    );
  });
});
