/**
 * Service-related constants and configuration
 */

import { ServiceImageMapping } from '../types/services';
import razorpayImage from '../assets/images/razorpay.jpg';

// Image mappings for service pages
export const SERVICE_IMAGES: ServiceImageMapping = {
  'seamless-online-filing': '/images/SOF.webp',
  'anonymous': '/images/Anony.webp',
  'bulk': '/images/Bulk.webp',
  'custom-rti': '/images/Custom.webp',
  '1st-appeal': '/images/First.webp',
  '15-minute-consultation': '/images/15min.webp'
};

// Image mappings for X versions (inside Why This Service box)
export const SERVICE_IMAGES_X: ServiceImageMapping = {
  'seamless-online-filing': '/images/SOFX.webp',
  'anonymous': '/images/AnonyX.webp',
  'bulk': '/images/BulkX.webp',
  'custom-rti': '/images/CustomX.webp',
  '1st-appeal': '/images/FirstX.webp',
  '15-minute-consultation': '/images/15miX.webp'
};

// YouTube video configuration - default video
export const YOUTUBE_VIDEO_CONFIG = {
  videoId: 'fKam-c_Rugo',
  startTime: 8,
  embedUrl: 'https://www.youtube.com/embed/fKam-c_Rugo?start=8'
};

// Service-specific video mapping
export const SERVICE_VIDEO_CONFIG: Record<string, { videoId: string; startTime?: number }> = {
  'seamless-online-filing': {
    videoId: '0SSzx1LM_IY',
    startTime: 0
  },
  '15-minute-consultation': {
    videoId: 'EPnOzGGTStw',
    startTime: 0
  }
};

/**
 * Get YouTube video configuration for a specific service
 * @param serviceSlug - The service slug (e.g., '15-minute-consultation')
 * @returns YouTube video configuration object
 */
export const getVideoConfigForService = (serviceSlug?: string): typeof YOUTUBE_VIDEO_CONFIG => {
  if (serviceSlug && SERVICE_VIDEO_CONFIG[serviceSlug]) {
    const config = SERVICE_VIDEO_CONFIG[serviceSlug];
    const startTime = config.startTime !== undefined ? config.startTime : 0;
    const embedUrl = startTime > 0
      ? `https://www.youtube.com/embed/${config.videoId}?start=${startTime}&rel=0`
      : `https://www.youtube.com/embed/${config.videoId}?rel=0`;

    return {
      videoId: config.videoId,
      startTime: startTime,
      embedUrl: embedUrl
    };
  }
  return YOUTUBE_VIDEO_CONFIG;
};

// SEO Configuration
export const SEO_CONFIG = {
  siteName: 'FileMyRTI',
  baseUrl: 'https://filemyrti.com',
  defaultImage: 'https://filemyrti.com/src/assets/icons/logo.webp',
  locale: 'en_IN',
  twitterCard: 'summary_large_image'
};

// Payment Configuration
export const PAYMENT_CONFIG = {
  razorpayLogoUrl: razorpayImage,
  rtiFee: 10
};

// Sidebar Configuration
export const SIDEBAR_CONFIG = {
  width: 'min(30vw, 384px)',
  breakpoint: 1024 // lg breakpoint
};

// Video lazy load configuration
export const VIDEO_LAZY_LOAD_CONFIG = {
  rootMargin: '100px' // Start loading 100px before video enters viewport
};

// Success rate for service outline
export const SUCCESS_RATE = 98;

