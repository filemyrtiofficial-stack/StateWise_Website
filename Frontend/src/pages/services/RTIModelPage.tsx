import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { LazyChatbot } from '../../components/common/LazyChatbot';

interface RTIModel {
  id: string;
  name: string;
  icon: string;
  iconText: string;
  description: string;
  fullDescription: string;
  features: string[];
  price: number;
  originalPrice: number;
  buttonText: string;
}

const rtiModels: Record<string, RTIModel> = {
  'seamless-online-filing': {
    id: '1',
    name: 'Seamless Online Filing',
    icon: '⚡',
    iconText: 'Seamless Online Filing',
    description: 'File RTI applications online easily with expert drafting, submission, and timely dispatch.',
    fullDescription: 'Filing RTI applications online has never been easier. Our seamless online filing service handles everything for you - from expert drafting to submission and timely dispatch. We ensure your application is properly formatted, submitted to the correct authority, and tracked throughout the process. Get your information without the hassle.',
    features: [
      'Expert drafting service',
      'Online submission',
      'Timely dispatch',
      'Application tracking',
      'Proper formatting',
      'Authority verification',
      'Status updates'
    ],
    price: 2999,
    originalPrice: 4999,
    buttonText: 'File Now'
  },
  'anonymous': {
    id: '2',
    name: 'Anonymous RTI Filing',
    icon: '🎭',
    iconText: 'ANONYMOUS RTI Filing',
    description: 'Protect your identity with our discreet service for filing RTI applications on your behalf.',
    fullDescription: 'Privacy matters when filing RTI applications. Our anonymous RTI filing service protects your identity while ensuring your application is filed correctly. We handle everything discreetly - from drafting to submission - so you can access government information without revealing your identity. Complete confidentiality guaranteed.',
    features: [
      'Complete anonymity',
      'Discreet filing service',
      'Identity protection',
      'Professional handling',
      'Confidential process',
      'Secure submission',
      'Privacy guaranteed'
    ],
    price: 3999,
    originalPrice: 5999,
    buttonText: 'Start Anonymously'
  },
  '1st-appeal': {
    id: '3',
    name: 'Online First Appeal Filing',
    icon: '📋',
    iconText: 'First Appeal',
    description: 'File your First Appeal online with expert drafting, review, and quick submission.',
    fullDescription: 'If your RTI application was rejected or you didn\'t receive a satisfactory response, filing a First Appeal is your next step. Our expert team will help you draft a compelling appeal, review all documentation, and submit it quickly. We understand the appeal process and will ensure your case is presented effectively.',
    features: [
      'Expert appeal drafting',
      'Quick review process',
      'Online submission',
      'Appeal tracking',
      'Documentation review',
      'Legal guidance',
      'Timely filing'
    ],
    price: 2499,
    originalPrice: 3999,
    buttonText: 'Appeal Now'
  },
  'bulk': {
    id: '4',
    name: 'Efficient Bulk RTI Filing',
    icon: '📦',
    iconText: 'Efficient Bulk RTI Filing',
    description: 'Manage and submit multiple RTI applications efficiently with our professional bulk service.',
    fullDescription: 'Need to file multiple RTI applications? Our efficient bulk RTI filing service makes it easy. We handle all your applications professionally - from drafting to submission and tracking. Perfect for businesses, organizations, or individuals who need to file multiple RTIs. Get volume discounts and professional service.',
    features: [
      'Multiple RTI management',
      'Bulk submission',
      'Cost-effective pricing',
      'Professional handling',
      'Volume discounts',
      'Centralized tracking',
      'Expert support'
    ],
    price: 9999,
    originalPrice: 14999,
    buttonText: 'Request Quote'
  },
  'custom-rti': {
    id: '5',
    name: 'Custom RTI',
    icon: '✏️',
    iconText: 'Custom RTI',
    description: 'Can\'t find the right RTI? Create a personalized application designed for your exact information need.',
    fullDescription: 'Every information need is unique. Our custom RTI service creates a personalized application designed specifically for your exact requirements. Our experts work with you to understand your needs, draft a tailored application, and ensure it gets the information you\'re looking for. Perfect for complex or specialized information requests.',
    features: [
      'Personalized RTI design',
      'Custom application',
      'Expert consultation',
      'Tailored solutions',
      'Specialized drafting',
      'Individual attention',
      'Complete customization'
    ],
    price: 1999,
    originalPrice: 3499,
    buttonText: 'Custom RTI'
  },
  '15-minute-consultation': {
    id: '6',
    name: '15 min RTI',
    icon: '⏱️',
    iconText: '15-MIN TALK TO EXPERT',
    description: 'Get personalized advice from legal experts to navigate complex RTI applications effectively.',
    fullDescription: 'RTI applications can be complex, but expert guidance makes all the difference. With our 15-minute consultation service, you\'ll get personalized advice from legal experts to navigate complex RTI applications effectively. Our experienced professionals will help you understand the process, draft your application correctly, and ensure you get the information you need.',
    features: [
      'Expert legal consultation',
      'Personalized RTI guidance',
      'Quick 15-minute session',
      'Professional advice',
      'Application drafting help',
      'Process explanation',
      'Best practices sharing'
    ],
    price: 299,
    originalPrice: 499,
    buttonText: 'Pay Now'
  }
};

