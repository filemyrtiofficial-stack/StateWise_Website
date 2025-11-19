import React, { memo } from 'react';

interface RTIDostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDraft: () => void;
}

export const RTIDostModal: React.FC<RTIDostModalProps> = memo(({ isOpen, onClose, onDraft }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rti-dost-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2
          id="rti-dost-modal-title"
          className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4"
        >
          RTI Dost
        </h2>

        {/* Why Choose RTI Dost Section */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-2">Why Choose RTI Dost</h3>
          <ul className="space-y-2">
            <li>
              <div>
                <span className="font-semibold text-gray-900">Instant Drafts:</span>
                <span className="text-gray-700"> Get your RTI application in seconds — no forms, no hassle.</span>
              </div>
            </li>
            <li>
              <div>
                <span className="font-semibold text-gray-900">Free & Simple:</span>
                <span className="text-gray-700"> Draft and download for free; pay only if we file it for you.</span>
              </div>
            </li>
            <li>
              <div>
                <span className="font-semibold text-gray-900">Any Language:</span>
                <span className="text-gray-700"> Type in English, Hindi, or Hinglish — we understand all.</span>
              </div>
            </li>
            <li>
              <div>
                <span className="font-semibold text-gray-900">All Use Cases:</span>
                <span className="text-gray-700"> From PF and passport delays to local issues — RTI Dost covers everything.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Note Section */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4">
          <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Note</h3>
          <div className="text-xs text-gray-700 space-y-1.5">
            <p>RTI Dost prepares your RTI draft automatically.</p>
            <p>Filing must be done by you on the official government RTI websites — they're simple and OTP-based.</p>
            <p>
              If you need help filing, our support team is just a call away at{' '}
              <a href="tel:+919911100589" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                91 99111 00589
              </a>
              {' '}or{' '}
              <button
                onClick={onDraft}
                className="text-primary-600 hover:text-primary-700 underline font-semibold"
              >
                Apply Now
              </button>
              {' '}for assistance.
            </p>
          </div>
        </div>

        {/* Draft With RTI Dost Button */}
        <button
          onClick={onDraft}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-sm"
        >
          Draft With RTI Dost
        </button>

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
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.4s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
});

RTIDostModal.displayName = 'RTIDostModal';

