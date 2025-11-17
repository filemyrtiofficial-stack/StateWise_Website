import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const StatePage = lazy(() => import('./pages/StatePage').then(module => ({ default: module.StatePage })));
const AboutUs = lazy(() => import('./pages/AboutUs').then(module => ({ default: module.AboutUs })));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions').then(module => ({ default: module.TermsAndConditions })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then(module => ({ default: module.RefundPolicy })));
const Pricing = lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })));
const ContactUs = lazy(() => import('./pages/ContactUs').then(module => ({ default: module.ContactUs })));
const Careers = lazy(() => import('./pages/Careers').then(module => ({ default: module.Careers })));
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const FAQPage = lazy(() => import('./pages/FAQ').then(module => ({ default: module.FAQPage })));
const Blog = lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const RTIModelPage = lazy(() => import('./pages/services/RTIModelPage').then(module => ({ default: module.RTIModelPage })));
const TrackMyRTI = lazy(() => import('./pages/TrackMyRTI').then(module => ({ default: module.TrackMyRTI })));
const TestConnection = lazy(() => import('./pages/TestConnection').then(module => ({ default: module.TestConnection })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/services" element={<Services />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/state/:stateSlug" element={<StatePage />} />
              <Route path="/services/seamless-online-filing" element={<RTIModelPage />} />
              <Route path="/services/anonymous" element={<RTIModelPage />} />
              <Route path="/services/1st-appeal" element={<RTIModelPage />} />
              <Route path="/services/bulk" element={<RTIModelPage />} />
              <Route path="/services/custom-rti" element={<RTIModelPage />} />
              <Route path="/services/15-minute-consultation" element={<RTIModelPage />} />
              <Route path="/track" element={<TrackMyRTI />} />
              <Route path="/trackmyrti" element={<TrackMyRTI />} />
              <Route path="/track-my-rti" element={<TrackMyRTI />} />
              <Route path="/test-connection" element={<TestConnection />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

