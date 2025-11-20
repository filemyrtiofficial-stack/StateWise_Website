/**
 * RTI Model Page Component
 * Production-ready service page with proper structure and separation of concerns
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { LazyChatbot } from '../../components/common/LazyChatbot';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ServiceSidebar } from '../../components/services/ServiceSidebar';
import { ServiceHero } from '../../components/services/ServiceHero';
import { ServiceFeatures } from '../../components/services/ServiceFeatures';
import { ServiceOutline } from '../../components/services/ServiceOutline';
import { WhyThisService } from '../../components/services/WhyThisService';
import { HowItWorks } from '../../components/services/HowItWorks';
import { Testimonials } from '../../components/services/Testimonials';
import { ServiceFAQ } from '../../components/services/ServiceFAQ';
import { ConsultationModal } from '../../components/services/ConsultationModal';
import { PaymentSuccessModal } from '../../components/services/PaymentSuccessModal';
import { useRTIService } from '../../hooks/useRTIService';
import { useConsultationForm } from '../../hooks/useConsultationForm';
import { usePayment } from '../../hooks/usePayment';
import { useVideoLazyLoad } from '../../hooks/useVideoLazyLoad';
import { SERVICE_IMAGES, SERVICE_IMAGES_X, getVideoConfigForService } from '../../constants/services';
import { generateServiceStructuredData, generateBreadcrumbStructuredData, generateFAQStructuredData, generateCanonicalUrl, generatePageTitle, generateMetaKeywords } from '../../utils/seo';
import { FAQ } from '../../types/services';

/**
 * Generate FAQs based on service model
 */
