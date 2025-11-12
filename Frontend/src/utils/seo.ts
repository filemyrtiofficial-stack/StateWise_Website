/**
 * SEO utility functions for generating structured data and meta tags
 */

import { RTIModel, FAQ, StructuredData } from '../types/services';
import { SEO_CONFIG } from '../constants/services';

/**
 * Generate service structured data (JSON-LD)
 */
export const generateServiceStructuredData = (
  model: RTIModel
): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: model.name,
    description: model.fullDescription || model.description,
    provider: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.baseUrl,
      logo: SEO_CONFIG.defaultImage
    },
    serviceType: 'RTI Filing Service',
    offers: {
      '@type': 'Offer',
      price: model.price.toString(),
      priceCurrency: 'INR',
      description: model.name
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    }
  };
};

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export const generateBreadcrumbStructuredData = (
  modelName: string,
  canonicalUrl: string
): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SEO_CONFIG.baseUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${SEO_CONFIG.baseUrl}/services`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: modelName,
        item: canonicalUrl
      }
    ]
  };
};

/**
 * Generate FAQ structured data (JSON-LD)
 */
export const generateFAQStructuredData = (faqs: FAQ[]): StructuredData | null => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string): string => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return `${SEO_CONFIG.baseUrl}${path}`;
};

/**
 * Generate page title
 */
export const generatePageTitle = (modelName: string): string => {
  return `${modelName} - ${SEO_CONFIG.siteName} | RTI Filing Service`;
};

/**
 * Generate meta keywords
 */
export const generateMetaKeywords = (modelName: string): string => {
  return `${modelName}, RTI filing, RTI online, Right to Information, RTI Act 2005, RTI application, ${modelName} service, RTI filing service, government information, RTI India`;
};

