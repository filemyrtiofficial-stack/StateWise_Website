/**
 * Validation utility functions
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\D/g, ''));
};

export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateFormData = (data: {
  fullName: string;
  mobile: string;
  email: string;
  rtiQuery: string;
  address: string;
  pincode: string;
  acceptTerms: boolean;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!validateMobile(data.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.rtiQuery.trim()) {
    errors.rtiQuery = 'RTI query is required';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!data.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!validatePincode(data.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit pincode';
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

