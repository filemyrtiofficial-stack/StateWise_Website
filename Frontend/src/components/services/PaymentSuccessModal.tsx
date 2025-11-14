/**
 * Payment Success Modal Component
 * Beautiful thank you modal shown after successful payment and application submission
 */

import React from 'react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | number;
  paymentId: string;
  serviceName?: string;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  paymentId,
  serviceName
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scaleIn">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Title */}
        <h2
          id="success-modal-title"
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2"
        >
          Thank You! 🎉
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">
          Your payment was successful and your RTI application has been submitted.
        </p>

        {/* Details Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Application ID:</span>
              <span className="text-sm font-bold text-gray-900 font-mono">
                #{applicationId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Payment ID:</span>
              <span className="text-sm font-bold text-gray-900 font-mono truncate ml-2">
                {paymentId.substring(0, 20)}...
              </span>
            </div>
            {serviceName && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Service:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {serviceName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Done
          </button>
          <button
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
              const details = `Application ID: ${applicationId}\nPayment ID: ${paymentId}${serviceName ? `\nService: ${serviceName}` : ''}\n\nThank you for using FileMyRTI!`;
              try {
                await navigator.clipboard.writeText(details);
                // Show temporary feedback
                const button = e.currentTarget;
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('bg-green-50', 'border-green-400', 'text-green-700');
                setTimeout(() => {
                  button.textContent = originalText;
                  button.classList.remove('bg-green-50', 'border-green-400', 'text-green-700');
                }, 2000);
              } catch (err) {
                // Fallback: show details in alert
                alert(details);
              }
            }}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Copy Details
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

