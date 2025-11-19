/**
 * Service Sidebar Component
 * Fixed sidebar on desktop, collapsible on mobile
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RTIModel } from '../../types/services';
import { useVideoLazyLoad } from '../../hooks/useVideoLazyLoad';
import { getVideoConfigForService } from '../../constants/services';

interface ServiceSidebarProps {
  model: RTIModel;
  onCTAClick: () => void;
  serviceSlug?: string;
}

export const ServiceSidebar: React.FC<ServiceSidebarProps> = React.memo(({ model, onCTAClick, serviceSlug }) => {
  const navigate = useNavigate();
  const { shouldLoadVideo, videoRef } = useVideoLazyLoad();
  const videoConfig = getVideoConfigForService(serviceSlug);

  return (
    <>
      {/* Desktop Sidebar - Fixed on left */}
      <div
        className="hidden lg:block fixed left-0 top-0 max-w-sm z-[110]"
        style={{
          width: 'min(30vw, 384px)',
          height: '100vh',
          maxHeight: '100vh',
          boxShadow: 'none',
          overflow: 'hidden'
        }}
      >
        <div
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-l-lg border-t border-b border-l border-primary-700 p-6 h-full flex flex-col"
          style={{
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="w-full mb-4 bg-transparent hover:bg-primary-700/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 flex-shrink-0"
            aria-label="Back to home"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-white font-semibold">Back to Home</span>
          </button>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ overflow: 'hidden' }}>
            {/* Video Section */}
            <div ref={videoRef} className="mb-6 mt-4 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-white flex-shrink-0">
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
                    <div className="text-white">Loading video...</div>
                  </div>
                )}
              </div>
            </div>

            {/* What Will You Get */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ overflow: 'hidden' }}>
              <h4 className="text-lg font-bold text-white mb-4 flex-shrink-0">What Will You Get:</h4>
              <div className="flex-1 overflow-y-auto sidebar-features-scroll" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <ul className="space-y-3 pr-2">
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
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 flex-shrink-0">
            <button
              onClick={onCTAClick}
              className="w-full bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-white flex items-center justify-center gap-2"
            >
              {model.buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Hidden (now rendered in main content area for proper ordering) */}
      <div className="hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-lg p-4 mb-6 transition-all duration-300">
        {/* What Will You Get - Mobile */}
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

        {/* Video Section - Mobile */}
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

        {/* CTA Button - Mobile */}
        <button
          onClick={onCTAClick}
          className="w-full bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {model.buttonText}
        </button>
      </div>
    </>
  );
});

ServiceSidebar.displayName = 'ServiceSidebar';

