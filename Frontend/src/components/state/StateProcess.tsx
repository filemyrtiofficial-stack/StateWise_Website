import React from 'react';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface StateProcessProps {
  process?: {
    steps: ProcessStep[];
  };
}

export const StateProcess: React.FC<StateProcessProps> = ({ process }) => {
  if (!process || !process.steps) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple 4-step process to file your RTI application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.steps.map((step) => (
            <div key={step.step} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4 relative z-10">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {step.step < process.steps.length && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-primary-200 -z-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

