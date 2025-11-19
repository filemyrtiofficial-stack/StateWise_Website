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

// API Response type
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string; value?: any }>;
}

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> => {
  const token = getStoredToken();
  const headers = getAuthHeaders(token || undefined);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || `API Error: ${response.statusText}` };
    }

    if (!response.ok) {
      // Extract validation errors if present
      const typedData = data as APIResponse;
      const validationErrors = typedData.errors || undefined;
      const errorMessage = typedData.message || `API Error: ${response.statusText}`;
      const requestId = response.headers.get('X-Request-ID');

      // Log detailed error for debugging (only in development)
      if (import.meta.env.DEV) {
        console.error('API Error:', {
          endpoint,
          status: response.status,
          message: errorMessage,
          errors: validationErrors,
          requestId,
          response: data
        });
      }

      const error = new APIError(errorMessage, response.status, validationErrors, data);
      if (requestId) {
        (error as any).requestId = requestId;
      }
      throw error;
    }

    return data as APIResponse<T>;
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('Network error. Please check your connection and try again.', 0);
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new APIError('Request timeout. Please try again.', 408);
    }
    throw error;
  }
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
    address?: string | null;
    pincode?: string | null;
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
 * Newsletter API
 */
export const newsletterAPI = {
  // Subscribe to newsletter (Public - no auth required)
  subscribe: async (data: {
    email: string;
  }) => {
    return apiRequest(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  // Unsubscribe from newsletter (Public - no auth required)
  unsubscribe: async (data: {
    email: string;
  }) => {
    return apiRequest(API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE, {
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
    rti_query?: string | null;
    address?: string | null;
    pincode?: string | null;
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
 * Contact API
 */
export const contactAPI = {
  createPublic: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    message?: string;
  }) => {
    return apiRequest(API_ENDPOINTS.CONTACT.CREATE_PUBLIC, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

/**
 * Careers API
 */
export const careersAPI = {
  createPublic: async (data: {
    name: string;
    email: string;
    phone: string;
    position: string;
    coverLetter?: string;
    resume?: File | null;
  }) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('position', data.position);
    if (data.coverLetter) {
      formData.append('coverLetter', data.coverLetter);
    }
    if (data.resume) {
      formData.append('resume', data.resume);
    }

    // Use fetch directly for FormData (don't use apiRequest which expects JSON)
    const response = await fetch(API_ENDPOINTS.CAREERS.CREATE_PUBLIC, {
      method: 'POST',
      body: formData
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Failed to submit application' };
      }
      throw new Error(errorData.message || errorData.error || 'Failed to submit application');
    }

    const result = await response.json();
    return result;
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
    rti_query: formData.rtiQuery || '', // Optional - send empty string if not provided
    address: formData.address || null,
    pincode: formData.pincode || null
  };
};

