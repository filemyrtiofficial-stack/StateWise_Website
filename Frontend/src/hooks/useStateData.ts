/**
 * Custom hook for State data management
 * Fetches state data from backend API with fallback to static data
 */

import { useState, useEffect, useMemo } from 'react';
import { statesAPI } from '../services/api';
import { StateData, getStateBySlug } from '../data/states';

export const useStateData = (stateSlug: string): {
  stateData: StateData | null;
  isLoading: boolean;
  error: string | null;
} => {
  const [backendState, setBackendState] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch state from backend
  useEffect(() => {
    if (!stateSlug) {
      setIsLoading(false);
      return;
    }

    const fetchState = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await statesAPI.getBySlug(stateSlug);

        if (response.success && response.data) {
          setBackendState(response.data);
        } else {
          throw new Error('State not found');
        }
      } catch (err) {
        console.warn('Failed to fetch state from backend, using static data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load state');
        setBackendState(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();
  }, [stateSlug]);

  // Use backend state if available, otherwise fallback to static data
  const stateData = useMemo(() => {
    if (backendState) {
      // Convert backend state to StateData format
      // Note: You may need to adjust this based on your StateData interface
      const staticFallback = getStateBySlug(stateSlug);
      if (staticFallback) {
        // Merge backend data with static data structure
        return {
          ...staticFallback,
          name: backendState.name || staticFallback.name,
          slug: backendState.slug || staticFallback.slug,
          description: backendState.description || staticFallback.description,
          rtiPortalUrl: backendState.rti_portal_url || staticFallback.rtiPortalUrl
        };
      }
    }

    // Fallback to static data
    if (!stateSlug) return null;
    return getStateBySlug(stateSlug) || null;
  }, [backendState, stateSlug]);

  return {
    stateData,
    isLoading,
    error
  };
};

export const getStateSlugFromSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Check if it's a subdomain (e.g., telangana.filemyrti.com)
  if (parts.length >= 3) {
    const subdomain = parts[0].toLowerCase();
    return subdomain;
  }

  return null;
};

