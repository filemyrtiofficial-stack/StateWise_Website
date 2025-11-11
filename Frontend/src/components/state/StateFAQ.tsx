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
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container-responsive max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
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

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm md:text-base text-gray-700 font-medium">
              Still have questions? <a href="/contact" className="text-primary-600 hover:text-primary-700 font-semibold underline">Contact us</a> for assistance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

