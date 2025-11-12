/**
 * Custom hook to fetch all states from backend
 */

import { useState, useEffect } from 'react';
import { statesAPI } from '../services/api';

export interface State {
  id: number;
  name: string;
  slug: string;
  description?: string;
  rti_portal_url?: string;
}

export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await statesAPI.getAll() as any;

        if (response.success && response.data) {
          setStates(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch states:', err);
        setError(err instanceof Error ? err.message : 'Failed to load states');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, isLoading, error };
};

