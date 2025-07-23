// lib/mock-data/templates.ts

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sector: string;
  style: string;
  format: string;
  thumbnail: string;
  tags: string[];
  popularity: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockTemplates: Template[] = [
  // MARKETING DIGITAL
  {
    id: "social-post-1",
    name: "Post Instagram Moderne",
    description: "Template moderne pour posts Instagram avec design épuré",
    category: "social-media",
    sector: "marketing",
    style: "modern",
    format: "1080x1080",
    thumbnail: "/templates/social-post-1.jpg",
    tags: ["instagram", "social", "moderne", "carré"],
    popularity: 95,
    isPremium: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "newsletter-1",
    name: "Newsletter E-commerce",
    description: "Template de newsletter pour boutiques en ligne",
    category: "email",
    sector: "ecommerce",
    style: "professional",
    format: "600x800",
    thumbnail: "/templates/newsletter-1.jpg",
    tags: ["email", "newsletter", "ecommerce", "vente"],
    popularity: 88,
    isPremium: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18"
  },
  {
    id: "ad-facebook-1",
    name: "Publicité Facebook Dynamique",
    description: "Template publicitaire avec call-to-action percutant",
    category: "advertising",
    sector: "marketing",
    style: "dynamic",
    format: "1200x628",
    thumbnail: "/templates/ad-facebook-1.jpg",
    tags: ["facebook", "publicité", "cta", "conversion"],
    popularity: 92,
    isPremium: false,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-22"
  },

  // E-COMMERCE
  {
    id: "product-sheet-1",
    name: "Fiche Produit Élégante",
    description: "Fiche produit avec mise en valeur premium",
    category: "product",
    sector: "ecommerce",
    style: "elegant",
    format: "800x1000",
    thumbnail: "/templates/product-sheet-1.jpg",
    tags: ["produit", "fiche", "ecommerce", "premium"],
    popularity: 90,
    isPremium: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16"
  },
  {
    id: "banner-promo-1",
    name: "Bannière Promotion Flash",
    description: "Bannière promotionnelle pour soldes et offres spéciales",
    category: "banner",
    sector: "ecommerce",
    style: "vibrant",
    format: "1920x400",
    thumbnail: "/templates/banner-promo-1.jpg",
    tags: ["bannière", "promotion", "soldes", "urgence"],
    popularity: 87,
    isPremium: false,
    createdAt: "2024-01-14",
    updatedAt: "2024-01-19"
  },

  // ÉDUCATION
  {
    id: "presentation-1",
    name: "Présentation Académique",
    description: "Template de présentation pour cours et formations",
    category: "presentation",
    sector: "education",
    style: "academic",
    format: "1920x1080",
    thumbnail: "/templates/presentation-1.jpg",
    tags: ["présentation", "cours", "formation", "académique"],
    popularity: 85,
    isPremium: false,
    createdAt: "2024-01-11",
    updatedAt: "2024-01-17"
  },
  {
    id: "infographic-1",
    name: "Infographie Éducative",
    description: "Infographie pour expliquer des concepts complexes",
    category: "infographic",
    sector: "education",
    style: "educational",
    format: "800x2000",
    thumbnail: "/templates/infographic-1.jpg",
    tags: ["infographie", "éducation", "concept", "visuel"],
    popularity: 83,
    isPremium: true,
    createdAt: "2024-01-09",
    updatedAt: "2024-01-15"
  },

  // ÉVÉNEMENTIEL
  {
    id: "invitation-1",
    name: "Invitation Mariage Élégante",
    description: "Invitation de mariage avec design romantique",
    category: "invitation",
    sector: "events",
    style: "romantic",
    format: "1200x1600",
    thumbnail: "/templates/invitation-1.jpg",
    tags: ["invitation", "mariage", "romantique", "élégant"],
    popularity: 94,
    isPremium: true,
    createdAt: "2024-01-13",
    updatedAt: "2024-01-21"
  },
  {
    id: "program-event-1",
    name: "Programme Conférence",
    description: "Programme détaillé pour événements professionnels",
    category: "program",
    sector: "events",
    style: "corporate",
    format: "210x297",
    thumbnail: "/templates/program-event-1.jpg",
    tags: ["programme", "conférence", "événement", "professionnel"],
    popularity: 81,
    isPremium: false,
    createdAt: "2024-01-07",
    updatedAt: "2024-01-14"
  },

  // RESTAURATION
  {
    id: "menu-restaurant-1",
    name: "Menu Restaurant Gastronomique",
    description: "Menu élégant pour restaurant haut de gamme",
    category: "menu",
    sector: "restaurant",
    style: "luxury",
    format: "210x297",
    thumbnail: "/templates/menu-restaurant-1.jpg",
    tags: ["menu", "restaurant", "gastronomique", "luxe"],
    popularity: 89,
    isPremium: true,
    createdAt: "2024-01-06",
    updatedAt: "2024-01-12"
  },
  {
    id: "promo-restaurant-1",
    name: "Promotion Restaurant",
    description: "Flyer promotionnel pour offres spéciales restaurant",
    category: "promotion",
    sector: "restaurant",
    style: "appetizing",
    format: "1080x1080",
    thumbnail: "/templates/promo-restaurant-1.jpg",
    tags: ["promotion", "restaurant", "offre", "appétissant"],
    popularity: 86,
    isPremium: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-11"
  }
];

export const templateCategories = [
  { id: "all", name: "Tous", icon: "Filter" },
  { id: "social-media", name: "Réseaux Sociaux", icon: "Share2" },
  { id: "email", name: "Email", icon: "Mail" },
  { id: "advertising", name: "Publicité", icon: "Megaphone" },
  { id: "product", name: "Produits", icon: "Package" },
  { id: "banner", name: "Bannières", icon: "Image" },
  { id: "presentation", name: "Présentations", icon: "Monitor" },
  { id: "infographic", name: "Infographies", icon: "BarChart" },
  { id: "invitation", name: "Invitations", icon: "Calendar" },
  { id: "program", name: "Programmes", icon: "FileText" },
  { id: "menu", name: "Menus", icon: "UtensilsCrossed" },
  { id: "promotion", name: "Promotions", icon: "Percent" }
];

export const templateSectors = [
  { id: "all", name: "Tous Secteurs", color: "from-gray-500 to-gray-600" },
  { id: "marketing", name: "Marketing", color: "from-blue-500 to-indigo-500" },
  { id: "ecommerce", name: "E-commerce", color: "from-green-500 to-teal-500" },
  { id: "education", name: "Éducation", color: "from-purple-500 to-pink-500" },
  { id: "events", name: "Événementiel", color: "from-orange-500 to-red-500" },
  { id: "restaurant", name: "Restauration", color: "from-yellow-500 to-orange-500" },
  { id: "realestate", name: "Immobilier", color: "from-cyan-500 to-blue-500" }
];

export const templateStyles = [
  { id: "all", name: "Tous Styles" },
  { id: "modern", name: "Moderne" },
  { id: "professional", name: "Professionnel" },
  { id: "dynamic", name: "Dynamique" },
  { id: "elegant", name: "Élégant" },
  { id: "vibrant", name: "Vibrant" },
  { id: "academic", name: "Académique" },
  { id: "educational", name: "Éducatif" },
  { id: "romantic", name: "Romantique" },
  { id: "corporate", name: "Corporate" },
  { id: "luxury", name: "Luxe" },
  { id: "appetizing", name: "Appétissant" }
];
