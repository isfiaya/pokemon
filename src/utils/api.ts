import { DEFAULT_API_BASE_URL } from '../constants/api';

/**
 * Get the API base URL from environment variable with fallback
 */
export const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE as string | undefined;
  if (!baseUrl) {
    // Environment variable not set - using default
    return DEFAULT_API_BASE_URL;
  }
  return baseUrl;
};
