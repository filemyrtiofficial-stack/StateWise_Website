import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Chatbot } from '../components/common/Chatbot';

export const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us - FileMyRTI Telangana</title>
        <meta name="description" content="Learn about FileMyRTI Telangana - Your trusted partner for filing RTI applications online in Telangana. We make the Right to Information process simple, transparent, and accessible." />
        <meta name="keywords" content="About FileMyRTI Telangana, RTI filing service Telangana, Right to Information Telangana, transparency, government information Telangana" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About FileMyRTI Telangana</h1>
                <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                  Empowering Telangana citizens with easy access to government information through the Right to Information Act
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Mission */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To democratize access to government information in Telangana by making the RTI filing process simple, transparent, and accessible to every citizen. We believe that transparency is the cornerstone of democracy, and every Telangana citizen has the right to access information from public authorities.
                  </p>
                </div>

                {/* Vision */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To become Telangana's most trusted platform for RTI filing, helping citizens across the state exercise their fundamental right to information. We envision a future where accessing Telangana government information is as simple as a few clicks, fostering greater transparency and accountability.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose FileMyRTI?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We combine expertise, technology, and dedication to make RTI filing effortless for you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Expert Team */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Team</h3>
                  <p className="text-gray-600">
                    Our team of legal experts and RTI specialists ensures your applications are drafted professionally and comply with all regulations.
                  </p>
                </div>

                {/* Easy Process */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Simple & Fast</h3>
                  <p className="text-gray-600">
                    Our streamlined process makes filing RTI applications quick and hassle-free. No complex paperwork, no long queues.
                  </p>
                </div>

                {/* Transparency */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Transparency</h3>
                  <p className="text-gray-600">
                    Track your application status in real-time. We keep you informed at every step of the process.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-600 mb-2">Integrity</h3>
                  <p className="text-sm text-gray-600">We operate with honesty and ethical practices in everything we do.</p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-600 mb-2">Accessibility</h3>
                  <p className="text-sm text-gray-600">Making RTI filing accessible to everyone, regardless of technical knowledge.</p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-600 mb-2">Excellence</h3>
                  <p className="text-sm text-gray-600">Committed to delivering the highest quality service to our users.</p>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                  <h3 className="text-lg font-bold text-primary-600 mb-2">Empowerment</h3>
                  <p className="text-sm text-gray-600">Empowering citizens to exercise their fundamental right to information.</p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Comprehensive RTI services to help you get the information you need
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert RTI Drafting</h3>
                  <p className="text-gray-700">
                    Our legal experts draft your RTI application ensuring it follows all guidelines and best practices for maximum success.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Online Submission</h3>
                  <p className="text-gray-700">
                    Submit your RTI application online to the correct public authority with all required documentation.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Application Tracking</h3>
                  <p className="text-gray-700">
                    Track your application status in real-time and receive regular updates on the progress of your request.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">First Appeal Filing</h3>
                  <p className="text-gray-700">
                    If your RTI is rejected, we help you file a compelling first appeal with expert drafting and guidance.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk RTI Services</h3>
                  <p className="text-gray-700">
                    Need to file multiple RTIs? Our bulk filing service makes it easy and cost-effective for businesses and organizations.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Consultation</h3>
                  <p className="text-gray-700">
                    Get personalized advice from our RTI experts to navigate complex information requests effectively.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to File Your RTI in Telangana?</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of Telangana citizens who trust FileMyRTI for their RTI filing needs
              </p>
              <Link
                to="/state/telangana"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started Now
              </Link>
            </div>
          </section>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </>
  );
};

