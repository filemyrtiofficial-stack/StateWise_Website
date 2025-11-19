/**
 * Why This Service Component
 * Displays 4 key reasons with visual elements
 */

import React from 'react';

interface WhyThisServiceProps {
  serviceImageX?: string;
  serviceName?: string;
}

export const WhyThisService: React.FC<WhyThisServiceProps> = React.memo(({ serviceImageX, serviceName }) => {
  const reasons = [
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Expert Professional Service',
      description: 'Our team of experienced professionals ensures your RTI application is handled with the utmost care and expertise.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Time-Saving Convenience',
      description: 'Save valuable time by letting us handle all the paperwork, drafting, and submission process.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Guaranteed Compliance',
      description: 'We ensure your RTI application follows all legal requirements and guidelines, reducing the risk of rejection.'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Complete Transparency',
      description: 'Track your application status in real-time and stay informed throughout the entire process.'
    }
  ];

  return (
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
      {/* Title with underline */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why This Service?</h2>
        <div className="h-1 bg-primary-600 w-48 rounded"></div>
      </div>

      {/* Main Content: Large 4 and Cards Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Side - Large Number 4 */}
        <div className="flex-shrink-0 relative">
          <div className="relative flex items-center gap-4">
            {/* Large outlined 4 */}
            <div className="relative">
              <span
                className="text-[180px] font-bold text-primary-600 leading-none"
                style={{
                  WebkitTextStroke: '6px #026CB6',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
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
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="border-t-2 border-l-2 border-b border-r border-primary-600 rounded-lg p-3 shadow-md relative z-0 flex items-start gap-3"
              style={{ borderBottomColor: '#93c5fd', borderRightColor: '#93c5fd' }}
            >
              <div className="flex-shrink-0">{reason.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-primary-600 text-sm mb-1">{reason.title}</h4>
                <p className="text-primary-600 text-xs leading-snug">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Image X version inside Why This Service box */}
      {serviceImageX && (
        <div className="mt-8">
          <img
            src={serviceImageX}
            alt={`${serviceName || 'RTI Service'} - Features`}
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
    </div>
  );
});

WhyThisService.displayName = 'WhyThisService';

