import {
  POKEMON_STAT_NAMES,
  POKEMON_TYPE_COLORS,
  DEFAULT_TYPE_COLOR,
} from '../constants/pokemon';
import { STAT_COLOR_THRESHOLDS } from '../constants/api';

/**
 * Extract Pokemon ID from PokeAPI URL
 * @param url - The Pokemon URL from the API
 * @returns The Pokemon ID as a number
 */
export const extractPokemonId = (url: string): number => {
  const matches = /\/pokemon\/(\d+)\//.exec(url);
  return matches ? parseInt(matches[1], 10) : 0;
};

/**
 * Format stat names for display
 * @param statName - The raw stat name from the API
 * @returns The formatted stat name for display
 */
export const formatStatName = (statName: string): string => {
  return (
    POKEMON_STAT_NAMES[statName] ||
    statName.charAt(0).toUpperCase() + statName.slice(1)
  );
};

/**
 * Get color for a stat value based on its strength
 * @param statValue - The stat value
 * @returns The color hex code for the stat
 */
export const getStatColor = (statValue: number): string => {
  const thresholds = Object.values(STAT_COLOR_THRESHOLDS);

  for (const threshold of thresholds) {
    if (statValue >= threshold.min) {
      return threshold.color;
    }
  }

  return STAT_COLOR_THRESHOLDS.POOR.color;
};

/**
 * Get color for a Pokemon type
 * @param type - The Pokemon type
 * @returns The color hex code for the type
 */
export const getTypeColor = (type: string): string => {
  return POKEMON_TYPE_COLORS[type] || DEFAULT_TYPE_COLOR;
};
