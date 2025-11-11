import React, { useState, useEffect } from 'react';

interface RTIFormModalProps {
  stateName: string;
}

export const RTIFormModal: React.FC<RTIFormModalProps> = ({ stateName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    query: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    acceptTerms: false,
  });

  useEffect(() => {
    // Show modal every 30 seconds
    const interval = setInterval(() => {
      setIsOpen(true);
    }, 30000); // 30 seconds

    // Show initial modal after 5 seconds
    const initialTimeout = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you shortly.');
    setIsOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      query: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      acceptTerms: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg max-w-md w-[90vw] sm:w-[400px] shadow-2xl animate-slideUp relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600"></div>

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          ×
        </button>

        <div className="p-3 sm:p-4">
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mb-2">
              <span className="text-lg">📝</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">
              File RTI in {stateName}
            </h2>
            <p className="text-xs text-gray-600">
              Get started in just 2 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
              >
                <option value="">Select Department</option>
                <option value="police">Police Department</option>
                <option value="municipal">Municipal Corporation</option>
                <option value="revenue">Revenue Department</option>
                <option value="education">Education Department</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Your RTI Query *
              </label>
              <textarea
                required
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                rows={2}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all resize-none"
                placeholder="Describe what information you need..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Address *
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all resize-none"
                placeholder="Street Address, Building, Apartment"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Pin Code *
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                maxLength={6}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all"
                placeholder="Pin Code"
              />
            </div>

            <div className="flex items-start gap-1.5 p-2 bg-blue-50 rounded-md border border-blue-200">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
                className="w-3.5 h-3.5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-700 leading-tight">
                I agree to the <a href="/terms-and-conditions" target="_blank" className="text-primary-600 hover:text-primary-700 underline">Terms and Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>. RTI fee ₹10 included. <span className="text-red-500">*</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-md font-semibold text-xs hover:from-primary-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Submit RTI Application →
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-2">
            🔒 Secure & Confidential
          </p>
        </div>
      </div>
    </div>
  );
};