// Image mapping for each service
const serviceImages: Record<string, string> = {
  'seamless-online-filing': '/images/SOF.webp',
  'anonymous': '/images/Anony.webp',
  'bulk': '/images/Bulk.webp',
  'custom-rti': '/images/Custom.webp',
  '1st-appeal': '/images/First.webp',
  '15-minute-consultation': '/images/15min.webp'
};

export const RTIModelPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modelSlug = location.pathname.split('/services/')[1];
  const model = modelSlug ? rtiModels[modelSlug] : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    rtiQuery: ''
  });

  // Lazy load YouTube iframe
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before video enters viewport
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  if (!model) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600">The RTI service you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
        <LazyChatbot />
      </>
    );
  }

  const faqs = [
    {
      q: 'What is RTI and why is it important?',
      a: 'RTI (Right to Information) is a fundamental right that empowers citizens to seek information from public authorities. It promotes transparency and accountability in governance.'
    },
    {
      q: `How does the ${model.name} service work?`,
      a: model.fullDescription
    },
    {
      q: 'What is the official RTI fee?',
      a: 'The official RTI fee is ₹10, which is included in our service. We handle all fee payments digitally during the submission process.'
    },
    {
      q: 'How long does it take to process?',
      a: 'Most RTI applications receive a response within 30 days as per the RTI Act. Our service ensures your application is filed correctly and on time.'
    },
    {
      q: 'Can I track my application?',
      a: 'Yes, once your RTI is filed, you\'ll receive a tracking number. You can monitor the status of your application through our platform or directly with the public authority.'
    }
  ];

  const pageTitle = `${model.name} - FileMyRTI | RTI Filing Service`;
  const pageDescription = model.fullDescription || model.description;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : `https://filemyrti.com/services/${modelSlug}`;
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": model.name,
    "description": pageDescription,
    "provider": {
      "@type": "Organization",
      "name": "FileMyRTI",
      "url": "https://filemyrti.com",
      "logo": "https://filemyrti.com/src/assets/icons/logo.webp"
    },
    "serviceType": "RTI Filing Service",
    "offers": {
      "@type": "Offer",
      "price": model.price.toString(),
      "priceCurrency": "INR",
      "description": model.name
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://filemyrti.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://filemyrti.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": model.name,
        "item": canonicalUrl
      }
    ]
  };

  const faqStructuredData = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${model.name}, RTI filing, RTI online, Right to Information, RTI Act 2005, RTI application, ${model.name} service, RTI filing service, government information, RTI India`} />
        <meta name="author" content="FileMyRTI" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FileMyRTI" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
        {faqStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        )}
      </Helmet>
      <div className="min-h-screen flex flex-col">
        {/* FILE: Frontend/src/pages/services/RTIModelPage.tsx - Fixed sidebar on left, NO gap with navbar */}
        {/* Sidebar - Fixed on left, 30% width (max 384px), perfectly flush with navbar - NO shadow, NO right border */}
        <div
          className="hidden lg:block fixed left-0 top-0 max-w-sm z-[110] overflow-y-auto"
          style={{
            width: 'min(30vw, 384px)',
            height: '100vh',
            boxShadow: 'none'
          }}
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-l-lg border-t border-b border-l border-primary-700 p-6 min-h-full">
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="w-full mb-4 bg-transparent hover:bg-primary-700/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-white font-semibold">Back to Home</span>
            </button>

            {/* Video Section - Lazy Loaded */}
            <div ref={videoRef} className="mb-6 mt-12 bg-white rounded-lg shadow-lg overflow-visible border-2 border-white">
              <div className="relative w-full bg-black rounded-lg" style={{ paddingBottom: '56.25%' }}>
                {shouldLoadVideo ? (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/fKam-c_Rugo?start=8"
                    title="RTI Service Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="text-white">Loading video...</div>
                  </div>
                )}
              </div>
            </div>

            {/* What Will You Get */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-white mb-4">What Will You Get:</h4>
              <ul className="space-y-3">
                {model.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-white flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {model.buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* FILE: Frontend/src/pages/services/RTIModelPage.tsx - Navbar starts immediately after sidebar, NO gap */}
        {/* Navbar - Starts exactly at sidebar edge, occupies remaining space - NO gap, NO margin/padding */}
        <div
          className="lg:max-w-full lg:w-full"
          style={{
            marginLeft: 'min(30vw, 384px)',
            width: 'calc(100% - min(30vw, 384px))',
            maxWidth: 'calc(100% - min(30vw, 384px))'
          }}
        >
          <Navbar />
        </div>

        {/* Main Content - Starts exactly at sidebar edge, occupies remaining space - NO gap */}
        {/* FILE: Frontend/src/pages/services/RTIModelPage.tsx - Main content aligned with navbar, no gap */}
        <main
          className="flex-grow"
          style={{
            marginLeft: 'min(30vw, 384px)',
            width: 'calc(100% - min(30vw, 384px))',
            maxWidth: 'calc(100% - min(30vw, 384px))',
            minHeight: 'calc(100vh - 48px)' // Account for navbar height
          }}
        >
          {/* Main Content - Two Column Layout */}
          {/* FILE: Frontend/src/pages/services/RTIModelPage.tsx - Content container with padding for readability */}
          <section className="pb-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                {/* Main Content */}
                <div className="lg:col-span-4">
                  {/* Course Overview */}
                  <div className="rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="mb-6">
                      <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">RTI Services</span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                        {model.name}
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {model.fullDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Expert Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Quick Processing</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-sm text-gray-500 line-through">₹ {model.originalPrice.toLocaleString()}.00</span>
                        <span className="ml-3 text-2xl font-bold text-primary-600">₹ {model.price.toLocaleString()}.00</span>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {model.buttonText}
                      </button>
                    </div>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-lg shadow-md border border-gray-200 p-6 text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Expert Guidance</h3>
                      <p className="text-sm text-gray-600">We focus on what matters most & bring you the most important RTI solutions</p>
                    </div>
                    <div className="rounded-lg shadow-md border border-gray-200 p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Fast Response</h3>
                      <p className="text-sm text-gray-600">Get quick responses and timely updates on your RTI application status</p>
                    </div>
                    <div className="rounded-lg shadow-md border border-gray-200 p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Success Guaranteed</h3>
                      <p className="text-sm text-gray-600">Ace through practice with expert support and professional handling</p>
                    </div>
                  </div>

                  {/* Service Image Section */}
                  {modelSlug && serviceImages[modelSlug] && (
                    <div className="mb-8">
                      <img
                        src={serviceImages[modelSlug]}
                        alt={model?.name || 'RTI Service'}
                        className="w-full h-auto rounded-lg shadow-md"
                        style={{ objectFit: 'contain' }}
                        draggable="false"
                      />
                    </div>
                  )}

                  {/* Service Outline Section */}
                  <div className="rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
                    {/* Title with underline */}
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Service Outline</h3>
                      <div className="h-1 bg-blue-600 w-48 rounded"></div>
                    </div>

                    {/* Descriptive paragraph */}
                    <p className="text-gray-700 text-base mb-8 leading-relaxed">
                      Our comprehensive service is designed to transform your RTI filing experience, guiding you step-by-step to gain confidence and acquire the information you need. We don't just provide filing services; we provide a strategic roadmap to help you achieve your goals.
                    </p>

                    {/* Ready to Ace Section with Pie Chart */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                      {/* Pie Chart */}
                      <div className="relative flex-shrink-0">
                        <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                          {/* Background circle (2%) */}
                          <circle
                            cx="70"
                            cy="70"
                            r="55"
                            fill="none"
                            stroke="#e0f2fe"
                            strokeWidth="24"
                          />
                          {/* 98% filled arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="55"
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth="24"
                            strokeDasharray={`${2 * Math.PI * 55 * 0.98} ${2 * Math.PI * 55}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* 98% text positioned in the filled segment */}
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                          <span className="text-white font-bold text-xl bg-primary-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">98%</span>
                        </div>
                        {/* Arrow and label */}
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 mt-2">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-t-primary-600"></div>
                            <span className="text-xs text-gray-600 whitespace-nowrap font-medium">Success Rate</span>
                          </div>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">READY TO ACE YOUR RTI FILING</h4>
                        <div className="bg-primary-600 rounded-lg px-6 py-3 inline-block">
                          <span className="text-white font-semibold text-lg">HERE'S WHAT YOU GET</span>
                        </div>
                      </div>
                    </div>

                    {/* What You Get Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      {/* Card 1 - Expert Drafting */}
                      <div className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h5 className="font-semibold text-gray-900 text-lg mb-2">Expert RTI Drafting</h5>
                        <p className="text-gray-600 text-sm">Professional RTI applications drafted by legal experts ensuring full compliance with RTI Act 2005 guidelines and best practices.</p>
                      </div>

                      {/* Card 2 - Application Tracking */}
                      <div className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                        </div>
                        <h5 className="font-semibold text-gray-900 text-lg mb-2">Real-time Application Tracking</h5>
                        <p className="text-gray-600 text-sm">Track your RTI application status in real-time with instant notifications and regular updates on submission and response progress.</p>
                      </div>

                      {/* Card 3 - Authority Verification */}
                      <div className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                          </svg>
                        </div>
                        <h5 className="font-semibold text-gray-900 text-lg mb-2">Verified Authority Submission</h5>
                        <p className="text-gray-600 text-sm">We verify and submit your RTI to the correct public authority with all required documentation, ensuring proper channel compliance.</p>
                      </div>
                    </div>
                  </div>

                  {/* Why This Service Section */}
                  <div className="rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
                    {/* Title with underline */}
                    <div className="mb-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Why This Service?</h3>
                      <div className="h-1 bg-blue-600 w-48 rounded"></div>
                    </div>

                    {/* Main Content: Large 4 and Cards Grid */}
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                      {/* Left Side - Large Number 4 */}
                      <div className="flex-shrink-0 relative">
                        <div className="relative flex items-center gap-4">
                          {/* Large outlined 4 */}
                          <div className="relative">
                            <span className="text-[180px] font-bold text-primary-600 leading-none" style={{
                              WebkitTextStroke: '6px #0284c7',
                              WebkitTextFillColor: 'transparent',
                              fontFamily: 'Arial, sans-serif',
                              letterSpacing: '-0.02em'
                            }}>
                              4
                            </span>
                          </div>
                          {/* Text next to 4 */}
                          <div className="flex flex-col justify-center">
                            <p className="text-primary-600 font-bold text-lg leading-tight">
                              REASONS<br />
                              WHICH MAKE<br />
                              IT STAND<br />
                              OUT
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - 2x2 Grid of Cards */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1: Expert Professional Service */}
                        <div className="border-t-2 border-l-2 border-b border-r border-primary-600 rounded-lg p-3 shadow-md relative z-0 flex items-start gap-3" style={{ borderBottomColor: '#93c5fd', borderRightColor: '#93c5fd' }}>
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary-600 text-sm mb-1">Expert Professional Service</h4>
                            <p className="text-primary-600 text-xs leading-snug">Our team of experienced professionals ensures your RTI application is handled with the utmost care and expertise.</p>
                          </div>
                        </div>

                        {/* Card 2: Time-Saving Convenience */}
                        <div className="border-t-2 border-l-2 border-b border-r border-primary-600 rounded-lg p-3 shadow-md relative z-0 flex items-start gap-3" style={{ borderBottomColor: '#93c5fd', borderRightColor: '#93c5fd' }}>
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary-600 text-sm mb-1">Time-Saving Convenience</h4>
                            <p className="text-primary-600 text-xs leading-snug">Save valuable time by letting us handle all the paperwork, drafting, and submission process.</p>
                          </div>
                        </div>

                        {/* Card 3: Guaranteed Compliance */}
                        <div className="border-t-2 border-l-2 border-b border-r border-primary-600 rounded-lg p-3 shadow-md relative z-0 flex items-start gap-3" style={{ borderBottomColor: '#93c5fd', borderRightColor: '#93c5fd' }}>
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary-600 text-sm mb-1">Guaranteed Compliance</h4>
                            <p className="text-primary-600 text-xs leading-snug">We ensure your RTI application follows all legal requirements and guidelines, reducing the risk of rejection.</p>
                          </div>
                        </div>

                        {/* Card 4: Complete Transparency */}
                        <div className="border-t-2 border-l-2 border-b border-r border-primary-600 rounded-lg p-3 shadow-md relative z-0 flex items-start gap-3" style={{ borderBottomColor: '#93c5fd', borderRightColor: '#93c5fd' }}>
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary-600 text-sm mb-1">Complete Transparency</h4>
                            <p className="text-primary-600 text-xs leading-snug">Track your application status in real-time and stay informed throughout the entire process.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* How It Works Section */}
                  <div className="rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-primary-600">1</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Submit Your Request</h4>
                        <p className="text-sm text-gray-600">Fill out a simple form with your information needs and requirements.</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-primary-600">2</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Expert Review</h4>
                        <p className="text-sm text-gray-600">Our team reviews your request and drafts the perfect RTI application.</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-primary-600">3</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Application Filed</h4>
                        <p className="text-sm text-gray-600">We submit your RTI application to the correct authority on your behalf.</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-primary-600">4</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Track & Receive</h4>
                        <p className="text-sm text-gray-600">Monitor your application status and receive the information you requested.</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonials Section */}
                  <div className="rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-xl font-bold text-primary-600">RK</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Rajesh Kumar</h4>
                            <p className="text-sm text-gray-600">Delhi</p>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700 italic">"Excellent service! They filed my RTI application quickly and I received the information I needed within 30 days. Highly recommended!"</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-xl font-bold text-primary-600">PM</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Priya Mehta</h4>
                            <p className="text-sm text-gray-600">Mumbai</p>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700 italic">"Professional and efficient. The team helped me file multiple RTI applications and I got all the information I needed. Great experience!"</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-xl font-bold text-primary-600">AS</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Amit Sharma</h4>
                            <p className="text-sm text-gray-600">Bangalore</p>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700 italic">"Very satisfied with the service. They made the entire RTI filing process so simple and I received timely updates throughout."</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-xl font-bold text-primary-600">SD</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Sunita Devi</h4>
                            <p className="text-sm text-gray-600">Hyderabad</p>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700 italic">"Outstanding support! The team was very helpful and guided me through every step. Got my information quickly and efficiently."</p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="rounded-lg shadow-lg border border-gray-200 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                          <p className="text-gray-600 text-sm">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer - Positioned beside sidebar, not under it */}
        {/* FILE: Frontend/src/pages/services/RTIModelPage.tsx - Footer aligned with main content, no overlap with sidebar */}
        <div
          style={{
            marginLeft: 'min(30vw, 384px)',
            width: 'calc(100% - min(30vw, 384px))',
            maxWidth: 'calc(100% - min(30vw, 384px))'
          }}
        >
          <Footer />
        </div>
        <LazyChatbot />

        {/* Consultation Modal */}
        {isModalOpen && model && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Consultation</h3>

              {/* Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted:', formData);
                // Handle form submission here
              }}>
                <div className="space-y-4 mb-6">
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* RTI Query */}
                  <div>
                    <textarea
                      placeholder="Enter your RTI Query / Information Request here"
                      value={formData.rtiQuery}
                      onChange={(e) => setFormData({ ...formData, rtiQuery: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4"
                >
                  Book Consultation Now - ₹{model.price}
                </button>

                {/* Payment Logos */}
                <div className="flex items-center justify-center mt-2">
                  <img
                    src="https://i.postimg.cc/RWLRwrDN/razorpay.png"
                    alt="Payment Partners - Razorpay, VISA, Paytm, MasterCard"
                    className="h-14 w-auto max-w-full payment-logos-image"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

