import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';
import { contactAPI } from '../services/api';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else {
      const cleaned = formData.mobile.replace(/\D/g, '');
      const length = cleaned.length;
      if (length < 10) {
        newErrors.mobile = 'Mobile number must be at least 10 digits';
      } else if (length > 13) {
        newErrors.mobile = 'Mobile number must not exceed 13 digits';
      }
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Filter out empty error messages
    const filteredErrors: Record<string, string> = {};
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key]) {
        filteredErrors[key] = newErrors[key];
      }
    });

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Clean mobile number (remove non-digits)
      const cleanMobile = formData.mobile.replace(/\D/g, '');

      // Prepare data for contact API
      const contactData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: cleanMobile,
        message: formData.message.trim() || undefined
      };

      const result = await contactAPI.createPublic(contactData);

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          mobile: '',
          email: '',
          message: ''
        });

        // Reset success message after 8 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 8000);
      } else {
        setSubmitStatus('error');
        // Show error message for 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');

      // Show error message for 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

      // Show specific error message if available
      if (error.errors && error.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: { field: string; message: string }) => {
          // Map backend field names to frontend field names
          if (err.field === 'firstName') {
            fieldErrors.firstName = err.message;
          } else if (err.field === 'lastName') {
            fieldErrors.lastName = err.message;
          } else if (err.field === 'mobile') {
            fieldErrors.mobile = err.message;
          } else if (err.field === 'email') {
            fieldErrors.email = err.message;
          }
        });
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = "Contact Us - FileMyRTI | Get in Touch";
  const pageDescription = "Contact FileMyRTI for any queries about RTI filing services. Reach out via phone, email, or fill out our contact form. We're here to help you with your RTI needs.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/contact";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "FileMyRTI",
      "email": "Admin@filemyrti.com",
      "telephone": "91-99111-00589",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Flat No. 202, Radhakrishna Residency, Kalyannagar Phase 3",
        "addressLocality": "Hyderabad",
        "postalCode": "500045",
        "addressCountry": "IN"
      }
    }
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

      <div className="min-h-screen flex flex-col">
        <main className="flex-grow bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 md:py-16 lg:py-20">
            <div className="container-responsive max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                Contact Us
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
                Have questions about RTI filing? We're here to help. Reach out to us through any of the channels below.
              </p>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12 md:py-16 lg:py-20">
            <div className="container-responsive max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column - Map */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.1234567890123!2d78.4744!3d17.4484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99dac93e348d%3A0xcdeccf099cffb2f!2sKalyannagar%20Phase%203%2C%20Hyderabad%2C%20Telangana%20500045!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="FileMyRTI Office Location"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4 sm:p-6 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Our Office</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Flat No. 202, Radhakrishna Residency,<br />
                      Kalyannagar Phase 3,<br />
                      Hyderabad - 500045, Telangana, India
                    </p>
                  </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.mobile && (
                        <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                      />
                    </div>

                    {/* Success/Error Messages */}
                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg animate-fadeIn">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-green-800 mb-1">
                              Message Sent Successfully!
                            </p>
                            <p className="text-sm text-green-700">
                              Thank you for contacting us! We've received your message and will get back to you as soon as possible via email or phone.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg animate-fadeIn">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-red-800 mb-1">
                              Failed to Send Message
                            </p>
                            <p className="text-sm text-red-700">
                              Something went wrong while sending your message. Please check your internet connection and try again, or contact us directly at <a href="mailto:admin@filemyrti.com" className="underline font-semibold">admin@filemyrti.com</a> or call <a href="tel:+919911100589" className="underline font-semibold">91 99111 00589</a>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information & Social Media */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Other Ways to Reach Us
                  </h3>

                  {/* Contact Details */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Phone</p>
                        <a href="tel:+919911100589" className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          91 99111 00589
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Email</p>
                        <a href="mailto:Admin@filemyrti.com" className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          Admin@filemyrti.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href="https://www.linkedin.com/company/105639903/admin/dashboard/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>

                    <a
                      href="https://www.facebook.com/profile.php?id=61572512135057"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>

                    <a
                      href="https://x.com/FileMyRTI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-black rounded-full flex items-center justify-center transition-colors group"
                      aria-label="X (Twitter)"
                    >
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>

                    <a
                      href="https://www.instagram.com/filemyrtiofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors group"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>

                    <a
                      href="https://www.youtube.com/@FileMyRTI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors group"
                      aria-label="YouTube"
                    >
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

