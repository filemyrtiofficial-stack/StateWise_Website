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
import { useRTIService } from '../../hooks/useRTIService';
import { useConsultationForm } from '../../hooks/useConsultationForm';
import { SERVICE_IMAGES, SERVICE_IMAGES_X } from '../../constants/services';
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

/**
 * Responsive layout styles for sidebar offset
 */
const ResponsiveLayoutStyles: React.FC = () => (
  <style>{`
    @media (min-width: 1024px) {
      .navbar-responsive,
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form submission
  const onSubmitForm = async (data: typeof formData) => {
    try {
      // Import API services
      const { rtiApplicationsAPI, servicesAPI, convertConsultationFormToAPI } = await import('../../services/api');

      // Fetch service by slug to get the correct service_id
      let serviceId = 1; // Default fallback
      try {
        const serviceResponse = await servicesAPI.getBySlug(modelSlug || '') as any;
        if (serviceResponse?.success && serviceResponse?.data?.id) {
          serviceId = Number(serviceResponse.data.id) || 1;
          console.log(`Found service ID: ${serviceId} for slug: ${modelSlug}`);
        }
      } catch (error) {
        console.warn('Could not fetch service from backend, using default ID:', error);
        // Try to parse model.id as fallback
        if (model) {
          serviceId = parseInt(model.id) || 1;
        }
      }

      // Default state_id to 1 (Telangana) - you can make this dynamic later
      // TODO: Add state selection in the form or get from URL/context
      const stateId = 1;

      // Validate required fields
      if (!data.rtiQuery || data.rtiQuery.trim() === '') {
        throw new Error('RTI query is required');
      }

      // Convert form data to API format
      const apiData = convertConsultationFormToAPI(data, serviceId, stateId);

      console.log('📤 Submitting RTI application:', apiData);

      // Call public API (no authentication required)
      const result = await rtiApplicationsAPI.createPublic(apiData);

      console.log('✅ Application created successfully:', result);

      // Show success message
      let applicationId = 'N/A';
      if (result && typeof result === 'object' && 'data' in result) {
        const resultData = result.data as any;
        applicationId = resultData?.id || resultData?.insertId || 'N/A';
      }
      alert(`✅ RTI application submitted successfully!\n\nApplication ID: ${applicationId}\n\nYour application has been saved and will be processed.`);

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('❌ Failed to submit application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      alert(`❌ Error: ${errorMessage}\n\nPlease check all fields are filled correctly and try again.`);
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Handle form submit event
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(() => onSubmitForm(formData));
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
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
        <Navbar />
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

      <div className="min-h-screen flex flex-col">
        {/* Sidebar */}
        <ServiceSidebar model={model} onCTAClick={handleCTAClick} />

        {/* Navbar - Responsive */}
        <div
          className="w-full sticky top-0 z-[100] lg:max-w-full"
          style={{
            marginLeft: 0,
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <ResponsiveLayoutStyles />
          <div className="navbar-responsive">
            <Navbar />
          </div>
        </div>

        {/* Main Content - Responsive */}
        <main
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

            {/* Main Content */}
            <article className="container-responsive max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8" itemScope itemType="https://schema.org/Service">
              <section className="pb-6 md:pb-12">
                <div className="max-w-7xl mx-auto px-3 md:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    {/* Main Content */}
                    <div className="lg:col-span-4">
                      {/* Service Hero */}
                      <ServiceHero model={model} onCTAClick={handleCTAClick} />

                      {/* Service Features */}
                      <ServiceFeatures />

                      {/* Service Image */}
                      {serviceImage && (
                        <div className="mb-8">
                          <img
                            src={serviceImage}
                            alt={model.name}
                            className="w-full h-auto rounded-lg shadow-md"
                            style={{ objectFit: 'contain' }}
                            draggable="false"
                            loading="lazy"
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
          isSubmitting={isSubmitting}
          onFieldChange={updateField}
          onSubmit={handleFormSubmit}
        />
      </div>
    </>
  );
};
