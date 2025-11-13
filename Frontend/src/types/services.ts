/**
 * Service-related TypeScript types and interfaces
 */

export interface RTIModel {
  id: string;
  name: string;
  icon: string;
  iconText: string;
  description: string;
  fullDescription: string;
  features: string[];
  price: number;
  originalPrice: number;
  buttonText: string;
}

export interface ServiceImageMapping {
  [key: string]: string;
}

export interface ConsultationFormData {
  fullName: string;
  mobile: string;
  email: string;
  rtiQuery?: string;
  address?: string;
  pincode?: string;
  acceptTerms?: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  location: string;
  rating: number;
  comment: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

