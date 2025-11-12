/**
 * API Connection Test Utility
 * Test if frontend can connect to backend
 */

import { healthAPI } from '../services/api';
import { API_ENDPOINTS } from '../config/api';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    endpoint: string;
    status?: number;
    error?: string;
  };
}

/**
 * Test backend connection
 */
export const testBackendConnection = async (): Promise<ConnectionTestResult> => {
  try {
    if (import.meta.env.DEV) {
      console.log('🧪 Testing backend connection...');
      console.log(`📍 Endpoint: ${API_ENDPOINTS.HEALTH}`);
    }

    await healthAPI.check();

    return {
      success: true,
      message: 'Backend connection successful!',
      details: {
        endpoint: API_ENDPOINTS.HEALTH,
        status: 200
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      success: false,
      message: 'Backend connection failed',
      details: {
        endpoint: API_ENDPOINTS.HEALTH,
        error: errorMessage
      }
    };
  }
};

/**
 * Test CORS configuration
 */
export const testCORS = async (): Promise<ConnectionTestResult> => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return {
        success: true,
        message: 'CORS is properly configured',
        details: {
          endpoint: API_ENDPOINTS.HEALTH,
          status: response.status
        }
      };
    } else {
      return {
        success: false,
        message: `CORS test failed with status ${response.status}`,
        details: {
          endpoint: API_ENDPOINTS.HEALTH,
          status: response.status
        }
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      success: false,
      message: 'CORS test failed',
      details: {
        endpoint: API_ENDPOINTS.HEALTH,
        error: errorMessage
      }
    };
  }
};

