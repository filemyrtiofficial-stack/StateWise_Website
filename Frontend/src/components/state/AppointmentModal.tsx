/**
 * Appointment Modal Component
 * Simple popup form for booking appointments
 */

import React, { useState, FormEvent } from 'react';
import { consultationsAPI } from '../../services/api';
import { validateEmail, validateMobile } from '../../utils/validation';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateSlug?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  stateSlug
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rtiQuery: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleClose = () => {
    if (status !== 'submitting') {
      setFormData({ name: '', email: '', phone: '', rtiQuery: '' });
      setErrors({});
      setErrorMessage('');
      setStatus('idle');
      onClose();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');

    // Validate form - only name, email, and phone are mandatory
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleaned = formData.phone.replace(/\D/g, '');
      const length = cleaned.length;
      if (length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      } else if (length > 13) {
        newErrors.phone = 'Phone number must not exceed 13 digits';
      } else if (!validateMobile(formData.phone)) {
        newErrors.phone = 'Please enter a valid mobile number (10-13 digits)';
      }
    }

    // RTI Query is optional, no validation needed

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('submitting');

    try {
      // Clean phone number (remove non-digits)
      const cleanMobile = formData.phone.replace(/\D/g, '');

      // Prepare payload
      const payload = {
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: cleanMobile,
        address: formData.rtiQuery.trim() || '', // Use RTI query as address, optional - send empty string instead of null
        pincode: '', // Optional - send empty string instead of null
        state_slug: stateSlug || undefined,
        source: 'appointment_modal'
      };

      // Log payload before submission for debugging
      console.log('📤 Submitting appointment form:', {
        full_name: payload.full_name,
        email: payload.email,
        mobile: payload.mobile,
        address: payload.address || '(empty)',
        pincode: payload.pincode || '(empty)',
        state_slug: payload.state_slug || '(none)',
        source: payload.source
      });

      // Submit to backend
      const result = await consultationsAPI.createPublic(payload);

      if (result && typeof result === 'object' && 'success' in result && result.success) {
        setStatus('success');
        // Auto-close after 2 seconds
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', rtiQuery: '' });
          setStatus('idle');
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to submit appointment');
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Failed to submit appointment:', error);
      }
      setStatus('error');
      let errorMsg = 'Failed to submit appointment. Please try again.';
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-3 sm:p-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={status === 'submitting'}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 id="appointment-modal-title" className="text-xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h2>
            <p className="text-xs text-gray-600 mb-2">
              Thank you! We'll contact you shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Title */}
            <h2 id="appointment-modal-title" className="text-lg font-bold text-gray-900 mb-2 pr-8">
              Book Appointment
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                  disabled={status === 'submitting'}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                  disabled={status === 'submitting'}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                  disabled={status === 'submitting'}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* RTI Query (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  RTI Query
                </label>
                <textarea
                  name="rtiQuery"
                  value={formData.rtiQuery}
                  onChange={handleInputChange}
                  rows={2}
                  className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${errors.rtiQuery ? 'border-red-500' : 'border-gray-300'
                    }`}
                  disabled={status === 'submitting'}
                  aria-invalid={!!errors.rtiQuery}
                />
                {errors.rtiQuery && (
                  <p className="mt-1 text-xs text-red-500">{errors.rtiQuery}</p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-800">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

