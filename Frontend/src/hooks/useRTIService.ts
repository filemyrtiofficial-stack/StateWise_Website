/**
 * Custom hook for RTI service data management
 * Fetches service data from backend API
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { RTIModel } from '../types/services';
import { getRTIModelBySlug } from '../data/rtiModels'; // Fallback to static data

export const useRTIService = (): {
  model: RTIModel | null;
  modelSlug: string | null;
  isLoading: boolean;
  error: string | null;
} => {
  const location = useLocation();
  const [backendModel, setBackendModel] = useState<RTIModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modelSlug = useMemo(() => {
    const pathParts = location.pathname.split('/services/');
    return pathParts.length > 1 ? pathParts[1] : null;
  }, [location.pathname]);

  // Fetch service from backend
  useEffect(() => {
    if (!modelSlug) {
      setIsLoading(false);
      return;
    }

    const fetchService = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await servicesAPI.getBySlug(modelSlug) as any;

        if (response.success && response.data) {
          // Convert backend service to RTIModel format
          const backendData = response.data;

          // Get features from static data as fallback (backend doesn't store features)
          const staticModel = getRTIModelBySlug(modelSlug);

          const convertedModel: RTIModel = {
            id: backendData.id.toString(),
            name: backendData.name,
            icon: backendData.icon || staticModel?.icon || '📋',
            iconText: backendData.icon_text || backendData.name,
            description: backendData.description || staticModel?.description || '',
            fullDescription: backendData.full_description || backendData.description || staticModel?.fullDescription || '',
            features: staticModel?.features || [], // Use static features as backend doesn't have this
            price: parseFloat(backendData.price) || staticModel?.price || 0,
            originalPrice: parseFloat(backendData.original_price) || staticModel?.originalPrice || 0,
            buttonText: backendData.button_text || staticModel?.buttonText || 'Get Started'
          };

          setBackendModel(convertedModel);
        } else {
          throw new Error('Service not found');
        }
      } catch (err) {
        console.warn('Failed to fetch service from backend, using static data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service');
        // Fallback to static data
        setBackendModel(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [modelSlug]);

  // Use backend model if available, otherwise fallback to static data
  const model = useMemo(() => {
    if (backendModel) return backendModel;
    if (!modelSlug) return null;
    // Fallback to static data
    const staticModel = getRTIModelBySlug(modelSlug);
    return staticModel;
  }, [backendModel, modelSlug]);

  return {
    model,
    modelSlug,
    isLoading,
    error
  };
};

