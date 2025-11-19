import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import blackIcon from '../../assets/icons/blackicons.png';
import { newsletterAPI } from '../../services/api';

const FooterComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const result = await newsletterAPI.subscribe({ email: email.trim() });

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Successfully subscribed to newsletter!');
        setEmail('');

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  }, [submitStatus]);

  return (
    <footer className="bg-[#333333] text-white">
      <div className="container-responsive max-w-7xl mx-auto py-8 sm:py-12">
        {/* Top Section - Logo, Tagline, and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 pb-8 border-b border-gray-600">
          {/* Left - Logo and Tagline */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center">
              <img
                src={blackIcon}
                alt="FileMyRTI - File RTI Online | Right to Information Act 2005 | RTI Filing Service Logo"
                className="h-10 sm:h-12 w-auto brightness-0 invert"
                loading="lazy"
                width="120"
                height="48"
              />
            </Link>
            <p className="text-sm md:text-base text-gray-300 text-center md:text-left">
              India's Simplest Way to File RTI Online.
            </p>
          </div>

          {/* Right - Social Media Icons (White squares with dark grey symbols) */}
          <div className="flex items-center gap-2">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/105639903/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#333333]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/profile.php?id=61572512135057" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#333333]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a href="https://x.com/FileMyRTI" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#333333]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/filemyrtiofficial/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#333333]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@FileMyRTI" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-[#333333]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Middle Section - Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-8 border-b border-gray-600">
          {/* Left Column - Contact Information (No heading) */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-300 text-sm leading-relaxed">
                Flat No. 202, Radhakrishna Residency, Kalyannagar Phase 3, Hyderabad - 500045.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919911100589" className="text-gray-300 hover:text-white transition-colors text-sm">
                91 99111 00589
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="https://mail.google.com/mail/?view=cm&to=Admin@filemyrti.com&su=Contact%20from%20FileMyRTI" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">
                Admin@filemyrti.com
              </a>
            </div>
          </div>

          {/* Middle Column - Quick Links (Two columns with divider) */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <div className="flex gap-6">
              {/* Left List */}
              <ul className="space-y-2.5 flex-1">
                <li>
                  <Link to="/services/custom-rti" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    File My RTI Now
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    Who We Are
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    Careers
                  </Link>
                </li>
              </ul>
              {/* Vertical Divider */}
              <div className="w-px bg-gray-600"></div>
              {/* Right List */}
              <ul className="space-y-2.5 flex-1">
                <li>
                  <Link to="/blogs" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-white transition-colors text-sm inline-block">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Remain Updated */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white mb-4">Remain Updated</h4>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="Your Email Address"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {submitStatus === 'success' && (
                <p className="text-green-400 text-xs">{submitMessage}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-xs">{submitMessage}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Sign up'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <div className="text-gray-300 text-sm text-center md:text-left">
            Your Trusted RTI Partner - © 2025 FileMyRTI A Product of Ranazonai Technologies, Built with ❤️ and Dedication.
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 text-sm">
            <Link to="/refund-policy" className="text-gray-300 hover:text-white transition-colors">
              Refund Policy
            </Link>
            <Link to="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              Open RTI Guides on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Footer = memo(FooterComponent);
