import React from 'react';

export const AboutFileMyRTI: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
            What is FileMyRTI all about?
          </h2>
          <div className="inline-block mb-4 sm:mb-5">
            <span className="relative text-2xl sm:text-3xl font-bold text-black">
              FileMyRTI
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>
            </span>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            FileMyRTI is a legaltech startup empowering the masses through affordable result-driven legal solutions. We're helping people in exercising their Right to Information, Consumer Rights and fixing legal issues.
          </p>

          {/* Video Section */}
          <div className="flex justify-center">
            <div className="bg-white border-2 border-black rounded-lg shadow-lg px-6 sm:px-8 py-4 sm:py-6 inline-block w-full" style={{ maxWidth: '680px' }}>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">FileMy</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">RTI</span>
                </div>
                <p className="text-sm sm:text-base text-black italic">
                  Empowering the masses...
                </p>
                {/* Video Player */}
                <div className="mt-4 w-full">
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      poster="/images/video-poster.jpg"
                    >
                      <source src="/videos/filemyrti-intro.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

