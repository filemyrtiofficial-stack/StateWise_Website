import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Delhi departments organized in columns (similar to the image layout)
const delhiDepartments = [
  {
    category: 'RTI Delhi Police & Security',
    items: [
      'RTI Delhi Police',
      'RTI Delhi Fire Services Department',
      'RTI Delhi Prisons Department',
      'RTI Delhi Home Department',
      'RTI Delhi Judicial Department',
      'RTI Delhi Law, Justice & Legislative Affairs Department',
      'RTI Delhi Disaster Management Department',
    ],
  },
  {
    category: 'RTI Delhi Municipal & Housing',
    items: [
      'RTI Delhi Municipal Corporation (MCD)',
      'RTI Delhi Urban Development Department',
      'RTI Delhi Housing & Urban Development Department',
      'RTI Delhi Public Works Department (PWD)',
      'RTI Delhi Rural Development Department',
    ],
  },
  {
    category: 'RTI Delhi Utilities & Infrastructure',
    items: [
      'RTI Delhi Jal Board (DJB)',
      'RTI Delhi Transco Limited (DTL)',
      'RTI Delhi Power Department',
      'RTI Delhi Water Supply Department',
      'RTI Delhi Ground Water Department',
      'RTI Delhi Irrigation & Flood Control Department',
      'RTI Delhi Renewable Energy Department',
    ],
  },
  {
    category: 'RTI Delhi Government Services',
    items: [
      'RTI Delhi Revenue Department',
      'RTI Delhi Education Department',
      'RTI Delhi Health & Family Welfare Department',
      'RTI Delhi Transport Department',
      'RTI Delhi Finance Department',
      'RTI Delhi Registration & Stamps Department',
      'RTI Delhi Planning Department',
    ],
  },
  {
    category: 'RTI Delhi Social Welfare',
    items: [
      'RTI Delhi Social Welfare Department',
      'RTI Delhi Scheduled Castes & Scheduled Tribes Welfare Department',
      'RTI Delhi Women & Child Development Department',
      'RTI Delhi Backward Classes Welfare Department',
      'RTI Delhi Minority Affairs Department',
      'RTI Delhi Youth & Sports Department',
    ],
  },
  {
    category: 'RTI Delhi Commerce & Industry',
    items: [
      'RTI Delhi Labour Department',
      'RTI Delhi Industries Department',
      'RTI Delhi Value Added Tax Department',
      'RTI Delhi Food, Civil Supplies & Consumer Affairs Department',
      'RTI Delhi Consumer Affairs Department',
      'RTI Delhi Cooperation Department',
      'RTI Delhi Agricultural Marketing Department',
    ],
  },
  {
    category: 'RTI Delhi Environment & Resources',
    items: [
      'RTI Delhi Environment Department',
      'RTI Delhi Forest & Wildlife Department',
      'RTI Delhi Mines & Geology Department',
      'RTI Delhi Science & Technology Department',
    ],
  },
  {
    category: 'RTI Delhi Culture & Tourism',
    items: [
      'RTI Delhi Tourism Department',
      'RTI Delhi Art, Culture & Languages Department',
      'RTI Delhi Archaeology Department',
      'RTI Delhi Handloom & Handicrafts Department',
    ],
  },
  {
    category: 'RTI Delhi Information & Technology',
    items: [
      'RTI Delhi Information & Publicity Department',
      'RTI Delhi Information Technology Department',
      'RTI Delhi Telecommunications Department',
      'RTI Delhi Postal Services Department',
    ],
  },
  {
    category: 'RTI Delhi Financial Services',
    items: [
      'RTI Delhi Banking & Financial Services Department',
      'RTI Delhi Insurance Department',
      'RTI Delhi Pension Department',
    ],
  },
];

const RTIByDepartmentComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleDepartmentClick = useCallback((department: string) => {
    // Navigate to service page with department info - default to seamless online filing
    navigate('/services/seamless-online-filing', {
      state: { department, serviceName: 'Seamless Online Filing' },
    });
  }, [navigate]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white" aria-label="RTI Services by Delhi Department">
      <div className="container-responsive max-w-7xl mx-auto">
        {/* RTI by Department Columns */}
        <nav aria-label="RTI Department Navigation">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {delhiDepartments.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-1">
                <h3 className="font-bold text-gray-900 mb-2 text-xs">{column.category}</h3>
                {column.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleDepartmentClick(item)}
                    className="block text-xs text-gray-700 hover:text-primary-600 hover:underline transition-colors py-0.5 text-left w-full"
                    aria-label={`File RTI for ${item}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
};

export const RTIByDepartment = memo(RTIByDepartmentComponent);

