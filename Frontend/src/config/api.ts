/**
 * API Configuration
 * Centralized API endpoint configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`
  },

  // Services
  SERVICES: {
    LIST: `${API_BASE_URL}/services`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/services/${slug}`,
    BY_ID: (id: number) => `${API_BASE_URL}/services/${id}`
  },

  // States
  STATES: {
    LIST: `${API_BASE_URL}/states`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/states/${slug}`,
    BY_ID: (id: number) => `${API_BASE_URL}/states/${id}`
  },

  // RTI Applications
  RTI_APPLICATIONS: {
    CREATE: `${API_BASE_URL}/rti-applications`,
    LIST: `${API_BASE_URL}/rti-applications`,
    MY_APPLICATIONS: `${API_BASE_URL}/rti-applications/my-applications`,
    BY_ID: (id: number) => `${API_BASE_URL}/rti-applications/${id}`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/rti-applications/${id}/status`
  },

  // Consultations
  CONSULTATIONS: {
    CREATE_PUBLIC: `${API_BASE_URL}/consultations/public`,
    LIST: `${API_BASE_URL}/consultations`,
    BY_ID: (id: number) => `${API_BASE_URL}/consultations/${id}`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/consultations/${id}/status`
  },

  // Callback Requests
  CALLBACK_REQUESTS: {
    CREATE_PUBLIC: `${API_BASE_URL}/callback-requests/public`,
    LIST: `${API_BASE_URL}/callback-requests`,
    BY_ID: (id: number) => `${API_BASE_URL}/callback-requests/${id}`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/callback-requests/${id}/status`
  },

  // Payments
  PAYMENTS: {
    CREATE_ORDER: `${API_BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify`,
    GET_ORDER_STATUS: (orderId: string) => `${API_BASE_URL}/payments/order/${orderId}`
  },

  // Health Check
  HEALTH: 'http://localhost:5000/health'
};

/**
 * Get authorization header with token
 */
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Get stored auth token from localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Store auth token in localStorage
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove auth token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

export default API_BASE_URL;

