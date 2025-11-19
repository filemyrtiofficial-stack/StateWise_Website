import React from 'react';

interface StateInfoProps {
  highlights: string[];
  languages: string[];
  commission?: string;
  fee?: string;
  stateName: string;
}

export const StateInfo: React.FC<StateInfoProps> = ({
  highlights,
  languages,
  commission,
  fee,
  stateName,
}) => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-primary-50">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              RTI in {stateName}
            </h2>
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-700">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Information</h3>
            <dl className="space-y-4">
              {commission && (
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Governing Commission
                  </dt>
                  <dd className="text-lg text-gray-900">{commission}</dd>
                </div>
              )}
              {fee && (
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Official RTI Fee
                  </dt>
                  <dd className="text-lg text-gray-900">{fee}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Supported Languages
                </dt>
                <dd className="text-lg text-gray-900">
                  {languages.join(', ')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Response Time
                </dt>
                <dd className="text-lg text-gray-900">
                  Within 30 days as per RTI Act
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

