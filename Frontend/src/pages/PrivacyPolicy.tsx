import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';

export const PrivacyPolicy: React.FC = () => {
  const pageTitle = "Privacy Policy - FileMyRTI | Data Protection & Privacy";
  const pageDescription = "Read FileMyRTI's Privacy Policy. Learn how we collect, use, protect, and manage your personal data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act).";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/privacy-policy";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/privacy-policy"
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
        "name": "Privacy Policy",
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
                  Privacy Policy
                </h1>
                <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto mb-2">
                  At FileMyRTI.com, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
                <p className="text-base text-primary-200">
                  <strong>Last Updated:</strong> January 2025
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
                <li className="text-gray-900 font-medium">Privacy Policy</li>
              </ol>
            </nav>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10 space-y-10">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  FileMyRTI.com ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we handle your personal information when you visit our website, use our services, or interact with us.
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  By using our services, you consent to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  We collect information that is necessary to provide our RTI filing services. The types of personal data we collect include:
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.1 Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li><strong>Name:</strong> Your full name as required for RTI applications</li>
                  <li><strong>Email Address:</strong> For communication and service updates</li>
                  <li><strong>Phone Number:</strong> For contact and verification purposes</li>
                  <li><strong>Address:</strong> Including street address, city, state, and PIN code</li>
                  <li><strong>RTI Query Details:</strong> The information you provide in your RTI application</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.2 Payment Information</h3>
                <p className="text-gray-700 text-sm sm:text-base mb-2">
                  We process payments through secure third-party payment gateways (Razorpay). We do not store your complete payment card details. Payment information is handled by our payment service providers in accordance with their privacy policies.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.3 Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referral sources and search terms</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li><strong>Service Delivery:</strong> To process and file your RTI applications, including drafting, identifying appropriate authorities, and dispatching applications</li>
                  <li><strong>Communication:</strong> To send you updates about your RTI application status, respond to your inquiries, and provide customer support</li>
                  <li><strong>Payment Processing:</strong> To process payments for our services</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                  <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our website and services</li>
                  <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security threats</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  Under the Digital Personal Data Protection Act, 2023, we process your personal data based on:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li><strong>Consent:</strong> You provide explicit consent when you use our services and agree to our Terms and Conditions</li>
                  <li><strong>Contractual Necessity:</strong> Processing is necessary to fulfill our contract with you (providing RTI filing services)</li>
                  <li><strong>Legal Obligation:</strong> To comply with legal requirements and regulations</li>
                  <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  We do not sell, rent, or trade your personal information. We may share your data only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and providing services (e.g., payment processors, email service providers, postal services)</li>
                  <li><strong>Government Authorities:</strong> As required by law, to comply with legal processes, or to respond to government requests</li>
                  <li><strong>RTI Filing:</strong> Your information is included in RTI applications as required by the Right to Information Act, 2005, and is submitted to the relevant government departments</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="text-gray-700 text-sm sm:text-base mt-3">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Your Rights Under DPDP Act, 2023</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  As a data principal, you have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li><strong>Right to Access:</strong> You can request access to the personal data we hold about you</li>
                  <li><strong>Right to Correction:</strong> You can request correction of inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> You can request deletion of your personal data, subject to legal and contractual obligations</li>
                  <li><strong>Right to Withdraw Consent:</strong> You can withdraw your consent at any time, though this may affect our ability to provide services</li>
                  <li><strong>Right to Grievance Redressal:</strong> You can file a complaint with us or the Data Protection Board if you believe your rights have been violated</li>
                  <li><strong>Right to Nominate:</strong> You can nominate another person to exercise your rights in case of death or incapacity</li>
                </ul>
                <p className="text-gray-700 text-sm sm:text-base mt-3">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="mailto:Admin@filemyrti.com" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                    Admin@filemyrti.com
                  </a>. We will respond to your request within 30 days.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Generally:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Active service data is retained while you use our services</li>
                  <li>After service completion, data is typically retained for up to 90 days for record-keeping and legal compliance</li>
                  <li>Some data may be retained longer if required by law or for legitimate business purposes</li>
                  <li>Upon request for deletion, we will remove your data within 30 days, subject to legal obligations</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files stored on your device that help us:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve website functionality and user experience</li>
                </ul>
                <p className="text-gray-700 text-sm sm:text-base mt-3">
                  You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  Our website may contain links to third-party websites, including government RTI portals and payment gateways. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete such information.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. International Data Transfers</h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  Your personal data is primarily processed and stored in India. If we need to transfer data outside India, we will ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
                </p>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              {/* Section 14 */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
                <p className="text-gray-700 text-sm sm:text-base mb-3">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 font-semibold mb-2">FileMyRTI.com</p>
                  <p className="text-gray-700 text-sm sm:text-base mb-1">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:Admin@filemyrti.com" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                      Admin@filemyrti.com
                    </a>
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <strong>Phone:</strong>{' '}
                    <a href="tel:+919911100589" className="text-primary-600 hover:text-primary-700 underline font-semibold">
                      91 99111 00589
                    </a>
                  </p>
                </div>
                <p className="text-gray-700 text-sm sm:text-base mt-3">
                  All official communication from FileMyRTI.com will come only from Admin@filemyrti.com. Please ignore any messages from unverified sources claiming to represent us.
                </p>
              </section>

              {/* Agreement Statement */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-8">
                <p className="text-gray-900 text-sm sm:text-base font-semibold">
                  By using FileMyRTI.com, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your personal data as described herein, in compliance with the Digital Personal Data Protection Act, 2023.
                </p>
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

