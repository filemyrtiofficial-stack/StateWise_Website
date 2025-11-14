import { useEffect } from 'react';

/**
 * useScrollToTop Hook
 * 
 * Custom hook that scrolls the window to the top when a condition is met.
 * Useful for modals, drawers, or any component that should reset scroll position when opened.
 * 
 * @param condition - When true, scrolls to top
 * @param behavior - Scroll behavior: 'instant' (immediate) or 'smooth' (animated)
 * 
 * @example
 * // In a modal component:
 * const [isOpen, setIsOpen] = useState(false);
 * useScrollToTop(isOpen); // Scrolls to top when modal opens
 */
export const useScrollToTop = (
  condition: boolean,
  behavior: ScrollBehavior = 'instant'
): void => {
  useEffect(() => {
    if (condition) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });

      // Also reset scroll for any scrollable containers
      const scrollableContainers = document.querySelectorAll('[data-scroll-container]');
      scrollableContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
          container.scrollLeft = 0;
        }
      });
    }
  }, [condition, behavior]);
};

