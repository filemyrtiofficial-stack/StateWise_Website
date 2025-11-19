/**
 * Service Hero Section Component
 * Displays service overview, pricing, and CTA
 */

import React from 'react';
import { RTIModel } from '../../types/services';

interface ServiceHeroProps {
  model: RTIModel;
  onCTAClick: () => void;
}

export const ServiceHero: React.FC<ServiceHeroProps> = React.memo(({ model, onCTAClick }) => {
  return (
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
      <div className="mb-6">
        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">RTI Services</span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-3 md:mb-4">
          {model.name}
        </h2>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
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

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4">
        <div className="flex-shrink-0">
          {model.price === 0 || model.price === null || model.price === undefined ? (
            <span className="text-2xl font-bold text-primary-600">Request Quote</span>
          ) : (
            <>
              <span className="text-sm text-gray-500 line-through">₹ {model.originalPrice.toLocaleString()}.00</span>
              <span className="ml-3 text-2xl font-bold text-primary-600">₹ {model.price.toLocaleString()}.00</span>
            </>
          )}
        </div>
        <button
          onClick={onCTAClick}
          className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 py-3.5 md:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 md:active:scale-100"
        >
          <span className="whitespace-nowrap">{model.buttonText}</span>
        </button>
      </div>
    </div>
  );
});

ServiceHero.displayName = 'ServiceHero';

