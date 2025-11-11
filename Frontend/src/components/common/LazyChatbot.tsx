import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy load Chatbot component
const Chatbot = lazy(() => import('./Chatbot').then(module => ({ default: module.Chatbot })));

export const LazyChatbot: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load chatbot after page is interactive (defer non-critical component)
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000); // Load after 2 seconds

    // Also load when user interacts (scroll, click, etc.)
    const handleInteraction = () => {
      if (!shouldLoad) {
        setShouldLoad(true);
      }
    };

    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('click', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [shouldLoad]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  );
};


