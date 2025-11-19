/**
 * Custom hook for lazy loading YouTube videos using Intersection Observer
 */

import { useState, useEffect, useRef, RefObject } from 'react';
import { VIDEO_LAZY_LOAD_CONFIG } from '../constants/services';

export const useVideoLazyLoad = (): {
  shouldLoadVideo: boolean;
  videoRef: RefObject<HTMLDivElement>;
} => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const currentRef = videoRef.current;
    if (!currentRef || hasLoadedRef.current) return;

    // Check if element is already visible (for fixed sidebars)
    const checkVisibility = () => {
      const rect = currentRef.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        setShouldLoadVideo(true);
        hasLoadedRef.current = true;
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkVisibility()) {
      return;
    }

    // Set up Intersection Observer for elements not immediately visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoadedRef.current) {
            setShouldLoadVideo(true);
            hasLoadedRef.current = true;
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: VIDEO_LAZY_LOAD_CONFIG.rootMargin,
        threshold: 0.1
      }
    );

    observer.observe(currentRef);

    // Fallback: load after a short delay if observer hasn't triggered
    const fallbackTimer = setTimeout(() => {
      if (!hasLoadedRef.current) {
        setShouldLoadVideo(true);
        hasLoadedRef.current = true;
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return {
    shouldLoadVideo,
    videoRef
  };
};

