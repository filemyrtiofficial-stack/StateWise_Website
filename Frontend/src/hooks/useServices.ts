/**
 * Custom hook to fetch all services from backend
 */

import { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api';
import { RTIModel } from '../types/services';

export const useServices = () => {
  const [services, setServices] = useState<RTIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await servicesAPI.getAll() as any;

        if (response.success && response.data) {
          // Convert backend services to RTIModel format
          const convertedServices = response.data.map((service: any) => ({
            id: service.id.toString(),
            name: service.name,
            slug: service.slug,
            icon: service.icon || '📋',
            iconText: service.icon_text || service.name,
            description: service.description || '',
            fullDescription: service.full_description || service.description || '',
            features: [], // Backend doesn't have features
            price: parseFloat(service.price) || 0,
            originalPrice: parseFloat(service.original_price) || 0,
            buttonText: service.button_text || 'Get Started'
          }));

          setServices(convertedServices);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, isLoading, error };
};

