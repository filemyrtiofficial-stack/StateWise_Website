/**
 * RTI Service Models Data
 * Centralized data for all RTI service offerings
 */

import { RTIModel } from '../types/services';

export const rtiModels: Record<string, RTIModel> = {
  'seamless-online-filing': {
    id: '1',
    name: 'Seamless Online Filing',
    icon: '⚡',
    iconText: 'Seamless Online Filing',
    description: 'File RTI applications online easily with expert drafting, submission, and timely dispatch.',
    fullDescription: 'Filing RTI applications online has never been easier. Our seamless online filing service handles everything for you - from expert drafting to submission and timely dispatch. We ensure your application is properly formatted, submitted to the correct authority, and tracked throughout the process. Get your information without the hassle.',
    features: [
      'Expert drafting service',
      'Online submission',
      'Timely dispatch',
      'Application tracking',
      'Proper formatting',
      'Authority verification',
      'Status updates'
    ],
    price: 699,
    originalPrice: 4999,
    buttonText: 'File Now'
  },
  'anonymous': {
    id: '2',
    name: 'Anonymous RTI Filing',
    icon: '🎭',
    iconText: 'ANONYMOUS RTI Filing',
    description: 'Protect your identity with our discreet service for filing RTI applications on your behalf.',
    fullDescription: 'Privacy matters when filing RTI applications. Our anonymous RTI filing service protects your identity while ensuring your application is filed correctly. We handle everything discreetly - from drafting to submission - so you can access government information without revealing your identity. Complete confidentiality guaranteed.',
    features: [
      'Complete anonymity',
      'Discreet filing service',
      'Identity protection',
      'Professional handling',
      'Confidential process',
      'Secure submission',
      'Privacy guaranteed'
    ],
    price: 699,
    originalPrice: 5999,
    buttonText: 'Start Anonymously'
  },
  '1st-appeal': {
    id: '3',
    name: 'Online First Appeal Filing',
    icon: '📋',
    iconText: 'First Appeal',
    description: 'File your First Appeal online with expert drafting, review, and quick submission.',
    fullDescription: 'If your RTI application was rejected or you didn\'t receive a satisfactory response, filing a First Appeal is your next step. Our expert team will help you draft a compelling appeal, review all documentation, and submit it quickly. We understand the appeal process and will ensure your case is presented effectively.',
    features: [
      'Expert appeal drafting',
      'Quick review process',
      'Online submission',
      'Appeal tracking',
      'Documentation review',
      'Legal guidance',
      'Timely filing'
    ],
    price: 699,
    originalPrice: 3999,
    buttonText: 'Appeal Now'
  },
  'bulk': {
    id: '4',
    name: 'Efficient Bulk RTI Filing',
    icon: '📦',
    iconText: 'Efficient Bulk RTI Filing',
    description: 'Manage and submit multiple RTI applications efficiently with our professional bulk service.',
    fullDescription: 'Need to file multiple RTI applications? Our efficient bulk RTI filing service makes it easy. We handle all your applications professionally - from drafting to submission and tracking. Perfect for businesses, organizations, or individuals who need to file multiple RTIs. Get volume discounts and professional service.',
    features: [
      'Multiple RTI management',
      'Bulk submission',
      'Cost-effective pricing',
      'Professional handling',
      'Volume discounts',
      'Centralized tracking',
      'Expert support'
    ],
    price: 0,
    originalPrice: 14999,
    buttonText: 'Request Quote'
  },
  'custom-rti': {
    id: '5',
    name: 'Custom RTI',
    icon: '✏️',
    iconText: 'Custom RTI',
    description: 'Can\'t find the right RTI? Create a personalized application designed for your exact information need.',
    fullDescription: 'Every information need is unique. Our custom RTI service creates a personalized application designed specifically for your exact requirements. Our experts work with you to understand your needs, draft a tailored application, and ensure it gets the information you\'re looking for. Perfect for complex or specialized information requests.',
    features: [
      'Personalized RTI design',
      'Custom application',
      'Expert consultation',
      'Tailored solutions',
      'Specialized drafting',
      'Individual attention',
      'Complete customization'
    ],
    price: 699,
    originalPrice: 3499,
    buttonText: 'Custom RTI'
  },
  '15-minute-consultation': {
    id: '6',
    name: '15 min RTI',
    icon: '⏱️',
    iconText: '15-MIN TALK TO EXPERT',
    description: 'Get personalized advice from legal experts to navigate complex RTI applications effectively.',
    fullDescription: 'RTI applications can be complex, but expert guidance makes all the difference. With our 15-minute consultation service, you\'ll get personalized advice from legal experts to navigate complex RTI applications effectively. Our experienced professionals will help you understand the process, draft your application correctly, and ensure you get the information you need.',
    features: [
      'Expert legal consultation',
      'Personalized RTI guidance',
      'Quick 15-minute session',
      'Professional advice',
      'Application drafting help',
      'Process explanation',
      'Best practices sharing'
    ],
    price: 199,
    originalPrice: 499,
    buttonText: 'Pay Now'
  }
};

/**
 * Get RTI model by slug
 */
export const getRTIModelBySlug = (slug: string): RTIModel | null => {
  return rtiModels[slug] || null;
};

/**
 * Get all RTI model slugs
 */
export const getAllRTIModelSlugs = (): string[] => {
  return Object.keys(rtiModels);
};

