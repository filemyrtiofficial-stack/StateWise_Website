import React from 'react';
import { CTAButton } from '../common/CTAButton';

interface StateCTAProps {
  ctaText: string;
  stateName: string;
}

export const StateCTA: React.FC<StateCTAProps> = ({ ctaText, stateName }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to File Your RTI in {stateName}?
        </h2>
        <p className="text-xl mb-8 text-primary-100">
          Get started today and access government information within 30 days.
        </p>
        <CTAButton
          text={ctaText}
          variant="secondary"
          onClick={() => {
            // Handle CTA - can scroll to form or navigate
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg px-8 py-4"
        />
      </div>
    </section>
  );
};

