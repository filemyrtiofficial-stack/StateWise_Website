/**
 * Custom hook for consultation form management
 */

import { useState, useCallback } from 'react';
import { ConsultationFormData } from '../types/services';
import { validateFormData } from '../utils/validation';

const initialFormData: ConsultationFormData = {
  fullName: '',
  mobile: '',
  email: '',
  rtiQuery: '',
  address: '',
  pincode: '',
  acceptTerms: false
};

export const useConsultationForm = () => {
  const [formData, setFormData] = useState<ConsultationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof ConsultationFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const validation = validateFormData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const handleSubmit = useCallback(async (onSubmit: (data: ConsultationFormData) => Promise<void> | void) => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (could set a general error message)
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    resetForm,
    setFormData
  };
};

