// lib/mock-data/brand-kit.ts

export interface BrandKit {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  logo: {
    primary: string;
    secondary?: string;
    icon: string;
  };
  style: {
    borderRadius: number;
    spacing: number;
    shadowIntensity: number;
  };
  preferences: {
    tone: 'professional' | 'casual' | 'luxury' | 'playful' | 'minimalist';
    industry: string;
    targetAudience: string;
  };
}

export const mockBrandKits: BrandKit[] = [
  {
    id: "tech-startup",
    name: "Tech Startup",
    colors: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#F59E0B",
      background: "#F8FAFC",
      text: "#1F2937"
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      accent: "JetBrains Mono"
    },
    logo: {
      primary: "/brand-kits/tech-startup-logo.svg",
      icon: "/brand-kits/tech-startup-icon.svg"
    },
    style: {
      borderRadius: 8,
      spacing: 16,
      shadowIntensity: 0.1
    },
    preferences: {
      tone: "professional",
      industry: "Technology",
      targetAudience: "Entrepreneurs, Developers"
    }
  },
  {
    id: "luxury-brand",
    name: "Marque de Luxe",
    colors: {
      primary: "#1F2937",
      secondary: "#374151",
      accent: "#F59E0B",
      background: "#FAFAFA",
      text: "#111827"
    },
    fonts: {
      heading: "Playfair Display",
      body: "Source Sans Pro",
      accent: "Playfair Display"
    },
    logo: {
      primary: "/brand-kits/luxury-brand-logo.svg",
      icon: "/brand-kits/luxury-brand-icon.svg"
    },
    style: {
      borderRadius: 4,
      spacing: 24,
      shadowIntensity: 0.2
    },
    preferences: {
      tone: "luxury",
      industry: "Fashion & Luxury",
      targetAudience: "High-end consumers"
    }
  },
  {
    id: "creative-agency",
    name: "Agence Créative",
    colors: {
      primary: "#EC4899",
      secondary: "#BE185D",
      accent: "#F59E0B",
      background: "#FEFEFE",
      text: "#1F2937"
    },
    fonts: {
      heading: "Poppins",
      body: "Open Sans",
      accent: "Dancing Script"
    },
    logo: {
      primary: "/brand-kits/creative-agency-logo.svg",
      icon: "/brand-kits/creative-agency-icon.svg"
    },
    style: {
      borderRadius: 12,
      spacing: 20,
      shadowIntensity: 0.15
    },
    preferences: {
      tone: "playful",
      industry: "Creative Services",
      targetAudience: "Artists, Creatives, Brands"
    }
  },
  {
    id: "eco-friendly",
    name: "Éco-responsable",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#F59E0B",
      background: "#F0FDF4",
      text: "#064E3B"
    },
    fonts: {
      heading: "Nunito",
      body: "Nunito Sans",
      accent: "Nunito"
    },
    logo: {
      primary: "/brand-kits/eco-friendly-logo.svg",
      icon: "/brand-kits/eco-friendly-icon.svg"
    },
    style: {
      borderRadius: 16,
      spacing: 18,
      shadowIntensity: 0.08
    },
    preferences: {
      tone: "casual",
      industry: "Environmental",
      targetAudience: "Eco-conscious consumers"
    }
  },
  {
    id: "minimalist",
    name: "Minimaliste",
    colors: {
      primary: "#000000",
      secondary: "#404040",
      accent: "#FF6B35",
      background: "#FFFFFF",
      text: "#1A1A1A"
    },
    fonts: {
      heading: "Helvetica Neue",
      body: "Helvetica Neue",
      accent: "Helvetica Neue"
    },
    logo: {
      primary: "/brand-kits/minimalist-logo.svg",
      icon: "/brand-kits/minimalist-icon.svg"
    },
    style: {
      borderRadius: 0,
      spacing: 32,
      shadowIntensity: 0.05
    },
    preferences: {
      tone: "minimalist",
      industry: "Design & Architecture",
      targetAudience: "Design enthusiasts"
    }
  }
];

export const colorPalettes = [
  {
    id: "blue-professional",
    name: "Bleu Professionnel",
    colors: ["#3B82F6", "#1E40AF", "#60A5FA", "#DBEAFE", "#1F2937"],
    category: "professional"
  },
  {
    id: "green-nature",
    name: "Vert Nature",
    colors: ["#059669", "#047857", "#34D399", "#D1FAE5", "#064E3B"],
    category: "eco"
  },
  {
    id: "purple-creative",
    name: "Violet Créatif",
    colors: ["#7C3AED", "#5B21B6", "#A78BFA", "#EDE9FE", "#1F2937"],
    category: "creative"
  },
  {
    id: "orange-energetic",
    name: "Orange Énergique",
    colors: ["#F59E0B", "#D97706", "#FCD34D", "#FEF3C7", "#1F2937"],
    category: "energetic"
  },
  {
    id: "pink-playful",
    name: "Rose Ludique",
    colors: ["#EC4899", "#BE185D", "#F472B6", "#FCE7F3", "#1F2937"],
    category: "playful"
  },
  {
    id: "gray-minimal",
    name: "Gris Minimal",
    colors: ["#6B7280", "#374151", "#9CA3AF", "#F3F4F6", "#111827"],
    category: "minimal"
  }
];

export const fontCombinations = [
  {
    id: "modern-sans",
    name: "Sans-serif Moderne",
    heading: "Inter",
    body: "Inter",
    accent: "JetBrains Mono",
    category: "modern"
  },
  {
    id: "elegant-serif",
    name: "Serif Élégant",
    heading: "Playfair Display",
    body: "Source Sans Pro",
    accent: "Playfair Display",
    category: "elegant"
  },
  {
    id: "friendly-rounded",
    name: "Arrondi Amical",
    heading: "Poppins",
    body: "Open Sans",
    accent: "Dancing Script",
    category: "friendly"
  },
  {
    id: "clean-minimal",
    name: "Minimal Propre",
    heading: "Helvetica Neue",
    body: "Helvetica Neue",
    accent: "Helvetica Neue",
    category: "minimal"
  },
  {
    id: "warm-humanist",
    name: "Humaniste Chaleureux",
    heading: "Nunito",
    body: "Nunito Sans",
    accent: "Nunito",
    category: "warm"
  }
];
