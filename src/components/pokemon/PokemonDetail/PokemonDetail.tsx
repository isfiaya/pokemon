import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGetPokemonByIdQuery } from '../../../services';
import { LoadingSpinner } from '../../shared/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../shared/ErrorMessage/ErrorMessage';
import { LazyImage } from '../../shared/LazyImage';
import { formatStatName, getStatColor, getTypeColor } from '../../../utils';
import './PokemonDetail.css';

export const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Convert ID to number for the query, but handle invalid cases
  const pokemonId = id ? parseInt(id, 10) : 0;
  const isValidId = !isNaN(pokemonId) && pokemonId > 0;

  const {
    data: pokemon,
    isLoading,
    isError,
    refetch,
  } = useGetPokemonByIdQuery(pokemonId, {
    skip: !isValidId,
  });

  // Handle invalid ID cases after hooks
  if (!id || !isValidId) {
    return <Navigate to='/' replace />;
  }

  if (isLoading) {
    return <LoadingSpinner message='Loading Pokemon details...' />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message='Failed to load Pokemon details'
        onRetry={() => void refetch()}
      />
    );
  }

  if (!pokemon) {
    return (
      <ErrorMessage
        message='Pokemon not found'
        onRetry={() => void refetch()}
      />
    );
  }

  const primarySprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default;

  const sprites = [
    { src: pokemon.sprites.front_default, alt: 'Front Default' },
    { src: pokemon.sprites.back_default, alt: 'Back Default' },
    { src: pokemon.sprites.front_shiny, alt: 'Front Shiny' },
    { src: pokemon.sprites.back_shiny, alt: 'Back Shiny' },
  ].filter(sprite => sprite.src);

  const characteristics = [
    { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)} m` },
    { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
    { label: 'Base Experience', value: pokemon.base_experience },
  ];

  const totalStats = pokemon.stats.reduce(
    (sum, stat) => sum + stat.base_stat,
    0
  );

  return (
    <div className='pokemon-detail-container'>
      <div className='navigation-header'>
        <Link to='/' className='back-link'>
          ← Back to Pokemon List
        </Link>
      </div>

      <div className='pokemon-detail-card'>
        <div className='pokemon-header'>
          <div className='pokemon-image-container'>
            <LazyImage
              src={primarySprite ?? ''}
              alt={pokemon.name ?? 'Pokemon'}
              className='pokemon-image'
            />
          </div>
          <div className='pokemon-basic-info'>
            <h1 className='pokemon-name'>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>
            <p className='pokemon-id'>
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
            <div className='pokemon-types'>
              {pokemon.types.map(type => (
                <span
                  key={type.type.name}
                  className='type-badge'
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {type.type.name.charAt(0).toUpperCase() +
                    type.type.name.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='pokemon-details-grid'>
          <div className='detail-section'>
            <h3>Physical Characteristics</h3>
            <div className='characteristic-grid'>
              {characteristics.map((characteristic, index) => (
                <div key={index} className='characteristic-item'>
                  <span className='characteristic-label'>
                    {characteristic.label}
                  </span>
                  <span className='characteristic-value'>
                    {characteristic.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='detail-section'>
            <h3>Abilities</h3>
            <div className='abilities-list'>
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className='ability-item'>
                  <span className='ability-name'>
                    {ability.ability.name.charAt(0).toUpperCase() +
                      ability.ability.name.slice(1).replace('-', ' ')}
                  </span>
                  {ability.is_hidden && (
                    <span className='hidden-ability-badge'>Hidden</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='detail-section stats-section'>
            <h3>Base Stats</h3>
            <div className='stats-container'>
              {pokemon.stats.map(stat => (
                <div key={stat.stat.name} className='stat-item'>
                  <div className='stat-header'>
                    <span className='stat-name'>
                      {formatStatName(stat.stat.name)}
                    </span>
                    <span className='stat-value'>{stat.base_stat}</span>
                  </div>
                  <div className='stat-bar-container'>
                    <div
                      className='stat-bar'
                      style={{
                        width: `${Math.min(stat.base_stat / 2, 100)}%`,
                        backgroundColor: getStatColor(stat.base_stat),
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className='total-stats'>
                <strong>Total: {totalStats}</strong>
              </div>
            </div>
          </div>
        </div>

        {sprites.length > 0 && (
          <div className='sprite-gallery'>
            <h3>Sprites</h3>
            <div className='sprites-container'>
              {sprites.map((sprite, index) => (
                <LazyImage
                  key={index}
                  src={sprite.src!}
                  alt={sprite.alt}
                  className='sprite-image'
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