const generateFAQs = (modelName: string, fullDescription: string): FAQ[] => [
  {
    q: 'What is RTI and why is it important?',
    a: 'RTI (Right to Information) is a fundamental right that empowers citizens to seek information from public authorities. It promotes transparency and accountability in governance.'
  },
  {
    q: `How does the ${modelName} service work?`,
    a: fullDescription
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

/**
 * Responsive layout styles for sidebar offset (main content and footer)
 */
const ResponsiveLayoutStyles: React.FC = () => (
  <style>{`
    @media (min-width: 1024px) {
      .main-content-responsive,
      .footer-responsive {
        margin-left: min(30vw, 384px) !important;
        width: calc(100% - min(30vw, 384px)) !important;
        max-width: calc(100% - min(30vw, 384px)) !important;
      }
    }
  `}</style>
);

export const RTIModelPage: React.FC = () => {
  const { model, modelSlug, isLoading, error } = useRTIService();
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    resetForm
  } = useConsultationForm();
  const { paymentState, initiatePayment, resetPayment } = usePayment();
  const { shouldLoadVideo, videoRef } = useVideoLazyLoad();
  const videoConfig = getVideoConfigForService(modelSlug ?? undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    applicationId: string | number;
    paymentId: string;
  } | null>(null);

  // Handle form submission without payment (for free services like bulk RTI)
  const submitApplicationWithoutPayment = async (data: typeof formData) => {
    try {
      // Import API services
      const { rtiApplicationsAPI, servicesAPI, statesAPI, convertConsultationFormToAPI } = await import('../../services/api');

      // Comprehensive frontend validation before submission - only name, email, and mobile are mandatory
      const validationErrors: string[] = [];

      if (!data.fullName || data.fullName.trim().length < 2) {
        validationErrors.push('Full name must be at least 2 characters');
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        validationErrors.push('Valid email is required');
      }

      if (!data.mobile) {
        validationErrors.push('Mobile number is required');
      } else {
        const cleaned = data.mobile.replace(/\D/g, '');
        const length = cleaned.length;
        if (length < 10) {
          validationErrors.push('Mobile number must be at least 10 digits');
        } else if (length > 13) {
          validationErrors.push('Mobile number must not exceed 13 digits');
        }
      }

      // All other fields (rtiQuery, address, pincode) are optional - no validation needed

      if (validationErrors.length > 0) {
        throw new Error(`Validation failed:\n${validationErrors.join('\n')}`);
      }

      // Fetch service by slug to get the correct service_id
      let serviceId: number | null = null;
      try {
        const serviceResponse = await servicesAPI.getBySlug(modelSlug || '') as any;
        if (serviceResponse?.success && serviceResponse?.data?.id) {
          serviceId = Number(serviceResponse.data.id);
          console.log(`✅ Found service ID: ${serviceId} for slug: ${modelSlug}`);
        } else {
          throw new Error('Service not found in response');
        }
      } catch (error) {
        console.error('❌ Could not fetch service from backend:', error);
        // Try to parse model.id as fallback
        if (model && model.id) {
          serviceId = parseInt(model.id);
          console.log(`✅ Using model ID as fallback: ${serviceId}`);
        }
      }

      // If we still don't have a valid serviceId, throw an error
      if (!serviceId || !Number.isInteger(serviceId) || serviceId < 1) {
        const errorMsg = `Unable to determine service ID. Please ensure the service exists in the database for slug: ${modelSlug}`;
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }

      // Fetch state by slug (default to Telangana if not found)
      // Default state_id to 4 (Telangana) based on current database
      let stateId = 4; // Telangana
      try {
        const statesResponse = await statesAPI.getAll() as any;
        if (statesResponse?.success && Array.isArray(statesResponse?.data)) {
          const telanganaState = statesResponse.data.find((s: any) => s.slug === 'telangana');
          if (telanganaState?.id) {
            stateId = Number(telanganaState.id);
            console.log(`✅ Found state ID: ${stateId} for Telangana`);
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch states from backend, using default ID 4 (Telangana):', error);
      }

      // Convert form data to API format
      const apiData = convertConsultationFormToAPI(data, serviceId, stateId);

      // No payment information for free services - omit payment_id and order_id
      const applicationData = {
        ...apiData
        // payment_id and order_id are optional and omitted for free services
      };

      // Log the complete payload for debugging
      console.log('📤 Submitting RTI application (lead only, no payment):', {
        ...applicationData,
        // Don't log sensitive data in production
        service_id: applicationData.service_id,
        state_id: applicationData.state_id,
        field_counts: {
          full_name_length: applicationData.full_name?.length || 0,
          rti_query_length: applicationData.rti_query?.length || 0,
          address_length: applicationData.address?.length || 0
        }
      });

      // Call public API (no authentication required)
      const result = await rtiApplicationsAPI.createPublic(applicationData);

      console.log('✅ Application created successfully (lead only):', result);

      // Extract application ID
      let applicationId: string | number = 'N/A';
      if (result && typeof result === 'object' && 'data' in result) {
        const resultData = result.data as any;
        applicationId = resultData?.id || resultData?.insertId || 'N/A';
      }

      // Store success data and show success modal
      setSuccessData({
        applicationId,
        paymentId: 'LEAD_ONLY'
      });

      // Close consultation modal and show success modal
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      resetForm();
      resetPayment();
      setIsProcessingPayment(false);
    } catch (error) {
      console.error('❌ Failed to submit application:', error);

      // Extract detailed error information
      let errorMessage = 'Failed to submit application. Please try again.';
      let validationDetails = '';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Check if it's an APIError with validation details
        if ('errors' in error && Array.isArray((error as any).errors)) {
          const apiError = error as any;
          validationDetails = '\n\nValidation Errors:\n' +
            apiError.errors.map((err: any) => `• ${err.field}: ${err.message}`).join('\n');
        }
      }

      // Create detailed error message
      const fullErrorMessage = `❌ Error: ${errorMessage}${validationDetails}\n\nPlease try submitting again or contact support.`;

      alert(fullErrorMessage);

      // Don't throw error - allow user to retry
      setIsProcessingPayment(false);
    }
  };

  // Handle form submission after payment
  const submitApplicationAfterPayment = async (data: typeof formData, paymentId: string, orderId: string) => {
    try {
      // Import API services
      const { rtiApplicationsAPI, servicesAPI, statesAPI, convertConsultationFormToAPI } = await import('../../services/api');

      // Comprehensive frontend validation before submission - only name, email, and mobile are mandatory
      const validationErrors: string[] = [];

      if (!data.fullName || data.fullName.trim().length < 2) {
        validationErrors.push('Full name must be at least 2 characters');
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        validationErrors.push('Valid email is required');
      }

      if (!data.mobile) {
        validationErrors.push('Mobile number is required');
      } else {
        const cleaned = data.mobile.replace(/\D/g, '');
        const length = cleaned.length;
        if (length < 10) {
          validationErrors.push('Mobile number must be at least 10 digits');
        } else if (length > 13) {
          validationErrors.push('Mobile number must not exceed 13 digits');
        }
      }

      // All other fields (rtiQuery, address, pincode) are optional - no validation needed

      if (validationErrors.length > 0) {
        throw new Error(`Validation failed:\n${validationErrors.join('\n')}`);
      }

      // Fetch service by slug to get the correct service_id
      let serviceId: number | null = null;
      try {
        const serviceResponse = await servicesAPI.getBySlug(modelSlug || '') as any;
        if (serviceResponse?.success && serviceResponse?.data?.id) {
          serviceId = Number(serviceResponse.data.id);
          console.log(`✅ Found service ID: ${serviceId} for slug: ${modelSlug}`);
        } else {
          throw new Error('Service not found in response');
        }
      } catch (error) {
        console.error('❌ Could not fetch service from backend:', error);
        // Try to parse model.id as fallback
        if (model && model.id) {
          serviceId = parseInt(model.id);
          console.log(`✅ Using model ID as fallback: ${serviceId}`);
        }
      }

      // If we still don't have a valid serviceId, throw an error
      if (!serviceId || !Number.isInteger(serviceId) || serviceId < 1) {
        const errorMsg = `Unable to determine service ID. Please ensure the service exists in the database for slug: ${modelSlug}`;
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }

      // Fetch state by slug (default to Telangana if not found)
      // Default state_id to 4 (Telangana) based on current database
      let stateId = 4; // Telangana
      try {
        const statesResponse = await statesAPI.getAll() as any;
        if (statesResponse?.success && Array.isArray(statesResponse?.data)) {
          const telanganaState = statesResponse.data.find((s: any) => s.slug === 'telangana');
          if (telanganaState?.id) {
            stateId = Number(telanganaState.id);
            console.log(`✅ Found state ID: ${stateId} for Telangana`);
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch states from backend, using default ID 4 (Telangana):', error);
      }

      // Convert form data to API format
      const apiData = convertConsultationFormToAPI(data, serviceId, stateId);

      // Add payment information to the application
      const applicationData = {
        ...apiData,
        payment_id: paymentId,
        order_id: orderId
      };

      // Log the complete payload for debugging
      console.log('📤 Submitting RTI application with payment:', {
        ...applicationData,
        // Don't log sensitive data in production
        service_id: applicationData.service_id,
        state_id: applicationData.state_id,
        payment_id: applicationData.payment_id,
        order_id: applicationData.order_id,
        field_counts: {
          full_name_length: applicationData.full_name?.length || 0,
          rti_query_length: applicationData.rti_query?.length || 0,
          address_length: applicationData.address?.length || 0
        }
      });

      // Call public API (no authentication required)
      const result = await rtiApplicationsAPI.createPublic(applicationData);

      console.log('✅ Application created successfully:', result);

      // Extract application ID
      let applicationId: string | number = 'N/A';
      if (result && typeof result === 'object' && 'data' in result) {
        const resultData = result.data as any;
        applicationId = resultData?.id || resultData?.insertId || 'N/A';
      }

      // Store success data and show success modal
      setSuccessData({
        applicationId,
        paymentId
      });

      // Close consultation modal and show success modal
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      resetForm();
      resetPayment();
      setIsProcessingPayment(false);
    } catch (error) {
      console.error('❌ Failed to submit application:', error);

      // Extract detailed error information
      let errorMessage = 'Failed to submit application. Please try again.';
      let validationDetails = '';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Check if it's an APIError with validation details
        if ('errors' in error && Array.isArray((error as any).errors)) {
          const apiError = error as any;
          validationDetails = '\n\nValidation Errors:\n' +
            apiError.errors.map((err: any) => `• ${err.field}: ${err.message}`).join('\n');
        }
      }

      // Create detailed error message
      const fullErrorMessage = `❌ Error: ${errorMessage}${validationDetails}\n\nPayment was successful (Payment ID: ${paymentId}, Order ID: ${orderId}) but application submission failed.\n\nPlease contact support with the Payment ID above, or try submitting again.`;

      alert(fullErrorMessage);

      // Don't throw error - allow user to retry
      setIsProcessingPayment(false);
    }
  };

  // Handle form submission - initiate payment first (or skip payment for free services)
  const onSubmitForm = async (data: typeof formData) => {
    if (!model) {
      alert('Service information not available. Please refresh the page.');
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Check if service is free (price = 0) - skip payment for lead generation
      if (model.price === 0 || model.price === null || model.price === undefined) {
        // Free service - submit directly without payment
        console.log('💰 Free service detected, skipping payment and submitting as lead');
        await submitApplicationWithoutPayment(data);
        return;
      }

      // Paid service - initiate payment
      await initiatePayment(
        model,
        {
          name: data.fullName,
          email: data.email,
          mobile: data.mobile
        },
        async (paymentId: string, orderId: string) => {
          // Payment successful, now submit the application
          await submitApplicationAfterPayment(data, paymentId, orderId);
        },
        (errorMessage: string) => {
          // Payment failed
          alert(`❌ Payment failed: ${errorMessage}\n\nPlease try again.`);
          setIsProcessingPayment(false);
        },
        () => {
          // Payment cancelled - close modal and reset form
          handleModalClose();
        }
      );
    } catch (error) {
      console.error('❌ Payment initialization failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
      setIsProcessingPayment(false);
    }
  };

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
    resetPayment();
    setIsProcessingPayment(false);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSuccessData(null);
  };

  // Handle form submit event
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only proceed if not already processing payment
    if (!isProcessingPayment && paymentState.status !== 'processing' && paymentState.status !== 'verifying') {
      handleSubmit(() => onSubmitForm(formData));
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading service...</p>
          </div>
        </div>
        <Footer />
        <LazyChatbot />
      </>
    );
  }

  // If model not found, show 404
  if (!model || !modelSlug) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600">
              {error || "The RTI service you're looking for doesn't exist."}
            </p>
          </div>
        </div>
        <Footer />
        <LazyChatbot />
      </>
    );
  }

  // Generate SEO data
  const canonicalUrl = generateCanonicalUrl(`/services/${modelSlug}`);
  const pageTitle = generatePageTitle(model.name);
  const pageDescription = model.fullDescription || model.description;
  const metaKeywords = generateMetaKeywords(model.name);
  const faqs = generateFAQs(model.name, model.fullDescription);

  // Generate structured data
  const serviceStructuredData = generateServiceStructuredData(model);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(model.name, canonicalUrl);
  const faqStructuredData = generateFAQStructuredData(faqs);

  // Get service images
  const serviceImage = SERVICE_IMAGES[modelSlug];
  const serviceImageX = SERVICE_IMAGES_X[modelSlug];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="author" content="FileMyRTI" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={serviceImage || 'https://filemyrti.com/src/assets/icons/logo.webp'} />
        <meta property="og:site_name" content="FileMyRTI" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={serviceImage || 'https://filemyrti.com/src/assets/icons/logo.webp'} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(serviceStructuredData)}
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

      <Navbar />
      <ResponsiveLayoutStyles />
      <div className="min-h-screen flex flex-col">
        {/* Desktop Sidebar - Fixed on left (hidden on mobile) */}
        <ServiceSidebar model={model} onCTAClick={handleCTAClick} serviceSlug={modelSlug ?? undefined} />

        {/* Main Content - Responsive */}
        <main
          id="main-content"
          className="flex-grow w-full"
          style={{
            marginLeft: 0,
            width: '100%',
            maxWidth: '100%',
            minHeight: 'calc(100vh - 48px)'
          }}
          role="main"
          aria-label="Main content"
        >
          <div className="main-content-responsive">
            {/* Breadcrumb Navigation */}
            <Breadcrumb
              items={[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: model.name, path: `/services/${modelSlug}` }
              ]}
            />

            {/* Service Hero - Appears first on small devices */}
            <div className="md:hidden container-responsive max-w-7xl mx-auto px-4 md:px-6 pt-4">
              <ServiceHero model={model} onCTAClick={handleCTAClick} />
            </div>

            {/* Mobile Sidebar - Appears as second section on small devices */}
            <div className="md:hidden container-responsive max-w-7xl mx-auto px-4 md:px-6 pt-4">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-lg p-4 mb-6 transition-all duration-300">
                {/* Video Section - Mobile (First) */}
                <div ref={videoRef} className="mb-4 bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative w-full bg-black rounded-lg" style={{ paddingBottom: '56.25%' }}>
                    {shouldLoadVideo ? (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={videoConfig.embedUrl}
                        title="RTI Service Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                        <div className="text-white text-sm">Loading video...</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* What Will You Get - Mobile (Second) */}
                <div className="mb-4">
                  <h4 className="text-base font-bold text-white mb-3">What Will You Get:</h4>
                  <ul className="space-y-2">
                    {model.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-white leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button - Mobile */}
                <button
                  onClick={handleCTAClick}
                  className="w-full bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  aria-label={`${model.buttonText} for ${model.name}`}
                >
                  {model.buttonText}
                </button>
              </div>
            </div>

            {/* Main Content */}
            <article className="container-responsive max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8" itemScope itemType="https://schema.org/Service">
              <section className="pb-6 md:pb-12">
                <div className="max-w-7xl mx-auto px-3 md:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    {/* Main Content */}
                    <div className="lg:col-span-4">
                      {/* Service Hero - Hidden on mobile (shown above) */}
                      <div className="hidden md:block">
                        <ServiceHero model={model} onCTAClick={handleCTAClick} />
                      </div>

                      {/* Service Features */}
                      <ServiceFeatures />

                      {/* Service Image */}
                      {serviceImage && (
                        <div className="mb-8">
                          <img
                            src={serviceImage}
                            alt={`${model.name} service illustration showing features and benefits`}
                            className="w-full h-auto rounded-lg shadow-md"
                            style={{ objectFit: 'contain' }}
                            draggable="false"
                            loading="lazy"
                            width="800"
                            height="600"
                            decoding="async"
                          />
                        </div>
                      )}

                      {/* Service Outline */}
                      <ServiceOutline />

                      {/* Why This Service */}
                      <WhyThisService serviceImageX={serviceImageX} serviceName={model.name} />

                      {/* How It Works */}
                      <HowItWorks />

                      {/* Testimonials */}
                      <Testimonials />

                      {/* FAQ Section */}
                      <ServiceFAQ faqs={faqs} />
                    </div>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </main>

        {/* Footer - Responsive */}
        <div
          className="w-full"
          style={{
            marginLeft: 0,
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <div className="footer-responsive">
            <Footer />
          </div>
        </div>

        <LazyChatbot />

        {/* Consultation Modal */}
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          model={model}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting || isProcessingPayment || paymentState.status === 'processing' || paymentState.status === 'verifying' || paymentState.status === 'creating_order'}
          paymentStatus={paymentState.status}
          paymentError={paymentState.error}
          onFieldChange={updateField}
          onSubmit={handleFormSubmit}
        />

        {/* Payment Success Modal */}
        {successData && (
          <PaymentSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={handleSuccessModalClose}
            applicationId={successData.applicationId}
            paymentId={successData.paymentId}
            serviceName={model?.name}
          />
        )}
      </div>
    </>
  );
};
