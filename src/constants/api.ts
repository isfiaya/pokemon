// API configuration constants
export const DEFAULT_API_BASE_URL = 'https://pokeapi.co/api/v2';

// Cache configuration
export const CACHE_TIMES = {
  POKEMON_LIST: 900, // 15 minutes
  POKEMON_DETAIL: 1800, // 30 minutes
  UNUSED_DATA: 300, // 5 minutes
  REFETCH_THRESHOLD: 60, // 1 minute
} as const;

// Stat color thresholds and colors
export const STAT_COLOR_THRESHOLDS = {
  EXCELLENT: { min: 100, color: '#4caf50' }, // green
  VERY_GOOD: { min: 80, color: '#8bc34a' }, // light green
  GOOD: { min: 60, color: '#ffeb3b' }, // yellow
  AVERAGE: { min: 40, color: '#ff9800' }, // orange
  POOR: { min: 0, color: '#f44336' }, // red
} as const;
