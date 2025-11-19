import React, { useState, memo, useCallback } from 'react';

interface FAQ {
  q: string;
  a: string;
}

interface StateFAQProps {
  faqs: FAQ[];
}

const StateFAQComponent: React.FC<StateFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container-responsive max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about filing RTI. Find answers to common questions and get started with confidence.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${openIndex === index
                ? 'border-primary-500 shadow-lg scale-[1.01]'
                : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 md:px-8 md:py-6 text-left flex justify-between items-start gap-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl transition-colors hover:bg-gray-50"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Question Number Badge */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${openIndex === index
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {index + 1}
                  </div>
                  <span className="text-base md:text-lg font-semibold text-gray-900 flex-1 pt-1">
                    {faq.q}
                  </span>
                </div>
                <svg
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-all duration-300 mt-1 ${openIndex === index ? 'transform rotate-180' : ''
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
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6 pt-0">
                  <div className="pl-12 border-l-4 border-primary-200 bg-primary-50 rounded-r-lg p-4">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StateFAQ = memo(StateFAQComponent);

