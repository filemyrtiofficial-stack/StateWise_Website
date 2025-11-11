import React, { useState } from 'react';

interface FAQ {
  q: string;
  a: string;
}

interface StateFAQProps {
  faqs: FAQ[];
}

export const StateFAQ: React.FC<StateFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about filing RTI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

