/**
 * API Service
 * Centralized API call functions
 */

import { API_ENDPOINTS, getAuthHeaders, getStoredToken } from '../config/api';
import { ConsultationFormData } from '../types/services';

/**
 * Generic API request handler
 */
/**
 * Custom error class for API errors with validation details
 */
export class APIError extends Error {
  public statusCode: number;
  public errors?: Array<{ field: string; message: string; value?: any }>;
  public response?: any;

  constructor(
    message: string,
    statusCode: number,
    errors?: Array<{ field: string; message: string; value?: any }>,
    response?: any
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.response = response;
  }
}

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getStoredToken();
  const headers = getAuthHeaders(token);

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract validation errors if present
    const validationErrors = data.errors || null;
    const errorMessage = data.message || `API Error: ${response.statusText}`;

    // Log detailed error for debugging
    console.error('API Error:', {
      endpoint,
      status: response.status,
      message: errorMessage,
      errors: validationErrors,
      response: data
    });

    throw new APIError(errorMessage, response.status, validationErrors, data);
  }

  return data;
};

/**
 * Authentication API
 */
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getProfile: async () => {
    return apiRequest(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET'
    });
  }
};

/**
 * Services API
 */
export const servicesAPI = {
  getAll: async () => {
    return apiRequest(API_ENDPOINTS.SERVICES.LIST, {
      method: 'GET'
    });
  },

  getBySlug: async (slug: string) => {
    return apiRequest(API_ENDPOINTS.SERVICES.BY_SLUG(slug), {
      method: 'GET'
    });
  }
};

/**
 * States API
 */
export const statesAPI = {
  getAll: async () => {
    return apiRequest(API_ENDPOINTS.STATES.LIST, {
      method: 'GET'
    });
  },

  getBySlug: async (slug: string) => {
    return apiRequest(API_ENDPOINTS.STATES.BY_SLUG(slug), {
      method: 'GET'
    });
  }
};

/**
 * Consultations API
 */
export const consultationsAPI = {
  // Public submission (no auth required)
  createPublic: async (data: {
    full_name: string;
    email: string;
    mobile: string;
    address: string;
    pincode: string;
    state_slug?: string;
    source?: string;
  }) => {
    return apiRequest(API_ENDPOINTS.CONSULTATIONS.CREATE_PUBLIC, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

/**
 * Callback Requests API
 */
export const callbackRequestsAPI = {
  // Public submission (no auth required)
  createPublic: async (data: {
    phone: string;
    state_slug?: string;
  }) => {
    return apiRequest(API_ENDPOINTS.CALLBACK_REQUESTS.CREATE_PUBLIC, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

/**
 * RTI Applications API
 */
export const rtiApplicationsAPI = {
  // Public submission (no auth required)
  createPublic: async (applicationData: {
    service_id: number;
    state_id: number;
    full_name: string;
    mobile: string;
    email: string;
    rti_query: string;
    address: string;
    pincode: string;
    payment_id?: string;
    order_id?: string;
  }) => {
    return apiRequest(`${API_ENDPOINTS.RTI_APPLICATIONS.CREATE}/public`, {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  // Authenticated submission
  create: async (applicationData: {
    service_id: number;
    state_id: number;
    full_name: string;
    mobile: string;
    email: string;
    rti_query: string;
    address: string;
    pincode: string;
  }) => {
    return apiRequest(API_ENDPOINTS.RTI_APPLICATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  getMyApplications: async (page = 1, limit = 10) => {
    return apiRequest(
      `${API_ENDPOINTS.RTI_APPLICATIONS.MY_APPLICATIONS}?page=${page}&limit=${limit}`,
      { method: 'GET' }
    );
  },

  getById: async (id: number) => {
    return apiRequest(API_ENDPOINTS.RTI_APPLICATIONS.BY_ID(id), {
      method: 'GET'
    });
  }
};

/**
 * Payments API
 */
export const paymentsAPI = {
  // Create payment order
  createOrder: async (orderData: {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
  }) => {
    return apiRequest(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify({
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        receipt: orderData.receipt,
        notes: orderData.notes
      })
    });
  },

  // Verify payment
  verifyPayment: async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    order_id: string;
  }) => {
    return apiRequest(API_ENDPOINTS.PAYMENTS.VERIFY_PAYMENT, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  // Get order status
  getOrderStatus: async (orderId: string) => {
    return apiRequest(API_ENDPOINTS.PAYMENTS.GET_ORDER_STATUS(orderId), {
      method: 'GET'
    });
  }
};

/**
 * Health Check API
 */
export const healthAPI = {
  check: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH);
      return await response.json();
    } catch (error) {
      throw new Error('Backend server is not reachable');
    }
  }
};

/**
 * Convert consultation form data to API format
 */
export const convertConsultationFormToAPI = (
  formData: ConsultationFormData,
  serviceId: number,
  stateId: number
) => {
  return {
    service_id: serviceId,
    state_id: stateId,
    full_name: formData.fullName,
    mobile: formData.mobile,
    email: formData.email,
    rti_query: formData.rtiQuery,
    address: formData.address,
    pincode: formData.pincode
  };
};

