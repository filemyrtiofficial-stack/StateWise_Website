import React, { useState } from 'react';
import { ConsultationModal } from '../services/ConsultationModal';
import { getRTIModelBySlug } from '../../data/rtiModels';
import { useConsultationForm } from '../../hooks/useConsultationForm';
import { usePayment } from '../../hooks/usePayment';

export const PricingSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    resetForm
  } = useConsultationForm();

  const { paymentState, initiatePayment, resetPayment } = usePayment();

  const handlePlanClick = (plan: 'basic' | 'premium') => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleApplyNow = () => {
    if (selectedPlan) {
      handlePlanClick(selectedPlan);
    } else {
      // Default to basic plan if no plan selected
      handlePlanClick('basic');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    resetForm();
    resetPayment();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtiModel) return;

    await handleSubmit(async (data) => {
      try {
        await initiatePayment(
          rtiModel,
          {
            name: data.fullName,
            email: data.email,
            mobile: data.mobile
          },
          async (paymentId: string, orderId: string) => {
            // Payment successful - you can handle the submission here
            console.log('Payment successful:', { paymentId, orderId, plan: selectedPlan });
            handleModalClose();
          },
          (errorMessage: string) => {
            alert(`Payment failed: ${errorMessage}`);
          }
        );
      } catch (error) {
        console.error('Payment initialization failed:', error);
        alert('Failed to initialize payment. Please try again.');
      }
    });
  };

  // Get the RTI model for seamless online filing
  const rtiModel = getRTIModelBySlug('seamless-online-filing');

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-gray-50">
      <div className="container-responsive max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Choose the plan that fits your RTI needs
          </h2>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-4">
          {/* Left Column - Pricing Table */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
              Pricing Plans
            </h3>

            {/* Pricing Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 text-xs sm:text-sm font-semibold text-gray-700">Features</th>
                    <th className="text-center py-2 px-3 text-xs sm:text-sm font-semibold text-gray-700">Basic</th>
                    <th className="text-center py-2 px-3 text-xs sm:text-sm font-semibold text-gray-700">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-3 text-xs sm:text-sm text-gray-700">Shipping Charges</td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹149</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹149</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-3 text-xs sm:text-sm text-gray-700">Processing Charges</td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹100</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹100</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-3 text-xs sm:text-sm text-gray-700">RTI Drafting Charges</td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹150</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹150</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-3 text-xs sm:text-sm text-gray-700">Phone from RTI Expert</td>
                    <td className="py-2 px-3 text-center">
                      <svg className="w-4 h-4 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">₹200</span>
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Price Summary */}
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Price</span>
                <div className="flex gap-4 sm:gap-6">
                  <button
                    onClick={() => handlePlanClick('basic')}
                    className="text-xs sm:text-sm font-semibold text-gray-900 w-16 sm:w-20 text-center hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    ₹399
                  </button>
                  <button
                    onClick={() => handlePlanClick('premium')}
                    className="text-xs sm:text-sm font-semibold text-gray-900 w-16 sm:w-20 text-center hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    ₹599
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-xs sm:text-sm font-medium text-gray-700">GST 18%</span>
                <div className="flex gap-4 sm:gap-6">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 w-16 sm:w-20 text-center">₹72</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 w-16 sm:w-20 text-center">₹108</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 bg-gray-50 rounded-lg px-3">
                <span className="text-sm sm:text-base font-bold text-gray-900">Total</span>
                <div className="flex gap-4 sm:gap-6">
                  <button
                    onClick={() => handlePlanClick('basic')}
                    className="text-sm sm:text-base font-bold text-gray-900 w-16 sm:w-20 text-center hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    ₹471
                  </button>
                  <button
                    onClick={() => handlePlanClick('premium')}
                    className="text-sm sm:text-base font-bold text-gray-900 w-16 sm:w-20 text-center hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    ₹707
                  </button>
                </div>
              </div>
            </div>

            {/* Apply Now Button */}
            <button
              onClick={handleApplyNow}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              Apply Now
            </button>
          </div>

          {/* Right Column - What We Do For You */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              What We Do For You
            </h3>

            <div className="space-y-4">
              {/* Dedicated Support */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-0.5">Dedicated Support</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Our expert team is always available to assist you throughout your RTI filing process, ensuring a smooth experience.
                  </p>
                </div>
              </div>

              {/* Hassle-Free Submission */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-0.5">Hassle-Free Submission</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    We handle all the paperwork and submission process for you, making RTI filing as simple as possible.
                  </p>
                </div>
              </div>

              {/* Precise Filing */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-0.5">Precise Filing</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    We ensure your RTI application is filed accurately with the correct authority, reducing the chances of rejection.
                  </p>
                </div>
              </div>

              {/* Expert Drafting */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-0.5">Expert Drafting</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Our legal experts draft your RTI application professionally, ensuring it meets all requirements and maximizes your chances of success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Plan CTA */}
        <div className="bg-gray-100 rounded-xl shadow-md p-5 sm:p-6 mt-6">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Need a Custom Plan?
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              If your RTI needs are unique, we're here to help. Call{' '}
              <a href="tel:+919911100589" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                +91 99111 00589
              </a>
              {' '}or email{' '}
              <a href="mailto:admin@filemyrti.com" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                admin@filemyrti.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {rtiModel && (
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          model={rtiModel}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          paymentStatus={paymentState.status}
          paymentError={paymentState.error}
          onFieldChange={updateField}
          onSubmit={handleFormSubmit}
        />
      )}
    </section>
  );
};

