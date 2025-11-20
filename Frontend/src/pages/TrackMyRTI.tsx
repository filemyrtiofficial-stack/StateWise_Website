import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';

export const TrackMyRTI: React.FC = () => {
  const [formData, setFormData] = useState({
    applicationNo: '',
    emailId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.applicationNo.trim()) {
      newErrors.applicationNo = 'Application number is required';
    }
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId.trim())) {
      newErrors.emailId = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Add API call to track RTI application
      // const result = await trackRTIAPI.track({
      //   applicationNo: formData.applicationNo.trim(),
      //   email: formData.emailId.trim().toLowerCase()
      // });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitStatus('success');
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ applicationNo: '', emailId: '' });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error: any) {
      console.error('Error tracking RTI application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = "Track Your RTI Application - FileMyRTI";
  const pageDescription = "Track the status of your RTI application using your application number and email address. Get real-time updates on your Right to Information request.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/trackmyrti";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Track Your RTI Application - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/trackmyrti"
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar />
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-grow flex items-center justify-center py-12 sm:py-16 px-4">
          <div className="w-full max-w-4xl">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12 sm:mb-16">
              Track Your RTI Application
            </h1>

            {/* Form Container */}
            <div className="bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Fields - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Application No */}
                  <div>
                    <label
                      htmlFor="applicationNo"
                      className="block text-base sm:text-lg font-medium text-primary-600 mb-3"
                    >
                      Application No
                    </label>
                    <input
                      type="text"
                      id="applicationNo"
                      name="applicationNo"
                      value={formData.applicationNo}
                      onChange={handleChange}
                      placeholder="Enter application number"
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.applicationNo
                        ? 'border-red-500'
                        : 'border-primary-600'
                        }`}
                    />
                    {errors.applicationNo && (
                      <p className="text-xs text-red-500 mt-2">{errors.applicationNo}</p>
                    )}
                  </div>

                  {/* Email Id */}
                  <div>
                    <label
                      htmlFor="emailId"
                      className="block text-base sm:text-lg font-medium text-primary-600 mb-3"
                    >
                      Email Id
                    </label>
                    <input
                      type="email"
                      id="emailId"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.emailId
                        ? 'border-red-500'
                        : 'border-primary-600'
                        }`}
                    />
                    {errors.emailId && (
                      <p className="text-xs text-red-500 mt-2">{errors.emailId}</p>
                    )}
                  </div>
                </div>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm sm:text-base text-green-700">
                      Application found! We'll display the tracking information here.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-sm sm:text-base text-red-700">
                      Unable to find application. Please check your application number and email, then try again.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-base sm:text-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

