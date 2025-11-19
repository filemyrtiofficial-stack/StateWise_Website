import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsultationModal } from '../services/ConsultationModal';
import { rtiModels, getRTIModelBySlug } from '../../data/rtiModels';
import { useConsultationForm } from '../../hooks/useConsultationForm';
import { usePayment } from '../../hooks/usePayment';

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModelSlug, setSelectedModelSlug] = useState<string | null>(null);
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

  const handleApplyClick = (modelSlug: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    navigate(`/services/${modelSlug}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedModelSlug(null);
    resetForm();
    resetPayment();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModelSlug || !rtiModel) return;

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
            console.log('Payment successful:', { paymentId, orderId, model: selectedModelSlug });
            handleModalClose();
          },
          (errorMessage: string) => {
            alert(`Payment failed: ${errorMessage}`);
          },
          () => {
            // Payment cancelled - close modal and reset form
            handleModalClose();
          }
        );
      } catch (error) {
        console.error('Payment initialization failed:', error);
        alert('Failed to initialize payment. Please try again.');
      }
    });
  };

  // Get the selected RTI model
  const rtiModel = selectedModelSlug ? getRTIModelBySlug(selectedModelSlug) : null;

  // Get all 6 RTI models in order
  const allModels = [
    rtiModels['seamless-online-filing'],
    rtiModels['anonymous'],
    rtiModels['1st-appeal'],
    rtiModels['bulk'],
    rtiModels['custom-rti'],
    rtiModels['15-minute-consultation']
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container-responsive max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Choose the plan that fits your RTI needs
          </h2>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-4">
          {/* Left Column - Pricing Plans */}
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Pricing Plans
            </h3>

            {/* Pricing Table - Desktop */}
            <div className="hidden md:block overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <colgroup>
                  <col style={{ width: '45%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '30%' }} />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">Features</th>
                    <th className="text-center py-3 px-3 text-sm font-semibold text-gray-900">Price</th>
                    <th className="text-center py-3 px-3 text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allModels.map((model, index) => {
                    const modelSlug = Object.keys(rtiModels).find(key => rtiModels[key].id === model.id) || '';
                    const displayPrice = model.price === 0 ? 'Request Quote' : `₹${model.price}`;
                    const hasDiscount = model.originalPrice > model.price && model.price > 0;

                    return (
                      <tr
                        key={model.id}
                        className={`border-b border-gray-200 hover:bg-primary-50 transition-all duration-200 ${index === allModels.length - 1 ? 'border-b-0' : ''
                          }`}
                      >
                        <td className="py-3 px-3 text-sm text-gray-900 align-middle">
                          <span className="font-medium">{model.name}</span>
                        </td>
                        <td className="py-3 px-3 text-center align-middle">
                          {model.price === 0 ? (
                            <span className="text-sm text-primary-600 font-semibold">
                              {displayPrice}
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-sm text-gray-900 font-semibold">
                                  {displayPrice}
                                </span>
                                {hasDiscount && (
                                  <span className="text-xs text-gray-400 line-through leading-tight">
                                    ₹{model.originalPrice}
                                  </span>
                                )}
                              </div>
                              {hasDiscount && (
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center align-middle">
                          <button
                            onClick={(e) => handleApplyClick(modelSlug, e)}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md whitespace-nowrap min-w-[80px]"
                            aria-label={`Apply for ${model.name}`}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pricing Cards - Mobile */}
            <div className="md:hidden space-y-3 mb-4">
              {allModels.map((model) => {
                const modelSlug = Object.keys(rtiModels).find(key => rtiModels[key].id === model.id) || '';
                const displayPrice = model.price === 0 ? 'Request Quote' : `₹${model.price}`;
                const hasDiscount = model.originalPrice > model.price && model.price > 0;

                return (
                  <div
                    key={model.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">{model.name}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          {model.price === 0 ? (
                            <span className="text-sm text-primary-600 font-semibold">
                              {displayPrice}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-900 font-semibold">
                                  {displayPrice}
                                </span>
                                {hasDiscount && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{model.originalPrice}
                                  </span>
                                )}
                              </div>
                              {hasDiscount && (
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleApplyClick(modelSlug, e)}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                          aria-label={`Apply for ${model.name}`}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary with GST */}
            <div className="space-y-2.5 mb-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs sm:text-sm font-medium text-gray-700">GST 18%</span>
                <span className="text-xs sm:text-sm text-gray-600">Included in price</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600 text-center">
                  All prices include 18% GST. Final amount shown is inclusive of all taxes.
                </p>
              </div>
            </div>

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
                91 99111 00589
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

