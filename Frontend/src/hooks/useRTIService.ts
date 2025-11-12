/**
 * Custom hook for RTI service data management
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getRTIModelBySlug } from '../data/rtiModels';
import { RTIModel } from '../types/services';

export const useRTIService = (): {
  model: RTIModel | null;
  modelSlug: string | null;
  isLoading: boolean;
} => {
  const location = useLocation();

  const modelSlug = useMemo(() => {
    const pathParts = location.pathname.split('/services/');
    return pathParts.length > 1 ? pathParts[1] : null;
  }, [location.pathname]);

  const model = useMemo(() => {
    if (!modelSlug) return null;
    return getRTIModelBySlug(modelSlug);
  }, [modelSlug]);

  return {
    model,
    modelSlug,
    isLoading: false
  };
};

