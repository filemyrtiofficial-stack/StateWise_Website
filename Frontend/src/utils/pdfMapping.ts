/**
 * Maps department names to their corresponding PDF file paths
 * Handles variations in PDF file naming conventions
 */

interface PDFMapping {
  [key: string]: string;
}

// Helper function to create PDF path from category and department
// Returns the relative path that can be used with import.meta.url or fetch
const createPDFPath = (category: string, fileName: string): string => {
  // For Vite, we'll use the path relative to src/assets
  return `delhi/${category}/${fileName}`;
};

// Mapping of department display names to PDF file names
const departmentToPDFMap: PDFMapping = {
  // RTI Delhi Police & Security
  'RTI Delhi Police': createPDFPath('RTI Delhi Police & Security', 'RTI Template For Delhi Police.pdf'),
  'RTI Delhi Fire Services Department': createPDFPath('RTI Delhi Police & Security', 'RTI Template For Delhi Fire Services Department.pdf'),
  'RTI Delhi Prisons Department': createPDFPath('RTI Delhi Police & Security', 'RTI Template For Delhi Prisoners Department.pdf'),
  'RTI Delhi Home Department': createPDFPath('RTI Delhi Police & Security', 'RTI Template For Delhi Home Department.pdf'),
  'RTI Delhi Judicial Department': createPDFPath('RTI Delhi Police & Security', 'RTI Template For Delhi Judicial Department.pdf'),
  'RTI Delhi Law, Justice & Legislative Affairs Department': createPDFPath('RTI Delhi Police & Security', 'RTI Template For Delhi Law, Justice & Legislative Affairs Department.pdf'),
  'RTI Delhi Disaster Management Department': createPDFPath('RTI Delhi Police & Security', 'RTI Template For  Delhi Disaster Management Department.pdf'),

  // RTI Delhi Municipal & Housing
  'RTI Delhi Municipal Corporation (MCD)': createPDFPath('RTI Delhi Municipal & Housing', 'RTI Template For  Delhi Municipal Corporation (MCD).pdf'),
  'RTI Delhi Urban Development Department': createPDFPath('RTI Delhi Municipal & Housing', 'RTI Template For Delhi Urban Development Department.pdf'),
  'RTI Delhi Housing & Urban Development Department': createPDFPath('RTI Delhi Municipal & Housing', 'RTI Template For  Delhi Housing & Urban Development Department.pdf'),
  'RTI Delhi Public Works Department (PWD)': createPDFPath('RTI Delhi Municipal & Housing', 'RTI Template For Delhi Public Works Department (PWD).pdf'),
  'RTI Delhi Rural Development Department': createPDFPath('RTI Delhi Municipal & Housing', 'RTI Template For Delhi Rural Development Department.pdf'),

  // RTI Delhi Utilities & Infrastructure
  'RTI Delhi Jal Board (DJB)': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Templare For Delhi Jal Board (DJB).pdf'),
  'RTI Delhi Transco Limited (DTL)': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Template For Delhi Transco Limited (DTL).pdf'),
  'RTI Delhi Power Department': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Delhi Power Department.pdf'),
  'RTI Delhi Water Supply Department': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Template For Delhi Water Supply Department.pdf'),
  'RTI Delhi Ground Water Department': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Template for Delhi Ground Water Department.pdf'),
  'RTI Delhi Irrigation & Flood Control Department': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Template for Delhi Irrigation & Flood Control Department.pdf'),
  'RTI Delhi Renewable Energy Department': createPDFPath('RTI Delhi Utilities & Infrastructure', 'RTI Template for Delhi Renewable Energy Department.pdf'),

  // RTI Delhi Government Services
  'RTI Delhi Revenue Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Revenue Department.pdf'),
  'RTI Delhi Education Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Education Department.pdf'),
  'RTI Delhi Health & Family Welfare Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Health & Family Welfare.pdf'),
  'RTI Delhi Transport Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Transport Department.pdf'),
  'RTI Delhi Finance Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Finance Department.pdf'),
  'RTI Delhi Registration & Stamps Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Registration & Stamps Department.pdf'),
  'RTI Delhi Planning Department': createPDFPath('RTI Delhi Government Services', 'RTI Template for Delhi Planning Department.pdf'),

  // RTI Delhi Social Welfare
  'RTI Delhi Social Welfare Department': createPDFPath('RTI Delhi Social Welfare', 'RTI Template for Delhi Social Welfare Department.pdf'),
  'RTI Delhi Scheduled Castes & Scheduled Tribes Welfare Department': createPDFPath('RTI Delhi Social Welfare', 'RTI Template for Delhi Scheduled Castes & Scheduled Tribes Welfare Department.pdf'),
  'RTI Delhi Women & Child Development Department': createPDFPath('RTI Delhi Social Welfare', 'RTI Template for Delhi Women & Child Development Department.pdf'),
  'RTI Delhi Backward Classes Welfare Department': createPDFPath('RTI Delhi Social Welfare', 'RTI Template for Delhi Backward Classes Welfare Department.pdf'),
  'RTI Delhi Minority Affairs Department': createPDFPath('RTI Delhi Social Welfare', 'RTI Template for Delhi Minority Affairs Department.pdf'),
  'RTI Delhi Youth & Sports Department': createPDFPath('RTI Delhi Social Welfare', 'RTI Template for Delhi Youth & Sports Department.pdf'),

  // RTI Delhi Commerce & Industry
  'RTI Delhi Labour Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Labour Department.pdf'),
  'RTI Delhi Industries Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Industries Department.pdf'),
  'RTI Delhi Value Added Tax Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Value Added Tax Department.pdf'),
  'RTI Delhi Food, Civil Supplies & Consumer Affairs Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Food, Civil Supplies & Consumer Affairs Department.pdf'),
  'RTI Delhi Consumer Affairs Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Consumer Affairs Department.pdf'),
  'RTI Delhi Cooperation Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Cooperation Department.pdf'),
  'RTI Delhi Agricultural Marketing Department': createPDFPath('RTI Delhi Commerce & Industry', 'RTI Template for Delhi Agricultural Marketing Department.pdf'),

  // RTI Delhi Environment & Resources
  'RTI Delhi Environment Department': createPDFPath('RTI Delhi Environment & Resources', 'RTI Template for Delhi Environment Department.pdf'),
  'RTI Delhi Forest & Wildlife Department': createPDFPath('RTI Delhi Environment & Resources', 'RTI Template for Delhi Forest & Wildlife Department.pdf'),
  'RTI Delhi Mines & Geology Department': createPDFPath('RTI Delhi Environment & Resources', 'RTI Template for Delhi Mines & Geology Department.pdf'),
  'RTI Delhi Science & Technology Department': createPDFPath('RTI Delhi Environment & Resources', 'RTI Template for Delhi Science & Technology Department.pdf'),

  // RTI Delhi Culture & Tourism
  'RTI Delhi Tourism Department': createPDFPath('RTI Delhi Culture & Tourism', 'RTI Template for Delhi Tourism Department.pdf'),
  'RTI Delhi Art, Culture & Languages Department': createPDFPath('RTI Delhi Culture & Tourism', 'RTI Template for Delhi Art, Culture & Languages Department.pdf'),
  'RTI Delhi Archaeology Department': createPDFPath('RTI Delhi Culture & Tourism', 'RTI Template for Delhi Archaeology Department.pdf'),
  'RTI Delhi Handloom & Handicrafts Department': createPDFPath('RTI Delhi Culture & Tourism', 'RTI Template for Delhi Handloom & Handicrafts Department.pdf'),

  // RTI Delhi Information & Technology
  'RTI Delhi Information & Publicity Department': createPDFPath('RTI Delhi Information & Technology', 'RTI Template for Delhi Information & Publicity Department.pdf'),
  'RTI Delhi Information Technology Department': createPDFPath('RTI Delhi Information & Technology', 'RTI Template for Delhi Information Technology Department.pdf'),
  'RTI Delhi Telecommunications Department': createPDFPath('RTI Delhi Information & Technology', 'RTI Template for Delhi Telecommunications Department.pdf'),
  'RTI Delhi Postal Services Department': createPDFPath('RTI Delhi Information & Technology', 'RTI Template for Delhi Postal Services Department.pdf'),

  // RTI Delhi Financial Services
  'RTI Delhi Banking & Financial Services Department': createPDFPath('RTI Delhi Financial Services', 'RTI Template for Delhi Banking & Financial Services Department.pdf'),
  'RTI Delhi Insurance Department': createPDFPath('RTI Delhi Financial Services', 'RTI Template for Delhi Insurance Department.pdf'),
  'RTI Delhi Pension Department': createPDFPath('RTI Delhi Financial Services', 'RTI Template for Delhi Pension Department.pdf'),
};

/**
 * Get the PDF path for a given department name
 * @param departmentName - The display name of the department
 * @returns The path to the PDF file, or null if not found
 */
export const getPDFPath = (departmentName: string): string | null => {
  return departmentToPDFMap[departmentName] || null;
};

/**
 * Check if a PDF exists for a given department
 * @param departmentName - The display name of the department
 * @returns True if PDF mapping exists, false otherwise
 */
export const hasPDF = (departmentName: string): boolean => {
  return departmentName in departmentToPDFMap;
};

