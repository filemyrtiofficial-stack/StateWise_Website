import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';

export const NotFound: React.FC = () => {
  const pageTitle = "404 - Page Not Found | FileMyRTI";
  const pageDescription = "The page you're looking for doesn't exist. Return to FileMyRTI homepage to file RTI applications online.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/404";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8">
              The page you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

