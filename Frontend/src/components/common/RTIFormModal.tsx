import React, { useState, useEffect, useRef } from 'react';
import { delhiDepartments } from '../../data/delhiDepartments';

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
    pincode: '',
    acceptTerms: false,
  });
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close department dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target as Node)) {
        setShowDepartmentDropdown(false);
      }
    };

    if (showDepartmentDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDepartmentDropdown]);

  // Filter departments based on search
  const filteredDepartments = delhiDepartments.filter(dept =>
    dept.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  const handleDepartmentSelect = (dept: string) => {
    setFormData({ ...formData, department: dept });
    setDepartmentSearch(dept);
    setShowDepartmentDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate department is selected
    if (!formData.department || !delhiDepartments.includes(formData.department)) {
      alert('Please select a valid department from the list.');
      return;
    }

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
      pincode: '',
      acceptTerms: false,
    });
    setDepartmentSearch('');
    setShowDepartmentDropdown(false);
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
                />
              </div>
            </div>

            <div className="relative" ref={departmentDropdownRef}>
              <label className="block text-xs font-semibold text-gray-700 mb-0.5">
                Department *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required={!formData.department}
                  value={departmentSearch}
                  onChange={(e) => {
                    setDepartmentSearch(e.target.value);
                    setShowDepartmentDropdown(true);
                    if (e.target.value !== formData.department) {
                      setFormData({ ...formData, department: '' });
                    }
                  }}
                  onFocus={() => setShowDepartmentDropdown(true)}
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-200 transition-all ${!formData.department ? 'border-gray-300' : 'border-green-300'
                    }`}
                  aria-required="true"
                  aria-invalid={!formData.department}
                />
                <input
                  type="hidden"
                  name="department"
                  value={formData.department}
                  required
                />
                {showDepartmentDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto overscroll-contain">
                    {filteredDepartments.length > 0 ? (
                      <>
                        {filteredDepartments.slice(0, 100).map((dept, index) => (
                          <button
                            key={`${dept}-${index}`}
                            type="button"
                            onClick={() => handleDepartmentSelect(dept)}
                            className="w-full text-left px-3 py-2.5 text-xs hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 focus:bg-primary-50 focus:text-primary-700 focus:outline-none transition-colors touch-manipulation"
                          >
                            {dept}
                          </button>
                        ))}
                        {filteredDepartments.length > 100 && (
                          <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
                            Showing first 100 results. Refine your search for more specific results.
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="px-3 py-2 text-xs text-gray-500">No departments found. Try a different search term.</div>
                    )}
                  </div>
                )}
              </div>
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
              />
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
              />
            </div>

            <div className="flex items-start gap-1.5 p-2 bg-primary-50 rounded-md border border-primary-200">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
                className="w-3.5 h-3.5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-700 leading-tight">
                I agree to the <a href="/terms-and-conditions" className="text-primary-600 hover:text-primary-700 underline">Terms and Conditions</a> and <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>. <span className="text-red-500">*</span>
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

