import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { LazyChatbot } from '../components/common/LazyChatbot';
import { ServiceFAQ } from '../components/services/ServiceFAQ';
import { FAQ } from '../types/services';
import { generateFAQStructuredData } from '../utils/seo';

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');

  const pageTitle = "FAQ - FileMyRTI | Frequently Asked Questions";
  const pageDescription = "Find answers to common questions about RTI filing, our services, pricing, payment, tracking, and more. Get all the information you need to file RTI applications online.";
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : "https://filemyrti.com/faq";
  const ogImage = "https://filemyrti.com/src/assets/icons/logo.webp";

  // FAQ Categories
  const faqCategories = [
    { id: 'general', label: 'General RTI' },
    { id: 'services', label: 'Our Services' },
    { id: 'pricing', label: 'Pricing & Payment' },
    { id: 'filing', label: 'Filing Process' },
    { id: 'tracking', label: 'Tracking & Updates' },
    { id: 'refunds', label: 'Refunds & Cancellations' },
    { id: 'support', label: 'Technical Support' }
  ];

  // General RTI FAQs
  const generalFAQs: FAQ[] = [
    {
      q: 'What is RTI (Right to Information)?',
      a: 'RTI (Right to Information) is a fundamental right granted to Indian citizens under the Right to Information Act, 2005. It empowers citizens to seek information from public authorities, promoting transparency and accountability in governance. Any citizen can request information from government departments, public sector undertakings, and other public authorities.'
    },
    {
      q: 'Who can file an RTI application?',
      a: 'Any citizen of India can file an RTI application. You don\'t need to provide a reason for seeking information. The RTI Act applies to all public authorities at the central, state, and local levels, including government departments, public sector undertakings, and organizations substantially financed by the government.'
    },
    {
      q: 'What information can I seek through RTI?',
      a: 'You can seek any information held by or under the control of a public authority. This includes documents, records, emails, opinions, advices, press releases, circulars, orders, logbooks, contracts, reports, papers, samples, models, and data material in any electronic form. However, certain information is exempted under the Act, such as information that would affect national security, personal information, or information that would impede the process of investigation.'
    },
    {
      q: 'What is the official RTI fee?',
      a: 'The official RTI application fee is ₹10 for central government departments. For state governments, the fee may vary (typically ₹10-50). This fee is separate from our service charges. We handle the RTI fee payment digitally during the submission process, so you don\'t need to worry about separate payments.'
    },
    {
      q: 'How long does it take to get a response?',
      a: 'As per the RTI Act, public authorities must respond within 30 days of receiving the application. In case of information concerning the life or liberty of a person, the response must be provided within 48 hours. If the application is transferred to another authority, the response time is 35 days.'
    },
    {
      q: 'What if I don\'t receive a response?',
      a: 'If you don\'t receive a response within the stipulated time, you can file a First Appeal with the First Appellate Authority (FAA) within 30 days. If the FAA doesn\'t respond or you\'re not satisfied with the response, you can file a Second Appeal with the Central Information Commission (CIC) or State Information Commission (SIC) within 90 days.'
    }
  ];

  // Our Services FAQs
  const servicesFAQs: FAQ[] = [
    {
      q: 'What services does FileMyRTI offer?',
      a: 'FileMyRTI offers comprehensive RTI filing services including: expert drafting of RTI applications, identification of the correct public authority, online submission, dispatch via registered or speed post, application tracking, status updates, First Appeal filing, bulk RTI filing, anonymous RTI filing, and custom RTI solutions for unique requirements.'
    },
    {
      q: 'How does FileMyRTI work?',
      a: 'Our process is simple: 1) You provide your RTI query and details through our online form, 2) Our expert team drafts a legally compliant RTI application, 3) We identify the correct Public Information Officer (PIO), 4) We file your application online or dispatch it via registered post, 5) You receive tracking details and regular status updates via email.'
    },
    {
      q: 'Do I need to visit any office to file RTI?',
      a: 'No, you don\'t need to visit any office. Our entire process is online. You can file your RTI application from the comfort of your home. We handle all the paperwork, drafting, and submission on your behalf. You\'ll receive all updates and documents via email.'
    },
    {
      q: 'Can I file RTI in any language?',
      a: 'Yes, you can file RTI applications in any language. The RTI Act allows applications to be filed in English, Hindi, or the official language of the area. Our team can draft applications in multiple languages based on your preference and the requirements of the public authority.'
    },
    {
      q: 'What is the difference between Basic and Premium plans?',
      a: 'The Basic plan includes shipping charges (₹149), processing charges (₹100), and RTI drafting charges (₹150), totaling ₹471 including GST. The Premium plan includes all Basic features plus a phone consultation with an RTI expert (₹200), totaling ₹707 including GST. The Premium plan is ideal if you need expert guidance on framing your RTI query.'
    },
    {
      q: 'Do you offer bulk RTI filing services?',
      a: 'Yes, we offer bulk RTI filing services for organizations or individuals who need to file multiple RTI applications. We provide special pricing and streamlined processes for bulk filings. Contact us at 91 99111 00589 or email admin@filemyrti.com for a custom quote.'
    },
    {
      q: 'Can I file RTI anonymously?',
      a: 'Yes, we offer anonymous RTI filing services. However, please note that some public authorities may require identification for certain types of information. Our team can guide you on the best approach based on your specific query and the requirements of the public authority.'
    }
  ];

  // Pricing & Payment FAQs
  const pricingFAQs: FAQ[] = [
    {
      q: 'What is included in the RTI filing service charges?',
      a: 'Our service charges include: expert drafting of your RTI application, proper formatting and compliance with RTI Act requirements, identification of the correct authority and PIO, online submission or dispatch via registered/speed post, application tracking, status updates via email, and customer support throughout the process.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major payment methods including credit cards, debit cards, UPI, net banking, and digital wallets through our secure payment gateway (Razorpay). All transactions are encrypted and secure. We do not store your payment card details.'
    },
    {
      q: 'Are there any hidden charges?',
      a: 'No, there are no hidden charges. Our pricing is transparent and includes all costs: shipping charges, processing charges, RTI drafting charges, and GST.'
    },
    {
      q: 'Do you offer discounts for bulk RTI filings?',
      a: 'Yes, we offer special pricing for bulk RTI filings. If you need to file multiple RTI applications, please contact us at 91 99111 00589 or email admin@filemyrti.com for a custom quote. We provide competitive rates for bulk orders.'
    },
    {
      q: 'Can I get a refund if I change my mind?',
      a: 'We maintain a clear refund policy based on the status of your application. If we haven\'t started processing your application, you may be eligible for a partial refund. Please visit our Refund Policy page or contact our support team for detailed information about refund eligibility.'
    }
  ];

  // Filing Process FAQs
  const filingFAQs: FAQ[] = [
    {
      q: 'How long does it take to file my RTI application?',
      a: 'Once you submit your details and complete payment, we typically draft and file your RTI application within 1-2 business days. You\'ll receive confirmation and tracking details via email once it\'s been filed. In urgent cases, we can expedite the process.'
    },
    {
      q: 'What information do I need to provide?',
      a: 'You need to provide: your full name, email address, mobile number, address, pin code, the public authority or department you want to query, and your RTI query or information request. Additional details like urgency level and preferred language are optional.'
    },
    {
      q: 'How do you identify the correct authority?',
      a: 'Our expert team maintains an extensive database of public authorities and their Public Information Officers (PIOs). We verify the correct authority based on your query and ensure your application reaches the right department. This saves you time and ensures your application is processed correctly.'
    },
    {
      q: 'Can I track my RTI application?',
      a: 'Yes, once your RTI is filed, you\'ll receive a tracking number via email. You can monitor the status of your application through our platform or directly with the public authority. We also send regular status updates via email.'
    },
    {
      q: 'What if my RTI application is rejected?',
      a: 'If your RTI application is rejected, we\'ll inform you immediately with the reason for rejection. You can then file a First Appeal with the First Appellate Authority (FAA) within 30 days. We can assist you with filing the First Appeal as well.'
    },
    {
      q: 'Can I modify my RTI query after submission?',
      a: 'Once your RTI application has been filed, it cannot be modified. However, if you need to make changes, you can file a new RTI application with the updated query. We recommend reviewing your query carefully before submission.'
    }
  ];

  // Tracking & Updates FAQs
  const trackingFAQs: FAQ[] = [
    {
      q: 'How will I know when my RTI is filed?',
      a: 'You\'ll receive an email confirmation as soon as your RTI application is filed. The email will include your application reference number, tracking details, and a copy of your filed RTI application for your records.'
    },
    {
      q: 'How often will I receive updates?',
      a: 'You\'ll receive updates at key stages: when your application is filed, when it\'s dispatched (if via post), when the authority acknowledges receipt, and when you receive a response. We also send periodic reminders if there\'s no response within the expected timeframe.'
    },
    {
      q: 'Can I check the status online?',
      a: 'Yes, you can check the status of your RTI application through our platform using your application reference number. You can also track it directly on the official RTI portal or with the public authority using the tracking number provided.'
    },
    {
      q: 'What if I don\'t receive updates?',
      a: 'If you don\'t receive updates, please check your spam folder first. You can also contact our support team at 91 99111 00589 or email admin@filemyrti.com with your application reference number, and we\'ll provide you with the latest status.'
    },
    {
      q: 'How long should I wait for a response?',
      a: 'As per the RTI Act, public authorities must respond within 30 days. If you don\'t receive a response within this period, you can file a First Appeal. We\'ll notify you when the 30-day period is about to expire and guide you on the next steps.'
    }
  ];

  // Refunds & Cancellations FAQs
  const refundsFAQs: FAQ[] = [
    {
      q: 'What is your refund policy?',
      a: 'Our refund policy is based on the request stage: Not eligible for filing (100% refund), Cancelled before drafting (95% refund), Drafted or info pending (Rs. 100 admin fee), Already filed (Not eligible). Refunds are processed within 2–3 business days. Please visit our Refund Policy page for detailed information.'
    },
    {
      q: 'Can I cancel my RTI application after payment?',
      a: 'You can request cancellation before we file your application. Once filed, the application cannot be cancelled as it\'s already submitted to the public authority. However, you can choose not to pursue the response if you no longer need the information.'
    },
    {
      q: 'What if my RTI application is rejected? Will I get a refund?',
      a: 'RTI applications can be rejected by public authorities for valid reasons under the RTI Act (e.g., information is exempted, application is incomplete). In such cases, we cannot provide a refund as we\'ve fulfilled our service obligation. However, we can assist you with filing a First Appeal at an additional charge.'
    },
    {
      q: 'How long does it take to process a refund?',
      a: 'Once your refund is confirmed by our team, we process it within 2–3 business days. Depending on your bank or payment provider, it may take up to 7 working days for the amount to reflect in your account. If you\'ve received a confirmation email from us, your refund is already in motion.'
    }
  ];

  // Technical Support FAQs
  const supportFAQs: FAQ[] = [
    {
      q: 'How can I contact FileMyRTI?',
      a: 'You can contact us via phone at 91 99111 00589, email at admin@filemyrti.com, or through our contact form on the website. Our support team is available to assist you with any queries or concerns.'
    },
    {
      q: 'What are your support hours?',
      a: 'Our support team is available Monday to Saturday, 9:00 AM to 6:00 PM IST. You can reach us via phone, email, or through our website. For urgent queries, please call us directly.'
    },
    {
      q: 'Can I get help with drafting my RTI query?',
      a: 'Yes, our expert team can help you draft your RTI query effectively. If you select the Premium plan, you\'ll get a phone consultation with an RTI expert. You can also contact our support team for guidance on framing your query.'
    },
    {
      q: 'What if I face technical issues on the website?',
      a: 'If you encounter any technical issues, please contact our support team immediately. We\'ll resolve the issue as quickly as possible. You can also try clearing your browser cache or using a different browser.'
    },
    {
      q: 'Is my personal information secure?',
      a: 'Yes, we take data security seriously. Your personal information is encrypted and stored securely. We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act). We do not share your information with third parties except as required for RTI filing or as required by law. Please refer to our Privacy Policy for more details.'
    },
    {
      q: 'Can I file RTI for someone else?',
      a: 'Yes, you can file RTI on behalf of someone else, but you\'ll need to provide their authorization and details. The RTI application should be filed in the name of the person seeking information. We can guide you through this process.'
    }
  ];

  // Get FAQs based on active category
  const getFAQsByCategory = (category: string): FAQ[] => {
    switch (category) {
      case 'general':
        return generalFAQs;
      case 'services':
        return servicesFAQs;
      case 'pricing':
        return pricingFAQs;
      case 'filing':
        return filingFAQs;
      case 'tracking':
        return trackingFAQs;
      case 'refunds':
        return refundsFAQs;
      case 'support':
        return supportFAQs;
      default:
        return generalFAQs;
    }
  };

  // Combine all FAQs for structured data
  const allFAQs: FAQ[] = [
    ...generalFAQs,
    ...servicesFAQs,
    ...pricingFAQs,
    ...filingFAQs,
    ...trackingFAQs,
    ...refundsFAQs,
    ...supportFAQs
  ];

  const faqStructuredData = generateFAQStructuredData(allFAQs);

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "FAQ - FileMyRTI",
    "description": pageDescription,
    "url": "https://filemyrti.com/faq"
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
        "name": "FAQ",
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
        {faqStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-grow bg-gray-50" role="main" aria-label="Main content">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-8 sm:py-12">
            <div className="container-responsive max-w-7xl mx-auto px-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                Frequently Asked Questions
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto">
                Find answers to common questions about RTI filing, our services, pricing, and more. Can't find what you're looking for? Contact our support team.
              </p>
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="py-8 sm:py-12">
            <div className="container-responsive max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Category Tabs */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${activeCategory === category.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                        }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Content */}
              <div className="max-w-4xl mx-auto">
                <ServiceFAQ faqs={getFAQsByCategory(activeCategory)} />
              </div>

              {/* Contact CTA */}
              <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our support team is here to help. Get in touch with us and we'll respond as soon as possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+919911100589"
                    className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us: 91 99111 00589
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <LazyChatbot />
      </div>
    </>
  );
};

