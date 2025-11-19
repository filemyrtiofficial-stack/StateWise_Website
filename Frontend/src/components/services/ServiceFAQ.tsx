/**
 * Service FAQ Component with Accordion
 */

import React, { useState } from 'react';
import { FAQ } from '../../types/services';

interface ServiceFAQProps {
  faqs: FAQ[];
}

export const ServiceFAQ: React.FC<ServiceFAQProps> = React.memo(({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="rounded-lg shadow-lg border border-gray-200 p-4 md:p-6 lg:p-8 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg overflow-hidden transition-all duration-300 ${openIndex === index
              ? 'border-primary-500 shadow-md'
              : 'border-gray-200 hover:border-primary-300'
              }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-5 py-4 text-left flex justify-between items-start gap-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg transition-colors hover:bg-gray-50"
              aria-expanded={openIndex === index}
            >
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${openIndex === index
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {index + 1}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm md:text-base flex-1 pt-0.5">{faq.q}</h4>
              </div>
              <svg
                className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 mt-1 ${openIndex === index ? 'transform rotate-180' : ''
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="px-5 pb-4 pt-0">
                <div className="pl-10 border-l-3 border-primary-200 bg-primary-50 rounded-r-md p-3">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ServiceFAQ.displayName = 'ServiceFAQ';

