import { Link } from 'react-router-dom';
import type { PokemonListDisplayItem } from '../../../types';
import { LazyImage } from '../../shared/LazyImage';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: PokemonListDisplayItem;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  // SVG image source
  const getImageUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className='pokemon-card'
      data-testid={`pokemon-${pokemon.id}`}
    >
      <div className='pokemon-card-header'>
        <span className='pokemon-id'>
          #{pokemon.id.toString().padStart(3, '0')}
        </span>
      </div>

      <div className='pokemon-card-image-container'>
        <LazyImage
          src={getImageUrl(pokemon.id)}
          alt={formatPokemonName(pokemon.name)}
          className='pokemon-card-image-wrapper'
        />
      </div>

      <div className='pokemon-card-body'>
        <h3 className='pokemon-name'>{formatPokemonName(pokemon.name)}</h3>
      </div>

      <div className='pokemon-card-footer'>
        <span className='view-details'>View Details →</span>
      </div>
    </Link>
  );
};
