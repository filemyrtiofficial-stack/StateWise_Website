import React, { useState, memo, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/icons/logo.webp';

const NavbarComponent: React.FC = () => {
  const location = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check if we're on a service page (has sidebar)
  const isServicePage = location.pathname.startsWith('/services/');

  // Check if we're on the homepage - show social media sidebar only on homepage
  // FILE: Frontend/src/components/common/Navbar.tsx - Social media sidebar only on homepage
  const isHomepage = location.pathname === '/';

  const handleServicesMouseEnter = useCallback(() => setIsServicesOpen(true), []);
  const handleServicesMouseLeave = useCallback(() => setIsServicesOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
  const toggleMobileServices = useCallback(() => setIsMobileServicesOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    // Close on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      {/* Social Media Bar - Only shown on homepage, hidden on small screens, visible on large screens */}
      {/* FILE: Frontend/src/components/common/Navbar.tsx - Social media sidebar conditionally rendered only on homepage, hidden on mobile */}
      {isHomepage && (
        <div className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex-col justify-start gap-1.5 bg-white border-t border-l border-gray-300 rounded-l-lg shadow-2xl p-1.5">
          {/* X (Twitter) */}
          <a
            href="https://x.com/FileMyRTI"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110"
            aria-label="X (Twitter)"
            title="X (Twitter)"
          >
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919911100589"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@FileMyRTI"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110"
            aria-label="YouTube"
            title="YouTube"
          >
            <svg className="w-4 h-4 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61572512135057"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110"
            aria-label="Facebook"
            title="Facebook"
          >
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 23.504 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/filemyrtiofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg className="w-4 h-4 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/105639903/admin/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg className="w-4 h-4 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      )}

      {/* Main Navbar */}
      {/* FILE: Frontend/src/components/common/Navbar.tsx - Conditional padding: Navbar background flush with sidebar, but content has responsive left padding (16px mobile, 24px desktop) for spacing */}
      {/* On service pages, sticky is handled by the wrapper div, so we use relative here */}
      <nav className={`bg-white shadow-md ${isServicePage ? 'ml-0 pl-0 relative' : 'sticky top-0 z-[100]'}`}>
        <div className={isServicePage ? "w-full pl-4 md:pl-6 pr-4 md:pr-6" : "container-responsive max-w-7xl mx-auto"}>
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="FileMyRTI - File RTI Online | Right to Information Act 2005 | RTI Filing Service"
                  className="h-8 w-auto"
                  loading="eager"
                  fetchPriority="high"
                  width="120"
                  height="32"
                  decoding="async"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/about-us" className="text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm">
                About us
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm">
                  Services
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isServicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link to="/services/anonymous" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-sm">
                      Anonymous RTI
                    </Link>
                    <Link to="/services/bulk" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-sm">
                      Bulk RTI Filing
                    </Link>
                    <Link to="/services/seamless-online-filing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-sm">
                      Seamless Online Filing
                    </Link>
                    <Link to="/services/15-minute-consultation" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-sm">
                      15 Minute Consultation
                    </Link>
                    <Link to="/services/1st-appeal" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-sm">
                      1st Appeal
                    </Link>
                    <Link to="/services/custom-rti" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-sm">
                      Custom RTI
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm">
                Pricing
              </Link>
              <Link to="/blogs" className="text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm">
                Blogs
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm">
                Contact us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-primary-600 hover:text-primary-700"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
          )}

          {/* Mobile Menu Panel - Slides in from left */}
          <div
            ref={mobileMenuRef}
            className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center">
                <img
                  src={logo}
                  alt="FileMyRTI Logo"
                  className="h-8 w-auto"
                  loading="eager"
                  width="120"
                  height="32"
                />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-primary-600 transition-colors p-2"
                aria-label="Close mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="overflow-y-auto h-[calc(100vh-64px)] py-4">
              <div className="flex flex-col space-y-1">
                <Link
                  to="/about-us"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors font-medium px-4 py-3"
                >
                  About us
                </Link>

                {/* Services Dropdown in Mobile */}
                <div className="px-4">
                  <button
                    onClick={toggleMobileServices}
                    className="w-full flex items-center justify-between text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors font-medium py-3"
                    aria-expanded={isMobileServicesOpen}
                    aria-label="Toggle Services menu"
                  >
                    <span>Services</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="flex flex-col space-y-1 ml-4 mt-1">
                      <Link
                        to="/services/anonymous"
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors text-sm px-4 py-2 rounded"
                      >
                        Anonymous RTI
                      </Link>
                      <Link
                        to="/services/bulk"
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors text-sm px-4 py-2 rounded"
                      >
                        Bulk RTI Filing
                      </Link>
                      <Link
                        to="/services/seamless-online-filing"
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors text-sm px-4 py-2 rounded"
                      >
                        Seamless Online Filing
                      </Link>
                      <Link
                        to="/services/15-minute-consultation"
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors text-sm px-4 py-2 rounded"
                      >
                        15 Minute Consultation
                      </Link>
                      <Link
                        to="/services/1st-appeal"
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors text-sm px-4 py-2 rounded"
                      >
                        1st Appeal
                      </Link>
                      <Link
                        to="/services/custom-rti"
                        onClick={closeMobileMenu}
                        className="text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors text-sm px-4 py-2 rounded"
                      >
                        Custom RTI
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  to="/pricing"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors font-medium px-4 py-3"
                >
                  Pricing
                </Link>
                <Link
                  to="/blogs"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors font-medium px-4 py-3"
                >
                  Blogs
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors font-medium px-4 py-3"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export const Navbar = memo(NavbarComponent);

