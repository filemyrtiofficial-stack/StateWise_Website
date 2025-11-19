/**
 * Consultation Modal Component
 * Handles RTI consultation form submission
 */

import React from 'react';
import { RTIModel } from '../../types/services';
import { ConsultationFormData } from '../../types/services';
import { PAYMENT_CONFIG } from '../../constants/services';
import { PaymentStatus } from '../../hooks/usePayment';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: RTIModel;
  formData: ConsultationFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  paymentStatus?: PaymentStatus;
  paymentError?: string | null;
  onFieldChange: (field: keyof ConsultationFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = React.memo(({
  isOpen,
  onClose,
  model,
  formData,
  errors,
  isSubmitting,
  paymentStatus = 'idle',
  paymentError = null,
  onFieldChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-3 sm:p-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 id="modal-title" className="text-lg font-bold text-gray-900 mb-2">
          Book Your Consultation
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="space-y-2 mb-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => onFieldChange('fullName', e.target.value)}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-xs text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Mobile and Email in Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => onFieldChange('mobile', e.target.value)}
                  className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                  aria-invalid={!!errors.mobile}
                />
                {errors.mobile && (
                  <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                  className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* RTI Query - Optional */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                RTI Query / Information Request
              </label>
              <textarea
                value={formData.rtiQuery || ''}
                onChange={(e) => onFieldChange('rtiQuery', e.target.value)}
                rows={2}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${errors.rtiQuery ? 'border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={!!errors.rtiQuery}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.rtiQuery && (
                  <p className="text-xs text-red-500">{errors.rtiQuery}</p>
                )}
                <p className="text-xs text-gray-400">
                  {(formData.rtiQuery || '').length}/5000
                </p>
              </div>
            </div>

            {/* Address - Optional */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Address
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
                rows={1}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={!!errors.address}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.address && (
                  <p className="text-xs text-red-500">{errors.address}</p>
                )}
                <p className="text-xs text-gray-400">
                  {(formData.address || '').length}/500
                </p>
              </div>
            </div>

            {/* Pin Code - Optional */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Pin Code
              </label>
              <input
                type="text"
                value={formData.pincode || ''}
                onChange={(e) => onFieldChange('pincode', e.target.value)}
                maxLength={6}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={!!errors.pincode}
              />
              {errors.pincode && (
                <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
              )}
            </div>

            {/* Terms and Conditions - Optional */}
            <div className="flex items-start gap-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms || false}
                onChange={(e) => onFieldChange('acceptTerms', e.target.checked)}
                className="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                aria-invalid={!!errors.acceptTerms}
              />
              <label htmlFor="acceptTerms" className="text-xs text-gray-700 cursor-pointer leading-tight">
                I agree to the{' '}
                <a href="/terms-and-conditions" className="text-primary-600 hover:text-primary-700 underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">
                  Privacy Policy
                </a>.
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-500">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Payment Error Display */}
          {paymentError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{paymentError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors mb-2 text-xs disabled:cursor-not-allowed"
          >
            {paymentStatus === 'creating_order' && 'Creating payment order...'}
            {paymentStatus === 'processing' && 'Processing payment...'}
            {paymentStatus === 'verifying' && 'Verifying payment...'}
            {paymentStatus === 'idle' && !isSubmitting && (
              (model.price === 0 || model.price === null || model.price === undefined)
                ? 'Submit Request'
                : `Pay & Book Consultation - ₹${model.price.toLocaleString()}`
            )}
            {paymentStatus === 'success' && 'Payment Successful!'}
            {paymentStatus === 'failed' && 'Payment Failed - Try Again'}
          </button>

          {/* Payment Logos - Only show for paid services */}
          {(model.price !== 0 && model.price !== null && model.price !== undefined) && (
            <div className="flex items-center justify-center mt-2">
              <img
                src={PAYMENT_CONFIG.razorpayLogoUrl}
                alt="Secure Payment Partners - Razorpay, VISA, Paytm, MasterCard - FileMyRTI accepts all major payment methods for RTI filing"
                loading="lazy"
                width="600"
                height="100"
                className="h-14 w-auto max-w-full payment-logos-image"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
});

ConsultationModal.displayName = 'ConsultationModal';

