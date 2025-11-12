/**
 * How It Works Component
 * Displays the 4-step process
 */

import React from 'react';

export const HowItWorks: React.FC = React.memo(() => {
  const steps = [
    {
      number: '1',
      title: 'Submit Your Request',
      description: 'Fill out a simple form with your information needs and requirements.'
    },
    {
      number: '2',
      title: 'Expert Review',
      description: 'Our team reviews your request and drafts the perfect RTI application.'
    },
    {
      number: '3',
      title: 'Application Filed',
      description: 'We submit your RTI application to the correct authority on your behalf.'
    },
    {
      number: '4',
      title: 'Track & Receive',
      description: 'Monitor your application status and receive the information you requested.'
    }
  ];

  return (
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">{step.number}</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

HowItWorks.displayName = 'HowItWorks';

