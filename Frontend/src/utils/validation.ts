/**
 * Validation utility functions
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const cleaned = mobile.replace(/\D/g, '');
  const length = cleaned.length;
  return length >= 10 && length <= 13;
};

export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateFormData = (data: {
  fullName: string;
  mobile: string;
  email: string;
  rtiQuery?: string;
  address?: string;
  pincode?: string;
  acceptTerms?: boolean;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Only name, email, and mobile are mandatory
  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else {
    const cleaned = data.mobile.replace(/\D/g, '');
    const length = cleaned.length;
    if (length < 10) {
      errors.mobile = 'Mobile number must be at least 10 digits';
    } else if (length > 13) {
      errors.mobile = 'Mobile number must not exceed 13 digits';
    } else if (!validateMobile(data.mobile)) {
      errors.mobile = 'Please enter a valid mobile number (10-13 digits)';
    }
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // All other fields (rtiQuery, address, pincode, acceptTerms) are optional - no validation needed

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

