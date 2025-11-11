import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStateData } from '../hooks/useStateData';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { StateHero } from '../components/state/StateHero';
import { StateDepartments } from '../components/state/StateDepartments';
import { StateProcess } from '../components/state/StateProcess';
import { StateInfo } from '../components/state/StateInfo';
import { StateFAQ } from '../components/state/StateFAQ';
import { StateCTA } from '../components/state/StateCTA';
import { AboutFileMyRTI } from '../components/common/AboutFileMyRTI';
import { Chatbot } from '../components/common/Chatbot';

export const Home: React.FC = () => {
  // Default to Delhi for home page
  const stateData = useStateData('delhi');

  if (!stateData) {
    return (
      <>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-8">The requested page is not available.</p>
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
        <Chatbot />
      </div>
    </>
  );
};

