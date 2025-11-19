import React from 'react';
import { Link } from 'react-router-dom';

interface RTILink {
  text: string;
  path: string;
}

export const RTILinksGrid: React.FC = () => {
  // Delhi-specific RTI services organized in 4 columns
  const rtiLinks: RTILink[][] = [
    // Column 1: Delhi Police & Law Enforcement
    [
      { text: 'RTI Delhi Police', path: '/rti/delhi/police' },
      { text: 'RTI Delhi Fire Services', path: '/rti/delhi/fire-services' },
      { text: 'RTI Delhi Prisons Department', path: '/rti/delhi/prisons' },
      { text: 'RTI Delhi Judicial Department', path: '/rti/delhi/judicial' },
      { text: 'RTI Delhi Home Department', path: '/rti/delhi/home' },
      { text: 'RTI Delhi Law & Justice Department', path: '/rti/delhi/law-justice' },
    ],
    // Column 2: Delhi Municipal & Urban Development
    [
      { text: 'RTI Delhi Municipal Corporation (MCD)', path: '/rti/delhi/mcd' },
      { text: 'RTI Delhi Urban Development', path: '/rti/delhi/urban-development' },
      { text: 'RTI Delhi Housing & Urban Development', path: '/rti/delhi/housing' },
      { text: 'RTI Delhi Public Works Department (PWD)', path: '/rti/delhi/pwd' },
      { text: 'RTI Delhi State Housing Board', path: '/rti/delhi/housing-board' },
      { text: 'RTI Delhi Rural Development', path: '/rti/delhi/rural-development' },
    ],
    // Column 3: Delhi Utilities & Infrastructure
    [
      { text: 'RTI Delhi Jal Board (DJB)', path: '/rti/delhi/jal-board' },
      { text: 'RTI Delhi Transco Limited (DTL)', path: '/rti/delhi/transco' },
      { text: 'RTI Delhi Power Department', path: '/rti/delhi/power' },
      { text: 'RTI Delhi Water Supply Department', path: '/rti/delhi/water-supply' },
      { text: 'RTI Delhi Ground Water Department', path: '/rti/delhi/ground-water' },
      { text: 'RTI Delhi Irrigation & Flood Control', path: '/rti/delhi/irrigation' },
    ],
    // Column 4: Delhi Government Departments
    [
      { text: 'RTI Delhi Revenue Department', path: '/rti/delhi/revenue' },
      { text: 'RTI Delhi Education Department', path: '/rti/delhi/education' },
      { text: 'RTI Delhi Health & Family Welfare', path: '/rti/delhi/health' },
      { text: 'RTI Delhi Transport Department', path: '/rti/delhi/transport' },
      { text: 'RTI Delhi Finance Department', path: '/rti/delhi/finance' },
      { text: 'RTI Delhi Registration & Stamps', path: '/rti/delhi/registration' },
    ],
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container-responsive max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {rtiLinks.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-2">
              {column.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.path}
                  className="block text-sm text-gray-700 hover:text-primary-600 hover:underline transition-colors py-1"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

