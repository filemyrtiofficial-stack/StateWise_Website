import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Chatbot } from '../components/common/Chatbot';

export const NotFound: React.FC = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
        <Chatbot />
      </div>
    </>
  );
};

