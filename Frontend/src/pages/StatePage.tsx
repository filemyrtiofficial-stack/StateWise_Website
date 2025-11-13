import React, { lazy, Suspense, useDeferredValue } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStateData, getStateSlugFromSubdomain } from '../hooks/useStateData';
import { LazyChatbot } from '../components/common/LazyChatbot';
import { useParams, Link } from 'react-router-dom';

// Lazy load Navbar and Footer for better initial load
const Navbar = lazy(() => import('../components/common/Navbar').then(m => ({ default: m.Navbar })));
const Footer = lazy(() => import('../components/common/Footer').then(m => ({ default: m.Footer })));

// Lazy load heavy components for better performance
const StateHero = lazy(() => import('../components/state/StateHero').then(m => ({ default: m.StateHero })));
const StateDepartments = lazy(() => import('../components/state/StateDepartments').then(m => ({ default: m.StateDepartments })));
const StateProcess = lazy(() => import('../components/state/StateProcess').then(m => ({ default: m.StateProcess })));
const StateFAQ = lazy(() => import('../components/state/StateFAQ').then(m => ({ default: m.StateFAQ })));
const StateCTA = lazy(() => import('../components/state/StateCTA').then(m => ({ default: m.StateCTA })));
const AboutFileMyRTI = lazy(() => import('../components/common/AboutFileMyRTI').then(m => ({ default: m.AboutFileMyRTI })));
const RTIByDepartment = lazy(() => import('../components/common/RTIByDepartment').then(m => ({ default: m.RTIByDepartment })));

// Lightweight loading placeholder
const ComponentLoader = () => <div className="min-h-[200px]" />;

export const StatePage: React.FC = () => {
  // Try to get state from route param first, then fallback to subdomain, then default to delhi
  const { stateSlug } = useParams<{ stateSlug?: string }>();
  const subdomainSlug = getStateSlugFromSubdomain();
  const effectiveSlug = stateSlug || subdomainSlug || 'delhi'; // Default to delhi if no slug provided

  const { stateData, isLoading } = useStateData(effectiveSlug);

  // Defer non-critical state updates to reduce TBT
  const deferredStateData = useDeferredValue(stateData);

  // Show minimal loading state only if no static data available
  if (isLoading && !stateData) {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <Suspense fallback={<div className="h-16 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading state data...</p>
            </div>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <LazyChatbot />
        </div>
      </>
    );
  }

  // If state not found, show proper 404 with navigation
  if (!deferredStateData) {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <Suspense fallback={<div className="h-16 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">State Not Found</h1>
              <p className="text-gray-600 mb-8">The requested state page is not available.</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Go Back Home
              </Link>
            </div>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <LazyChatbot />
        </div>
      </>
    );
  }

  // Render appropriate hero component based on design theme
  const renderHero = () => {
    return <StateHero hero={deferredStateData.hero} stateName={deferredStateData.name} stateSlug={deferredStateData.slug} />;
  };

  // SEO Metadata - use deferred value to reduce blocking
  const pageTitle = `File RTI Online in ${deferredStateData.name} - FileMyRTI`;
  const pageDescription = deferredStateData.hero.subtitle || `File RTI applications online in ${deferredStateData.name} with FileMyRTI. Expert drafting, online submission, and real-time tracking. Get government information through Right to Information Act 2005.`;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : `https://${deferredStateData.slug}.filemyrti.com`;
  const ogImage = `https://filemyrti.com/src/assets/icons/logo.webp`;

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "RTI Filing Service",
    "provider": {
      "@type": "Organization",
      "name": "FileMyRTI",
      "url": "https://filemyrti.com",
      "logo": "https://filemyrti.com/src/assets/icons/logo.webp"
    },
    "areaServed": {
      "@type": "State",
      "name": deferredStateData.name
    },
    "description": pageDescription,
    "name": `RTI Filing Service in ${deferredStateData.name}`
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
        "name": `RTI in ${deferredStateData.name}`,
        "item": canonicalUrl
      }
    ]
  };

  const faqStructuredData = deferredStateData.faqs && deferredStateData.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": deferredStateData.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question || faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || faq.a
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`RTI, ${deferredStateData.name}, Right to Information, File RTI Online, ${deferredStateData.name} RTI, RTI Act 2005, ${deferredStateData.name} government information, RTI filing ${deferredStateData.name}, RTI application ${deferredStateData.name}, ${deferredStateData.name} RTI commission`} />
        <meta name="author" content="FileMyRTI" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
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
        <header role="banner">
          <Suspense fallback={<div className="h-16 bg-white" />}>
            <Navbar />
          </Suspense>
        </header>
        <main className="flex-grow" role="main" aria-label="Main content">
          <Suspense fallback={<ComponentLoader />}>
            {renderHero()}
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <StateDepartments stateName={deferredStateData.name} />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <StateProcess process={deferredStateData.process} />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <AboutFileMyRTI />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <RTIByDepartment />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <StateFAQ faqs={deferredStateData.faqs} />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <StateCTA ctaText={deferredStateData.hero.cta} stateName={deferredStateData.name} />
          </Suspense>
        </main>
        <footer role="contentinfo">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </footer>
        {/* <RTIFormModal stateName={stateData.name} /> */}
        <LazyChatbot />
      </div>
    </>
  );
};

