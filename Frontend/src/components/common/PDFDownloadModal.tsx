import React, { useState, useEffect } from 'react';
import { getPDFPath } from '../../utils/pdfMapping';

interface PDFDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
}

export const PDFDownloadModal: React.FC<PDFDownloadModalProps> = ({
  isOpen,
  onClose,
  departmentName,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
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
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-13 digits)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get PDF path
      const pdfPath = getPDFPath(departmentName);

      if (!pdfPath) {
        alert('PDF not found for this department. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // Get API base URL once
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Send user information to backend for tracking (non-blocking, don't wait for it)
      fetch(`${apiBaseUrl}/api/v1/pdf/pdf-downloads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: departmentName,
          downloadedAt: new Date().toISOString(),
        }),
      }).catch((apiError) => {
        // Don't block download if tracking fails - this is expected if backend is not running
        console.warn('Failed to track download (non-critical):', apiError);
      });

      // Download the PDF - try multiple approaches
      // Extract category and filename from pdfPath (format: "delhi/category/filename.pdf")
      const pathParts = pdfPath.split('/');
      // Skip "delhi" part, category is at index 1, filename is at index 2
      const category = encodeURIComponent(pathParts[1]);
      const filename = encodeURIComponent(pathParts[2]);

      let downloadSuccess = false;
      let lastError: Error | null = null;

      // Approach 1: Try backend API (with timeout)
      try {
        const apiUrl = `${apiBaseUrl}/api/v1/pdf/${category}/${filename}`;

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        // Race between fetch and timeout
        const response = await Promise.race([
          fetch(apiUrl),
          timeoutPromise
        ]) as Response;

        if (response && response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = `${departmentName.replace(/RTI\s+Delhi\s+/gi, '').replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
          downloadSuccess = true;
        } else {
          throw new Error(`Backend returned ${response?.status || 'unknown status'}`);
        }
      } catch (backendError) {
        // Connection refused, timeout, or other network errors - try next approach
        console.log('Backend download failed (connection refused or timeout), trying public folder...', backendError);
        lastError = backendError as Error;
      }

      // Approach 2: Try public folder (if PDFs are copied there)
      if (!downloadSuccess) {
        try {
          // Try public folder path - decode the category and filename for the path
          const decodedCategory = decodeURIComponent(category);
          const decodedFilename = decodeURIComponent(filename);
          const publicPath = `/assets/PDF/delhi/${decodedCategory}/${decodedFilename}`;

          const response = await fetch(publicPath);

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${departmentName.replace(/RTI\s+Delhi\s+/gi, '').replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
            downloadSuccess = true;
            console.log('Successfully downloaded from public folder');
          } else {
            throw new Error(`Public folder returned ${response.status}`);
          }
        } catch (publicError) {
          console.log('Public folder download failed, trying direct import...', publicError);
          lastError = publicError as Error;
        }
      }

      // Approach 3: Try direct import (for development)
      if (!downloadSuccess) {
        try {
          // Use dynamic import for Vite
          const pdfModule = await import(`../../assets/PDF/${pdfPath}`);
          const pdfUrl = pdfModule.default || pdfModule;

          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `${departmentName.replace(/RTI\s+Delhi\s+/gi, '').replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          downloadSuccess = true;
        } catch (importError) {
          console.error('All download approaches failed:', importError);
          lastError = importError as Error;
        }
      }

      if (!downloadSuccess) {
        alert(
          'Failed to download PDF. Please ensure the backend server is running, or contact support.\n\n' +
          'Error: ' + (lastError?.message || 'Unknown error')
        );
        throw lastError || new Error('PDF download failed');
      }

      // Close modal after successful download
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again or contact support.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl animate-slideUp relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Download RTI Template</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
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
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Please provide your details to download the RTI template for{' '}
            <span className="font-semibold text-gray-900">{departmentName}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your phone number"
                required
                disabled={isSubmitting}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-xs text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  'Download PDF'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

