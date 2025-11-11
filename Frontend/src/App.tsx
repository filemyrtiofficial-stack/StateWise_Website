import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { StatePage } from './pages/StatePage';
import { NotFound } from './pages/NotFound';
import { RTIModelPage } from './pages/services/RTIModelPage';
import { AboutUs } from './pages/AboutUs';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/state/:stateSlug" element={<StatePage />} />
          <Route path="/services/seamless-online-filing" element={<RTIModelPage />} />
          <Route path="/services/anonymous" element={<RTIModelPage />} />
          <Route path="/services/1st-appeal" element={<RTIModelPage />} />
          <Route path="/services/bulk" element={<RTIModelPage />} />
          <Route path="/services/custom-rti" element={<RTIModelPage />} />
          <Route path="/services/15-minute-consultation" element={<RTIModelPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

