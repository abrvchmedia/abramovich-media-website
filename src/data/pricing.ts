export type AddOn = { 
  name: string; 
  pricePerMonth: number; 
  description: string; 
};

export type Plan = {
  id: string;
  name: string;
  pricePerMonth: number;
  termMonths: 4 | 12;
  highlight?: boolean;
  description: string;
  includes: string[];
  bestFor: string[];
  addOns?: AddOn[];
  // versions let us compare 4-month vs 12-month in the modal
  variants?: { label: "4-month" | "12-month"; pricePerMonth: number; total: number }[];
};

export const addOns: AddOn[] = [
  { 
    name: "Social Media Management", 
    pricePerMonth: 800, 
    description: "Posting, scheduling, copy, hashtag research." 
  },
  { 
    name: "Ads Management", 
    pricePerMonth: 1500, 
    description: "Meta/TikTok ad setup, split tests, reports." 
  },
  { 
    name: "Landing Page + Hosting", 
    pricePerMonth: 300, 
    description: "Conversion page, analytics, uptime, updates." 
  }
];

export const plans: Plan[] = [
  {
    id: "core",
    name: "Core Content Retainer",
    pricePerMonth: 2000,
    termMonths: 4,
    description: "Essential content creation with professional quality and consistent delivery.",
    includes: [
      "Brand kits & templates",
      "4 shoots per month",
      "8 edited clips + 1 hero cut",
      "Color, sound polish, captions",
      "Monthly content calendar"
    ],
    bestFor: ["Small businesses", "Startups", "Consistent social output"],
    addOns,
    variants: [
      { label: "4-month", pricePerMonth: 2000, total: 8000 },
      { label: "12-month", pricePerMonth: 1800, total: 21600 }
    ]
  },
  {
    id: "advanced",
    name: "Advanced Cinematic Retainer",
    pricePerMonth: 3000,
    termMonths: 4,
    highlight: true,
    description: "Enhanced content production with advanced cinematography and increased output.",
    includes: [
      "Brand kits & templates",
      "4 shoots per month",
      "16 edited clips + 2 hero cuts",
      "Motion graphics / light VFX",
      "Quarterly campaign planning"
    ],
    bestFor: ["Growing brands", "Coaches", "Local businesses"],
    addOns,
    variants: [
      { label: "4-month", pricePerMonth: 3000, total: 12000 },
      { label: "12-month", pricePerMonth: 2700, total: 32400 }
    ]
  },
  {
    id: "premium",
    name: "Premium Cinematic Content",
    pricePerMonth: 4000,
    termMonths: 4,
    description: "Complete digital presence solution with maximum content output and full-service support.",
    includes: [
      "Brand kits & templates",
      "4 shoots per month",
      "32 edited clips + 4 hero cuts",
      "Motion graphics / light VFX",
      "Website design",
      "SEO / Marketing automation",
      "Hosting & development"
    ],
    bestFor: ["Premium brands", "Launches", "National campaigns"],
    addOns,
    variants: [
      { label: "4-month", pricePerMonth: 4000, total: 16000 },
      { label: "12-month", pricePerMonth: 3600, total: 43200 }
    ]
  }
];
