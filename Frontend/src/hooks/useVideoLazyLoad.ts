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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: VIDEO_LAZY_LOAD_CONFIG.rootMargin
      }
    );

    const currentRef = videoRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return {
    shouldLoadVideo,
    videoRef
  };
};

