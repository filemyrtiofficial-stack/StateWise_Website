import React, { useState, useEffect, useRef, memo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateHero as StateHeroData } from '../../data/states';
// Lazy load non-critical components to improve LCP
const PublicAuthoritiesList = lazy(() => import('./PublicAuthoritiesList').then(m => ({ default: m.PublicAuthoritiesList })));
import SOFIcon from '../../assets/images/SOFIcon.webp';
import AnonyIcon from '../../assets/images/AnonyIcon.webp';
import FirstIcon from '../../assets/images/FirstIcon.webp';
import BulkIcon from '../../assets/images/BulkIcon.webp';
import CustomIcon from '../../assets/images/CustomIcon.webp';
import Icon15min from '../../assets/images/15minIcon.webp';

// Add fade-in animation styles
const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
`;

interface StateHeroProps {
  hero: StateHeroData;
  stateName: string;
  stateSlug: string;
  departments?: string[];
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  location?: string;
}

// Testimonials Carousel Component
const TestimonialsCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Testimonial[] = [
    {
      name: 'Rajesh Kumar',
      text: 'Got my RTI response in 25 days. Excellent service! Very professional team.',
      rating: 5,
      location: 'Hyderabad, Telangana'
    },
    {
      name: 'Priya Sharma',
      text: 'Very professional team. Highly recommended! The process was smooth and transparent.',
      rating: 5,
      location: 'Warangal, Telangana'
    },
    {
      name: 'Suresh Reddy',
      text: 'Quick response and excellent support. Got the information I needed within 30 days.',
      rating: 5,
      location: 'Vijayawada, Telangana'
    },
    {
      name: 'Anita Patel',
      text: 'Easy to use platform. The RTI application was drafted perfectly and submitted on time.',
      rating: 5,
      location: 'Karimnagar, Telangana'
    },
    {
      name: 'Kiran Kumar',
      text: 'Best RTI filing service! The team helped me throughout the process. Very satisfied!',
      rating: 5,
      location: 'Nizamabad, Telangana'
    },
    {
      name: 'Meera Devi',
      text: 'Transparent process and great customer service. Received my RTI response quickly.',
      rating: 5,
      location: 'Khammam, Telangana'
    },
  ];

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number | null = null;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const cardWidth = 320; // Width of each card (w-80 = 320px)
    const gap = 16; // gap-4 = 16px

    const scroll = () => {
      if (!scrollContainer || isPaused) {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        return;
      }

      scrollPosition += scrollSpeed;
      const maxScroll = testimonials.length * (cardWidth + gap);

      // Reset scroll position when reaching the duplicate set
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling
    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, testimonials.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-hidden scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {duplicatedTestimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-72 sm:w-80 bg-white p-4 sm:p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{testimonial.name}</div>
                  {testimonial.location && (
                    <div className="text-xs text-gray-500 truncate">{testimonial.location}</div>
                  )}
                </div>
              </div>
              <div className="flex text-yellow-500 text-xs sm:text-sm flex-shrink-0 ml-2">
                {'⭐'.repeat(testimonial.rating)}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic break-words">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-purple-50 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-purple-50 to-transparent pointer-events-none"></div>
    </div>
  );
};

const StateHeroComponent: React.FC<StateHeroProps> = ({ hero: _hero, stateName, stateSlug: _stateSlug, departments: _departments }) => {
  const navigate = useNavigate();
  const [callbackPhone, setCallbackPhone] = useState('');
  const [consultationForm, setConsultationForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pinCode: '',
    address: '',
    acceptTerms: false
  });
  const [consultationErrors, setConsultationErrors] = useState<Record<string, string>>({});
  const [consultationStatus, setConsultationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [consultationErrorMessage, setConsultationErrorMessage] = useState<string>('');
  const [callbackStatus, setCallbackStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [callbackError, setCallbackError] = useState<string>('');

  const rtiModels = [
    {
      id: '1',
      name: 'Seamless Online Filing',
      icon: SOFIcon,
      iconText: 'Seamless Online Filing',
      description: 'File RTI applications online easily with expert drafting, submission, and timely dispatch.',
      route: '/services/seamless-online-filing',
      buttonText: 'File Now'
    },
    {
      id: '2',
      name: 'Anonymous RTI Filing',
      icon: AnonyIcon,
      iconText: 'ANONYMOUS RTI Filing',
      description: 'Protect your identity with our discreet service for filing RTI applications on your behalf.',
      route: '/services/anonymous',
      buttonText: 'Start Anonymously'
    },
    {
      id: '3',
      name: 'Online First Appeal Filing',
      icon: FirstIcon,
      iconText: 'First Appeal',
      description: 'File your First Appeal online with expert drafting, review, and quick submission.',
      route: '/services/1st-appeal',
      buttonText: 'Appeal Now'
    },
    {
      id: '4',
      name: 'Efficient Bulk RTI Filing',
      icon: BulkIcon,
      iconText: 'Efficient Bulk RTI Filing',
      description: 'Manage and submit multiple RTI applications efficiently with our professional bulk service.',
      route: '/services/bulk',
      buttonText: 'Request Quote'
    },
    {
      id: '5',
      name: 'Custom RTI',
      icon: CustomIcon,
      iconText: 'Custom RTI',
      description: 'Can\'t find the right RTI? Create a personalized application designed for your exact information need.',
      route: '/services/custom-rti',
      buttonText: 'Custom RTI'
    },
    {
      id: '6',
      name: '15 min RTI',
      icon: Icon15min,
      iconText: '15-MIN TALK TO EXPERT',
      description: 'Get personalized advice from legal experts to navigate complex RTI applications effectively.',
      route: '/services/15-minute-consultation',
      buttonText: 'Pay Now'
    },
  ];

  const validatePhone = (phone: string): boolean => {
    // Indian mobile: 10 digits, may start with +91
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackError('');

    const phone = callbackPhone.trim();

    if (!phone) {
      setCallbackError('Please enter your mobile number');
      return;
    }

    if (!validatePhone(phone)) {
      setCallbackError('Please enter a valid 10-digit mobile number');
      return;
    }

    setCallbackStatus('submitting');

    try {
      const { callbackRequestsAPI } = await import('../../services/api');

      const result = await callbackRequestsAPI.createPublic({
        phone: phone,
        state_slug: _stateSlug || undefined
      });

      if (result && typeof result === 'object' && 'success' in result && result.success) {
        setCallbackStatus('success');
        setCallbackPhone('');
        setCallbackError('');
      } else {
        throw new Error('Failed to submit callback request');
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Failed to submit callback request:', error);
      }
      setCallbackStatus('error');
      if (error instanceof Error) {
        setCallbackError(error.message || 'Failed to submit. Please try again.');
      } else if (error?.message) {
        setCallbackError(error.message);
      } else {
        setCallbackError('Failed to submit callback request. Please try again.');
      }
    }
  };

  const resetCallbackForm = () => {
    setCallbackStatus('idle');
    setCallbackPhone('');
    setCallbackError('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode);
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationErrors({});
    setConsultationErrorMessage('');

    // Validate form - safely check if fields exist and are not empty
    const fullName = consultationForm.fullName?.trim() || '';
    const email = consultationForm.email?.trim() || '';
    const mobile = consultationForm.mobile?.trim() || '';
    const address = consultationForm.address?.trim() || '';
    const pinCode = consultationForm.pinCode?.trim() || '';

    const errors: Record<string, string> = {};

    if (!fullName) {
      errors.fullName = 'Full name is required';
    } else if (fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!validatePhone(mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!address) {
      errors.address = 'Address is required';
    } else if (address.length < 10) {
      errors.address = 'Address must be at least 10 characters';
    }

    if (!pinCode) {
      errors.pinCode = 'Pin code is required';
    } else if (!validatePincode(pinCode)) {
      errors.pinCode = 'Please enter a valid 6-digit pin code';
    }

    if (!consultationForm.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(errors).length > 0) {
      setConsultationErrors(errors);
      return;
    }

    setConsultationStatus('submitting');

    try {
      const { consultationsAPI } = await import('../../services/api');

      const result = await consultationsAPI.createPublic({
        full_name: fullName,
        email: email,
        mobile: mobile,
        address: address,
        pincode: pinCode,
        state_slug: _stateSlug || undefined,
        source: 'hero_section'
      });

      if (result && typeof result === 'object' && 'success' in result && result.success) {
        setConsultationStatus('success');
        setConsultationErrors({});
        setConsultationErrorMessage('');
      } else {
        throw new Error('Failed to submit consultation');
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Failed to submit consultation:', error);
      }
      setConsultationStatus('error');

      // Extract error message
      let errorMessage = 'Failed to submit consultation. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.errors && Array.isArray(error.errors)) {
        // Handle validation errors from API
        const validationErrors = error.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        errorMessage = validationErrors;
      }
      setConsultationErrorMessage(errorMessage);
    }
  };

  const resetConsultationForm = () => {
    setConsultationStatus('idle');
    setConsultationForm({ fullName: '', email: '', mobile: '', pinCode: '', address: '', acceptTerms: false });
    setConsultationErrors({});
    setConsultationErrorMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsultationForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (consultationErrors[name]) {
      setConsultationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const statistics = [
    { value: '93%', label: 'Success Rate' },
    { value: '130+', label: 'Business Benefited' },
    { value: '7,161+', label: 'Consultation Delivered' },
    { value: '12,599+', label: 'RTI Filed' },
    { value: '32,000+', label: 'Happy User' },
    { value: '₹10', label: 'Official Fee' },
  ];

  return (
    <>
      <style>{fadeInStyle}</style>
      <section className="bg-gray-50 pt-12 pb-12 sm:pb-16 md:pb-20">
        <div className="container-responsive max-w-7xl mx-auto">
          {/* Main Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {/* Left Column - Main Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              {/* Main Headline - Critical for LCP, render immediately */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2 leading-tight" style={{ contentVisibility: 'auto' }}>
                  Empowering every voice with clarity, rights, and legal transparency.
                </h1>
              </div>

              {/* Talk to the Expert Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">Talk to the Expert</h2>
                  <div className="h-0.5 w-12 bg-orange-500"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {callbackStatus === 'idle' || callbackStatus === 'submitting' ? (
                    <form onSubmit={handleCallbackSubmit} className="flex flex-col sm:flex-row gap-1.5 max-w-md flex-1">
                      <div className="flex-1 relative">
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                          <span className="text-xs">🇮🇳</span>
                          <svg className="w-2 h-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          value={callbackPhone}
                          onChange={(e) => {
                            setCallbackPhone(e.target.value);
                            if (callbackError) setCallbackError('');
                          }}
                          placeholder="Mobile Number"
                          required
                          disabled={callbackStatus === 'submitting'}
                          className={`w-full pl-8 pr-2 py-2.5 sm:py-3 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent text-xs disabled:opacity-50 disabled:cursor-not-allowed ${callbackError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {callbackError && (
                          <p className="text-xs text-red-600 mt-1">{callbackError}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={callbackStatus === 'submitting'}
                        className="px-3 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold flex items-center justify-center gap-1 transition-colors text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {callbackStatus === 'submitting' ? (
                          <>
                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Get Callback
                          </>
                        )}
                      </button>
                    </form>
                  ) : callbackStatus === 'success' ? (
                    <div className="flex-1 max-w-md animate-fadeIn">
                      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-green-800 mb-2">Thank you! We'll connect with you shortly.</p>
                        <button
                          onClick={resetCallbackForm}
                          className="text-xs text-green-700 hover:text-green-900 underline"
                        >
                          Submit Another Request
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 max-w-md animate-fadeIn">
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                        <p className="text-sm font-semibold text-red-800 mb-2">
                          {callbackError || 'Something went wrong. Please try again.'}
                        </p>
                        <button
                          onClick={resetCallbackForm}
                          className="text-xs text-red-700 hover:text-red-900 underline"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      // Handle Book Appointment
                      // TODO: Add navigation or modal for appointment booking
                      if (import.meta.env.DEV) {
                        console.log('Book Appointment clicked');
                      }
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold flex items-center justify-center gap-1.5 transition-colors text-xs whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-lg text-center"
                  >
                    <div className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonials Section - At the bottom of left column */}
              <div className="mt-6 sm:mt-8">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                    What People Are Saying
                  </h2>
                  <Suspense fallback={<div className="min-h-[200px]" />}>
                    <TestimonialsCarousel />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Right Column - Consultation Form (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-black rounded-lg shadow-lg p-3 sm:p-4 lg:sticky lg:top-4 min-h-[400px] flex flex-col">
                {/* Call Us Phone Number - At the top */}
                <div className="flex items-center gap-2 mb-2 p-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Call Us :</span>
                  <a
                    href="tel:+919911100589"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    +91-99111-00589
                  </a>
                </div>

                {consultationStatus === 'idle' || consultationStatus === 'submitting' ? (
                  <>
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-1 pb-1 border-b-2 border-black">
                      Get a free Micro Consultation now!
                    </h3>
                    <p className="text-xs sm:text-sm text-black mb-2">
                      Let the FileMyRTI Team help you in exercising your Legal Rights.
                    </p>

                    <form onSubmit={handleConsultationSubmit} className="space-y-2 flex-1">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={consultationForm.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${consultationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {consultationErrors.fullName && (
                          <p className="text-xs text-red-600 mt-0.5">{consultationErrors.fullName}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={consultationForm.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${consultationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {consultationErrors.email && (
                          <p className="text-xs text-red-600 mt-0.5">{consultationErrors.email}</p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={consultationForm.mobile}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your mobile number"
                          maxLength={10}
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${consultationErrors.mobile ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {consultationErrors.mobile && (
                          <p className="text-xs text-red-600 mt-0.5">{consultationErrors.mobile}</p>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={consultationForm.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Street Address, Building, Apartment, City, State"
                          rows={2}
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none ${consultationErrors.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {consultationErrors.address && (
                          <p className="text-xs text-red-600 mt-0.5">{consultationErrors.address}</p>
                        )}
                      </div>

                      {/* Pin Code */}
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">
                          Pin Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          value={consultationForm.pinCode}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your pin code"
                          maxLength={6}
                          pattern="[0-9]{6}"
                          className={`w-full px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${consultationErrors.pinCode ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {consultationErrors.pinCode && (
                          <p className="text-xs text-red-600 mt-0.5">{consultationErrors.pinCode}</p>
                        )}
                      </div>

                      {/* Terms and Conditions */}
                      <div className={`flex items-start gap-2 p-1.5 rounded-lg border ${consultationErrors.acceptTerms ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                        }`}>
                        <input
                          type="checkbox"
                          id="acceptTermsConsultation"
                          checked={consultationForm.acceptTerms}
                          onChange={(e) => {
                            setConsultationForm({ ...consultationForm, acceptTerms: e.target.checked });
                            if (consultationErrors.acceptTerms) {
                              setConsultationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.acceptTerms;
                                return newErrors;
                              });
                            }
                          }}
                          className="mt-0.5 w-3.5 h-3.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          required
                        />
                        <label htmlFor="acceptTermsConsultation" className="text-xs text-gray-700 cursor-pointer leading-tight">
                          I agree to the <a href="/terms-and-conditions" target="_blank" className="text-primary-600 hover:text-primary-700 underline">Terms and Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>. <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {consultationErrors.acceptTerms && (
                        <p className="text-xs text-red-600 mt-0.5">{consultationErrors.acceptTerms}</p>
                      )}
                      {consultationErrorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                          <p className="text-xs text-red-800">{consultationErrorMessage}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={consultationStatus === 'submitting'}
                        className="w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {consultationStatus === 'submitting' ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </form>
                  </>
                ) : consultationStatus === 'success' ? (
                  <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="text-center w-full">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Thank you!
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 mb-6">
                        We'll connect with you shortly.
                      </p>
                      <button
                        onClick={resetConsultationForm}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
                      >
                        Submit Another Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="text-center w-full">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Something went wrong
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 mb-4">
                        {consultationErrorMessage || 'Please try again.'}
                      </p>
                      <button
                        onClick={resetConsultationForm}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List of Public Authorities and RTI Models Section */}
        <div className="container-responsive max-w-7xl mx-auto mt-12 sm:mt-16">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-left">
              Our Services & Public Authorities
            </h2>
          </div>

          {/* Two Column Layout - Equal Width and Height */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-stretch">
            {/* Left Column - List of Public Authorities */}
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-stretch">
                <Suspense fallback={<div className="min-h-[400px] bg-white rounded-lg" />}>
                  <PublicAuthoritiesList stateName={stateName} />
                </Suspense>
              </div>
            </div>

            {/* Right Column - RTI Models Grid */}
            <div className="flex flex-col h-full">
              <div className="mb-5 sm:mb-6 -mt-16 sm:-mt-19.5">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-left">
                  RTI Models
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-left">
                  Choose the service that best fits your needs
                </p>
              </div>

              {/* RTI Models Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {rtiModels.map((model) => (
                  <div
                    key={model.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col h-full group"
                  >
                    {/* Icon Section */}
                    <div className="mb-3 flex flex-col items-center -mx-3 sm:-mx-4 -mt-3 sm:-mt-4">
                      <img
                        src={model.icon}
                        loading="lazy"
                        decoding="async"
                        width="48"
                        height="48"
                        alt={model.name}
                        className="w-full h-auto object-contain"
                      />
                    </div>

                    {/* Title */}
                    <h4 className="text-sm sm:text-sm font-bold text-gray-900 mb-2 text-center leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
                      {model.name}
                    </h4>

                    {/* Description */}
                    <p className="text-xs sm:text-xs text-gray-600 mb-3 flex-grow leading-relaxed text-center" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {model.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate(model.route)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-md transition-all duration-200 text-xs sm:text-xs shadow-sm hover:shadow-md active:scale-95"
                    >
                      {model.buttonText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const StateHero = memo(StateHeroComponent);

