import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { LazyChatbot } from '../common/LazyChatbot';

interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  benefits: string[];
  processSteps: Array<{ step: number; title: string; description: string }>;
  icon: string;
  seoTitle: string;
  seoDescription: string;
}

const ServicePageTemplate: React.FC<ServicePageProps> = ({
  title,
  subtitle,
  description,
  features,
  benefits,
  processSteps,
  icon,
  seoTitle,
  seoDescription,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: title,
    department: '',
    state: '',
    pincode: '',
    query: '',
    urgency: 'normal',
    preferredLanguage: 'english',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.query.trim()) newErrors.query = 'Query is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_BASE_URL}/rti/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pincode: formData.pincode,
          service: formData.service,
          department: formData.department,
          state: formData.state,
          query: formData.query,
          urgency: formData.urgency,
          preferredLanguage: formData.preferredLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: title,
        department: '',
        state: '',
        pincode: '',
        query: '',
        urgency: 'normal',
        preferredLanguage: 'english',
      });

      setTimeout(() => setIsSubmitted(false), 5000);

      // Store application ID for reference
      if (result.applicationId) {
        console.log('Application ID:', result.applicationId);
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-600 text-white py-16 md:py-24">
            <div className="container-responsive max-w-7xl mx-auto    ">
              <div className="text-center max-w-4xl mx-auto">
                <div className="text-6xl mb-6">{icon}</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
                <p className="text-xl md:text-2xl text-primary-100 mb-8">{subtitle}</p>
                <p className="text-lg text-primary-200 leading-relaxed">{description}</p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container-responsive max-w-7xl mx-auto    ">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 bg-gray-50">
            <div className="container-responsive max-w-7xl mx-auto    ">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Why Choose This Service?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 bg-white">
            <div className="container-responsive max-w-7xl mx-auto    ">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                How It Works
              </h2>
              <div className="space-y-8">
                {processSteps.map((step) => (
                  <div
                    key={step.step}
                    className="flex flex-col md:flex-row gap-6 items-start p-6 bg-gray-50 rounded-lg border-l-4 border-primary-600"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50">
            <div className="container-responsive max-w-5xl mx-auto    ">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8 text-center">
                  <div className="text-5xl mb-4">{icon}</div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Get Started Today</h2>
                  <p className="text-primary-100 text-lg">Fill out the form below and our team will get back to you within 24 hours</p>
                </div>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="mx-8 mt-8 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-green-800">Request Submitted Successfully!</p>
                        <p className="text-sm text-green-700">Our team will contact you shortly.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Content */}
                <div className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                              }`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                              }`}
                            placeholder="your.email@example.com"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</div>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              maxLength={10}
                              className={`w-full pl-14 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                                }`}
                              placeholder="9876543210"
                            />
                          </div>
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                            Pin Code
                          </label>
                          <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            maxLength={6}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                            placeholder="110001"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RTI Details */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        RTI Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                            Department / Authority <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="department"
                            name="department"
                            required
                            value={formData.department}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                              }`}
                            placeholder="e.g., Telangana Police Department"
                          />
                          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                            placeholder="e.g., Telangana"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label htmlFor="urgency" className="block text-sm font-semibold text-gray-700 mb-2">
                            Urgency Level
                          </label>
                          <select
                            id="urgency"
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                          >
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="very-urgent">Very Urgent</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="preferredLanguage" className="block text-sm font-semibold text-gray-700 mb-2">
                            Preferred Language
                          </label>
                          <select
                            id="preferredLanguage"
                            name="preferredLanguage"
                            value={formData.preferredLanguage}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                          >
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="telugu">Telugu</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Query Section */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Your RTI Query / Requirements
                      </h3>
                      <div>
                        <label htmlFor="query" className="block text-sm font-semibold text-gray-700 mb-2">
                          Describe your RTI query <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="query"
                          name="query"
                          required
                          rows={6}
                          value={formData.query}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none ${errors.query ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                            }`}
                          placeholder="Please provide detailed information about what you want to know. Be specific about the information you need from the department..."
                        />
                        {errors.query && <p className="text-red-500 text-sm mt-1">{errors.query}</p>}
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Tip:</strong> Be specific about the information you need. Include dates, specific documents, or details that will help the department locate the information.
                        </p>
                      </div>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">{errors.submit}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Submit Request Now
                          </>
                        )}
                      </button>
                      <p className="text-center text-sm text-gray-500 mt-4">
                        By submitting, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </form>
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

export default ServicePageTemplate;

