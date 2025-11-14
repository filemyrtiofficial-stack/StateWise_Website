import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page (0, 0) whenever the route changes.
 * This ensures that when users navigate to a new page, they always start
 * from the top of the page instead of maintaining their previous scroll position.
 * 
 * PLACEMENT:
 * Place this component inside BrowserRouter but outside Routes in App.tsx
 * 
 * EXAMPLE:
 * ```tsx
 * <BrowserRouter>
 *   <ScrollToTop />
 *   <Routes>
 *     ...
 *   </Routes>
 * </BrowserRouter>
 * ```
 * 
 * FOR MODALS:
 * If you have modals that open as separate screens or full-page modals,
 * use the useScrollToTop hook in your modal component:
 * 
 * ```tsx
 * import { useScrollToTop } from '../../hooks/useScrollToTop';
 * 
 * const MyModal = ({ isOpen }) => {
 *   useScrollToTop(isOpen); // Scrolls to top when modal opens
 *   ...
 * };
 * ```
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, or 'smooth' for animated scroll
    });

    // Also reset scroll for any scrollable containers if needed
    // This handles cases where the main content might be in a scrollable div
    const scrollableContainers = document.querySelectorAll('[data-scroll-container]');
    scrollableContainers.forEach((container) => {
      if (container instanceof HTMLElement) {
        container.scrollTop = 0;
        container.scrollLeft = 0;
      }
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

