import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';

export const TermsAndConditions: React.FC = () => {
  const pageTitle = "Terms and Conditions - FileMyRTI | RTI Filing Service";
  const pageDescription = "Read FileMyRTI's Terms and Conditions. Understand our service terms, privacy policy, refund policy, and user responsibilities when using our RTI filing platform.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/terms-and-conditions";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms and Conditions - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/terms-and-conditions"
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://filemyrti.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Terms and Conditions",
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>

      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 md:py-16 lg:py-20">
            <div className="container-responsive max-w-7xl mx-auto px-4">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Terms and Conditions
                </h1>
                <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto">
                  By accessing and using FileMyRTI.com, you agree to the following terms and conditions. These govern your use of our services and your relationship with us. Please read them carefully.
                </p>
              </div>
            </div>
          </section>

          <div className="container-responsive max-w-5xl mx-auto py-8 sm:py-12 px-4">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-gray-600">
                <li>
                  <Link to="/" className="hover:text-primary-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Terms and Conditions</li>
              </ol>
            </nav>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10 space-y-10">
              {/* Section 1 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">1</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Definitions</h2>
                </div>
                <div className="ml-11">
                  <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span><strong className="text-gray-900">"You", "User", or "Client"</strong> refers to any individual or entity using our services.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span><strong className="text-gray-900">"We", "Us", or "Our"</strong> refers to FileMyRTI.com, the service provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span><strong className="text-gray-900">"RTI"</strong> refers to the Right to Information Act, 2005 and the services offered through this platform.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">2</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services Offered</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    FileMyRTI.com facilitates the filing of RTI applications and First Appeals by:
                  </p>
                  <ul className="space-y-2.5 text-gray-700 text-base leading-relaxed mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Drafting legally compliant RTI applications.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Identifying the appropriate Public Information Officers (PIOs).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Dispatching applications via registered or speed post.</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We are an independent support platform and are not affiliated with any government department or agency.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">3</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Privacy and Data Protection</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    We are committed to protecting your privacy in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act):
                  </p>
                  <ul className="space-y-2.5 text-gray-700 text-base leading-relaxed mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Your personal information is collected only for the purpose of processing your RTI application or appeal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>By using our services, you provide informed and voluntary consent for data collection and processing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>We do not sell, rent, or share your personal data with third parties except as required by law.</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed mb-2 font-semibold text-gray-900">Users have the right to:</p>
                  <ul className="space-y-2.5 text-gray-700 text-base leading-relaxed mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Access their data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Withdraw consent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Request correction or deletion of data</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed mb-3">
                    To exercise your rights, email us at{' '}
                    <a href="mailto:Admin@filemyrti.com" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                      Admin@filemyrti.com
                    </a>.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed">
                    All data is stored securely and retained only for the necessary duration (typically up to 90 days post-service completion) unless legally required otherwise.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Refund and Cancellation</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    We maintain a clear and fair refund policy based on the status of your application. To view our detailed policy, visit:{' '}
                    <Link to="/refund-policy" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                      Refund Policy
                    </Link>
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">5</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Limitation of Liability</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    FileMyRTI.com is a facilitation platform and does not guarantee outcomes. We are not liable for:
                  </p>
                  <ul className="space-y-2.5 text-gray-700 text-base leading-relaxed mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Delays or no response from government departments.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Postal service delays or losses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1.5">•</span>
                      <span>Rejections due to incomplete or inaccurate user-provided data.</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Service usage is at your discretion and risk.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">6</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Intellectual Property</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    All content on FileMyRTI.com—including text, design, logos, and processes—is our intellectual property. Any unauthorized use, reproduction, or redistribution is strictly prohibited.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">7</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Third-Party Links</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    Our website may contain links to third-party sites for informational purposes. We do not endorse or control these sites and are not liable for any consequences arising from their use.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">8</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Linking to Our Website</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    You may not create links to FileMyRTI.com without written permission. Unauthorized links are subject to removal and legal action.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">9</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Official Communication</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    All communication from FileMyRTI.com will come only from{' '}
                    <a href="mailto:Admin@filemyrti.com" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                      Admin@filemyrti.com
                    </a>. Ignore any messages from unverified sources claiming to represent us.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">10</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Updates to Terms</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    We may update these terms as required. Updates will be posted on this page, and continued use of our services implies acceptance.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">11</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Governing Law</h2>
                </div>
                <div className="ml-11">
                  <p className="text-gray-700 text-base leading-relaxed">
                    These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
                  </p>
                </div>
              </section>

              {/* Agreement Statement */}
              <div className="bg-gradient-to-r from-blue-50 to-primary-50 border-2 border-primary-200 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-base leading-relaxed font-semibold">
                    By using FileMyRTI.com, you confirm that you have read, understood, and agreed to these terms and our data protection practices in accordance with the DPDP Act, 2023.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

