import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';
import { PricingSection } from '../components/pricing/PricingSection';
import { ServiceFAQ } from '../components/services/ServiceFAQ';
import { FAQ } from '../types/services';

export const Pricing: React.FC = () => {
  const pageTitle = "Pricing - FileMyRTI | RTI Filing Plans & Pricing";
  const pageDescription = "Choose the perfect RTI filing plan for your needs. Compare Basic and Premium plans with transparent pricing. Get expert RTI drafting, submission, and support services.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/pricing";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // Pricing-related FAQs
  const pricingFAQs: FAQ[] = [
    {
      q: 'What is the difference between Basic and Premium plans?',
      a: 'The Basic plan includes shipping charges (₹149), processing charges (₹100), and RTI drafting charges (₹150), totaling ₹471 including GST. The Premium plan includes all Basic features plus a phone consultation with an RTI expert (₹200), totaling ₹707 including GST.'
    },
    {
      q: 'What is included in the RTI filing service?',
      a: 'Our service includes expert drafting of your RTI application, proper formatting, identification of the correct authority, online submission, and timely dispatch via registered or speed post. We also provide application tracking and status updates.'
    },
    {
      q: 'What are the shipping charges for?',
      a: 'Shipping charges cover the cost of sending your RTI application via registered or speed post to the appropriate government authority. This ensures your application reaches the correct department safely and can be tracked.'
    },
    {
      q: 'Can I get a refund if my RTI application is rejected?',
      a: 'We maintain a clear refund policy based on the status of your application. Please visit our Refund Policy page for detailed information. Generally, if we fail to file your application due to our error, you may be eligible for a refund.'
    },
    {
      q: 'How long does it take to file my RTI application?',
      a: 'Once you submit your details and complete payment, we typically draft and file your RTI application within 1-2 business days. You\'ll receive confirmation and tracking details via email once it\'s been filed.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major payment methods including credit cards, debit cards, UPI, net banking, and digital wallets through our secure payment gateway (Razorpay). All transactions are encrypted and secure.'
    },
    {
      q: 'Do you offer any discounts for bulk RTI filings?',
      a: 'Yes, we offer special pricing for bulk RTI filings. If you need to file multiple RTI applications, please contact us at 91 99111 00589 or email admin@filemyrti.com for a custom quote.'
    },
    {
      q: 'What happens after I select a plan and make payment?',
      a: 'After payment, our expert team will review your RTI query, draft a professional application, identify the correct authority, and file it on your behalf. You\'ll receive regular updates via email and can track the status of your application.'
    },
    {
      q: 'Can I upgrade from Basic to Premium plan later?',
      a: 'If you\'ve already selected the Basic plan, you can contact our support team to add the phone consultation feature. However, we recommend selecting the Premium plan upfront if you think you might need expert consultation.'
    }
  ];

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Pricing - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/pricing"
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
        "name": "Pricing",
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

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Pricing Section */}
          <PricingSection />

          {/* FAQ Section */}
          <div className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="container-responsive max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <ServiceFAQ faqs={pricingFAQs} />
            </div>
          </div>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

