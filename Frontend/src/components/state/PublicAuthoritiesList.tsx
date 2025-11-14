import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePublicAuthorities } from '../../data/publicAuthorities';

interface PublicAuthoritiesListProps {
  authorities?: string[];
  stateName?: string;
  searchQuery?: string;
}

export const PublicAuthoritiesList: React.FC<PublicAuthoritiesListProps> = ({
  authorities,
  stateName = 'Delhi',
  searchQuery: externalSearchQuery
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Use external search query if provided, otherwise use internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  // Generate comprehensive list of 3370 public authorities
  const defaultAuthorities = useMemo(() => generatePublicAuthorities(stateName), [stateName]);

  const publicAuthorities = useMemo(() => authorities || defaultAuthorities, [authorities, defaultAuthorities]);

  // Filter authorities based on search query
  // For Delhi: Only show Delhi authorities, exclude any Hyderabad/Telangana entries
  const filteredAuthorities = useMemo(() => {
    let filtered = publicAuthorities;
    
    // If stateName is Delhi, ensure NO Hyderabad or Telangana entries
    if (stateName.toLowerCase() === 'delhi') {
      filtered = filtered.filter(authority => {
        const lowerAuth = authority.toLowerCase();
        // Exclude any authority containing Hyderabad, Telangana, or other state names
        return !lowerAuth.includes('hyderabad') && 
               !lowerAuth.includes('telangana') &&
               !lowerAuth.includes('rangareddy') &&
               !lowerAuth.includes('warangal') &&
               !lowerAuth.includes('karimnagar');
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(authority =>
        authority.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [publicAuthorities, searchQuery, stateName]);

  // Duplicate authorities for seamless infinite scroll
  const duplicatedAuthorities = useMemo(() => [...filteredAuthorities, ...filteredAuthorities], [filteredAuthorities]);

  // Handle Apply Now button click
  const handleApplyNow = useCallback((authority: string) => {
    navigate(`/services/seamless-online-filing?authority=${encodeURIComponent(authority)}`);
  }, [navigate]);

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
      const firstItem = scrollContainer.querySelector('li');
      if (firstItem) {
        const styles = window.getComputedStyle(firstItem);
        return firstItem.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      }
      return 50; // fallback height
    };

    const scroll = () => {
      if (!scrollContainer || isPaused || isUserScrolling || searchQuery.trim() !== '') {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        return;
      }

      scrollPosition += scrollSpeed;
      const itemHeight = calculateItemHeight();
      const maxScroll = filteredAuthorities.length * itemHeight;

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
      if (!isPaused && !isUserScrolling && !searchQuery.trim()) {
        animationId = requestAnimationFrame(scroll);
      }
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, isUserScrolling, filteredAuthorities.length, searchQuery]);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-full sm:max-w-lg lg:max-w-xl flex flex-col">
        <div
          className="bg-white border-2 border-orange-500 rounded-lg overflow-hidden shadow-xl relative flex flex-col"
          style={{ height: '600px', minHeight: '600px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Title with Search */}
          <div className="bg-orange-50 border-b-2 border-orange-500 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-600 break-words">List of Public Authorities</h3>
                <p className="text-xs sm:text-sm text-orange-700 mt-0.5">Delhi Government Departments</p>
              </div>
              <div className="w-full sm:w-auto flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      if (externalSearchQuery === undefined) {
                        setInternalSearchQuery(e.target.value);
                      }
                      setIsUserScrolling(false);
                    }}
                    placeholder="Search departments..."
                    className="w-full sm:w-56 md:w-64 px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 text-xs sm:text-sm bg-white"
                  />
                  <button
                    type="button"
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 text-orange-500 hover:text-orange-600 transition-colors"
                    title="Search"
                    aria-label="Search"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden public-authorities-scroll"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#f97316 #fef3c7',
              WebkitOverflowScrolling: 'touch',
            }}
            onWheel={() => setIsUserScrolling(true)}
          >
            <ol
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 space-y-2 sm:space-y-2.5 md:space-y-3"
              style={{
                paddingLeft: '1.75rem',
                listStyleType: 'decimal',
                listStylePosition: 'outside',
                margin: 0
              }}
            >
              {duplicatedAuthorities.map((authority, index) => (
                <li
                  key={`${authority}-${index}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-1.5 sm:py-2 text-blue-600 font-medium text-xs sm:text-sm md:text-base leading-relaxed hover:text-blue-700 transition-colors"
                  style={{
                    fontFamily: 'sans-serif',
                    marginLeft: '0.5rem',
                    marginRight: '0.5rem',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  <span className="flex-1 min-w-0 pr-2 sm:pr-0">{authority}</span>
                  <button
                    onClick={() => handleApplyNow(authority)}
                    className="flex-shrink-0 self-start sm:self-auto px-3 py-1.5 sm:px-2.5 sm:py-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-[10px] sm:text-xs font-semibold rounded transition-all whitespace-nowrap shadow-sm hover:shadow-md"
                    title={`Apply for RTI to ${authority}`}
                  >
                    Apply Now
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Gradient fade on top and bottom */}
          <div className="absolute top-20 sm:top-24 md:top-28 left-0 right-0 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 md:h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </div>
  );
};

