import { LoadingSpinner } from '../../shared/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../shared/ErrorMessage/ErrorMessage';
import { PokemonCard } from './PokemonCard';
import { useInfiniteScrollPokemon } from '../../../hooks';
import './PokemonList.css';

export const PokemonList = () => {
  const {
    pokemonList,
    isLoading,
    isError,
    hasMore,
    loadMore,
    isLoadingMore,
    refetch,
    totalLoaded,
  } = useInfiniteScrollPokemon();

  if (isLoading) {
    return <LoadingSpinner message='Loading Pokemon...' />;
  }
  if (isError) {
    return (
      <ErrorMessage message='Failed to load Pokemon list' onRetry={refetch} />
    );
  }

  if (!pokemonList || pokemonList.length === 0) {
    return (
      <div className='no-pokemon'>
        <p>No Pokemon found.</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    );
  }

  return (
    <div className='pokemon-list-container'>
      <div className='list-header'>
        <h2 className='list-title'>Pokemon List</h2>
        <p className='pokemon-count'>{totalLoaded} Pokemon loaded</p>
      </div>

      <div className='pokemon-grid'>
        {pokemonList.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Load More Section */}
      {hasMore && (
        <div className='load-more-section'>
          <button
            className={`load-more-button ${isLoadingMore ? 'loading' : ''}`}
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <div className='button-spinner' />
                Loading more Pokemon...
              </>
            ) : (
              'Load More Pokemon'
            )}
          </button>
        </div>
      )}

      {!hasMore && pokemonList.length > 0 && (
        <div className='end-message'>
          <p>🎉 You've seen all available Pokemon!</p>
          <p className='end-message-subtitle'>Total: {totalLoaded} Pokemon</p>
        </div>
      )}
    </div>
  );
};
