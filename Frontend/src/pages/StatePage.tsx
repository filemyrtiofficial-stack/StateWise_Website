import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStateData, getStateSlugFromSubdomain } from '../hooks/useStateData';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { StateHero } from '../components/state/StateHero';
import { StateDepartments } from '../components/state/StateDepartments';
import { StateProcess } from '../components/state/StateProcess';
import { StateInfo } from '../components/state/StateInfo';
import { StateFAQ } from '../components/state/StateFAQ';
import { StateCTA } from '../components/state/StateCTA';
import { AboutFileMyRTI } from '../components/common/AboutFileMyRTI';
// import { RTIFormModal } from '../components/common/RTIFormModal';
import { Chatbot } from '../components/common/Chatbot';
import { useParams, Link } from 'react-router-dom';

export const StatePage: React.FC = () => {
  // Try to get state from route param first, then fallback to subdomain
  const { stateSlug } = useParams<{ stateSlug?: string }>();
  const subdomainSlug = getStateSlugFromSubdomain();
  const effectiveSlug = stateSlug || subdomainSlug || '';

  const stateData = useStateData(effectiveSlug);

  if (!stateData) {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <Navbar />
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
          <Footer />
          <Chatbot />
        </div>
      </>
    );
  }

  // Render appropriate hero component based on design theme
  const renderHero = () => {
    return <StateHero hero={stateData.hero} stateName={stateData.name} stateSlug={stateData.slug} />;
  };

  // SEO Metadata
  const pageTitle = `File RTI Online in ${stateData.name} - FileMyRTI`;
  const pageDescription = stateData.hero.subtitle;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`RTI, ${stateData.name}, Right to Information, File RTI Online, ${stateData.name} RTI`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://${stateData.slug}.filemyrti.com`} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {renderHero()}

          <StateDepartments stateName={stateData.name} />
          <StateProcess process={stateData.process} />
          <StateInfo
            highlights={stateData.highlights}
            languages={stateData.languages}
            commission={stateData.commission}
            fee={stateData.fee}
            stateName={stateData.name}
          />
          <AboutFileMyRTI />
          <StateFAQ faqs={stateData.faqs} />
          <StateCTA ctaText={stateData.hero.cta} stateName={stateData.name} />
        </main>
        <Footer />
        {/* <RTIFormModal stateName={stateData.name} /> */}
        <Chatbot />
      </div>
    </>
  );
};

