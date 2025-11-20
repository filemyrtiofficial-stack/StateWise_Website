import React, { memo, useState, useRef, useEffect } from 'react';

const AboutFileMyRTIComponent: React.FC = () => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before video enters viewport
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
            What is FileMyRTI all about?
          </h2>
          

          {/* Video Section - Horizontal Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-8 items-stretch">
            {/* Video Part - 68% width */}
            <div className="w-full lg:w-[68%] bg-white border-2 border-black rounded-lg shadow-lg p-4 sm:p-6 flex flex-col">
              <div ref={videoRef} className="w-full flex">
                <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  {shouldLoadVideo ? (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/qKRffCrp71M"
                      title="FileMyRTI About Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-gray-400">Loading video...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Part - 32% width */}
            <div className="w-full lg:w-[32%] bg-white border-2 border-black rounded-lg shadow-lg p-4 sm:p-6 flex flex-col">
              <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">FileMy</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">RTI</span>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-black italic text-center lg:text-left font-semibold">
                  Empowering the masses...
                </p>
                <div className="space-y-3 text-center lg:text-left">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Our mission is to make legal services accessible to everyone, regardless of their background or financial situation. We believe that every citizen has the right to information and justice.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    With our expert team and streamlined processes, we ensure that your RTI applications are filed correctly and efficiently, maximizing your chances of getting the information you need.
                  </p>
                </div>
                <div className="pt-2">
                  <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Expert legal guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Affordable pricing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Quick turnaround time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>100% transparent process</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutFileMyRTI = memo(AboutFileMyRTIComponent);

