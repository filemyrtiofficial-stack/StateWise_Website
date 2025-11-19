export interface StateHero {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export interface StateFAQ {
  q: string;
  a: string;
}

export interface StateData {
  name: string;
  slug: string;
  languages: string[];
  hero: StateHero;
  departments: string[];
  highlights: string[];
  faqs: StateFAQ[];
  description?: string;
  rtiPortalUrl?: string;
  process?: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
    }>;
  };
  commission?: string;
  fee?: string;
  designTheme?: 'telangana' | 'default'; // Design theme for different layouts
}

export const states: Record<string, StateData> = {
  'delhi': {
    name: "Delhi",
    slug: "delhi",
    languages: ["English", "Hindi"],
    designTheme: "telangana",
    hero: {
      title: "File RTI Online in Delhi — Simplest Way to Get Government Information",
      subtitle: "Submit RTI applications for any Delhi government department — we handle drafting, formatting, and submission for you.",
      image: "/images/delhi-banner.jpg",
      cta: "File Delhi RTI Now",
    },
    departments: [
      "Delhi Police",
      "Municipal Corporation of Delhi (MCD)",
      "Delhi Revenue Department",
      "Delhi Education Department",
      "Delhi Transco Limited (DTL)",
      "Delhi Jal Board (DJB)",
      "Delhi Health & Family Welfare Department",
      "Delhi Transport Department",
      "Delhi Public Works Department (PWD)",
      "Delhi Irrigation & Flood Control Department",
      "Delhi Rural Development Department",
      "Delhi Urban Development Department",
      "Delhi Registration & Stamps Department",
      "Delhi Value Added Tax Department",
      "Delhi Labour Department",
      "Delhi Social Welfare Department",
      "Delhi Scheduled Castes & Scheduled Tribes Welfare Department",
      "Delhi Women & Child Development Department",
      "Delhi Backward Classes Welfare Department",
      "Delhi Minority Affairs Department",
      "Delhi Youth & Sports Department",
      "Delhi Information & Publicity Department",
      "Delhi Finance Department",
      "Delhi Planning Department",
      "Delhi Home Department",
      "Delhi Law, Justice & Legislative Affairs Department",
      "Delhi Judicial Department",
      "Delhi Prisons Department",
      "Delhi Fire Services Department",
      "Delhi Disaster Management Department",
      "Delhi Forest & Wildlife Department",
      "Delhi Environment Department",
      "Delhi Mines & Geology Department",
      "Delhi Industries Department",
      "Delhi Information Technology Department",
      "Delhi Tourism Department",
      "Delhi Art, Culture & Languages Department",
      "Delhi Archaeology Department",
      "Delhi Housing & Urban Development Department",
      "Delhi Water Supply Department",
      "Delhi Ground Water Department",
      "Delhi Jal Board",
      "Delhi Food, Civil Supplies & Consumer Affairs Department",
      "Delhi Consumer Affairs Department",
      "Delhi Cooperation Department",
      "Delhi Agricultural Marketing Department",
      "Delhi Handloom & Handicrafts Department",
      "Delhi Power Department",
      "Delhi Renewable Energy Department",
      "Delhi Science & Technology Department",
      "Delhi Telecommunications Department",
      "Delhi Postal Services Department",
      "Delhi Banking & Financial Services Department",
      "Delhi Insurance Department",
      "Delhi Pension Department",
    ],
    highlights: [
      "RTI governed by Delhi Information Commission (DIC)",
      "Applications can be filed in English or Hindi",
    ],
    faqs: [
      { q: "Can I file RTI in Hindi?", a: "Yes, RTIs in Delhi can be filed in English or Hindi." },
      { q: "How long does it take to get a response?", a: "Typically, government departments respond within 30 days as per RTI Act guidelines." },
    ],
    process: {
      steps: [
        {
          step: 1,
          title: "Tell Us Your Query",
          description: "Share what information you need from the Delhi government department.",
        },
        {
          step: 2,
          title: "We Draft Your RTI",
          description: "Our experts draft a professional RTI application in English or Hindi.",
        },
        {
          step: 3,
          title: "We Submit It",
          description: "We handle the submission, fee payment, and tracking for you.",
        },
        {
          step: 4,
          title: "Get Your Response",
          description: "Receive the information directly from the department within 30 days.",
        },
      ],
    },
    commission: "Delhi Information Commission (DIC)",
    fee: "₹10",
  },
};

export const getStateBySlug = (slug: string): StateData | undefined => {
  return states[slug.toLowerCase()];
};

export const getAllStateSlugs = (): string[] => {
  return Object.keys(states);
};
