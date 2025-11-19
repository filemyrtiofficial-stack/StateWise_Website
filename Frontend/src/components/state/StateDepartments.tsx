import React, { useEffect, useRef, useState, useMemo } from 'react';
import { generatePublicAuthorities } from '../../data/publicAuthorities';

interface StateDepartmentsProps {
  stateName: string;
}

export const StateDepartments: React.FC<StateDepartmentsProps> = ({ stateName }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Get all departments from publicAuthorities.ts (only Core Government Departments)
  const allAuthorities = useMemo(() => generatePublicAuthorities(stateName), [stateName]);

  // Filter to get only Core Government Departments (first 57 items from baseAuthorities)
  const coreDepartments = useMemo(() => {
    // Get the first 57 core departments (before State Corporations and Boards)
    return allAuthorities.slice(0, 57);
  }, [allAuthorities]);

  // Duplicate departments for seamless infinite scroll
  const duplicatedDepartments = useMemo(() => [...coreDepartments, ...coreDepartments], [coreDepartments]);

  // Manual scrolling detection
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let isUserInteracting = false;

    const handleUserScroll = () => {
      if (!isUserInteracting) {
        isUserInteracting = true;
        setIsUserScrolling(true);
      }

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        isUserInteracting = false;
        setIsUserScrolling(false);
      }, 2500);
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2) handleUserScroll();
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
    scrollContainer.addEventListener('touchstart', handleUserScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('touchstart', handleUserScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number | null = null;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    // Calculate item height dynamically
    const calculateItemHeight = () => {
      const firstItem = scrollContainer.querySelector('.department-card') as HTMLElement;
      if (firstItem) {
        const styles = window.getComputedStyle(firstItem);
        return firstItem.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      }
      return 120; // fallback height for department card
    };

    const scroll = () => {
      if (!scrollContainer || isPaused || isUserScrolling) {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        return;
      }

      scrollPosition += scrollSpeed;
      const itemHeight = calculateItemHeight();
      const maxScroll = coreDepartments.length * itemHeight;

      // Reset scroll position when reaching the duplicate set
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop = scrollPosition;
      }

      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling after delay
    const startTimeout = setTimeout(() => {
      if (!isPaused && !isUserScrolling) {
        animationId = requestAnimationFrame(scroll);
      }
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, isUserScrolling, coreDepartments.length]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            File RTI to {stateName} Departments
          </h2>
          <p className="text-xl text-gray-600">
            We help you file RTI applications to any government department in {stateName}
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="departments-scroll-container relative"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#026CB6 #e6f2fa',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onWheel={() => setIsUserScrolling(true)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {duplicatedDepartments.map((department, index) => (
              <div
                key={`${department}-${index}`}
                className="department-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{department}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

