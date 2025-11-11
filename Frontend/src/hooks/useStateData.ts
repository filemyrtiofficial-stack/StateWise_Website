import { useMemo } from 'react';
import { StateData, getStateBySlug } from '../data/states';

export const useStateData = (stateSlug: string): StateData | null => {
  // Use useMemo to get state data synchronously, avoiding the null initial state issue
  const stateData = useMemo(() => {
    if (!stateSlug) return null;
    return getStateBySlug(stateSlug) || null;
  }, [stateSlug]);

  return stateData;
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

