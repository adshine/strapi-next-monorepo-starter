import { z } from 'zod';

// Core data schemas
export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  interval: z.enum(['month', 'year']),
  features: z.array(z.string()),
  dailyDownloads: z.number(),
  monthlyRequests: z.number(),
  prioritySupport: z.boolean(),
  badge: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  planId: z.string(),
  downloadsToday: z.number(),
  downloadsReset: z.string(), // ISO date
  requestsThisMonth: z.number(),
  requestsReset: z.string(), // ISO date
  favorites: z.array(z.string()), // template IDs
});

export const templateSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  category: z.string(),
  planRequired: z.string(), // plan slug
  thumbnailUrl: z.string(),
  previewImages: z.array(z.string()).optional(),
  downloadCount: z.number(),
  rating: z.number(),
  tags: z.array(z.string()),
  creator: z.string(),
  compatibility: z.array(z.string()).optional(),
});

export const downloadSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  downloadedAt: z.string(),
  status: z.enum(['completed', 'failed', 'pending']),
});

export const requestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  status: z.enum(['pending', 'in-progress', 'fulfilled']),
  submittedAt: z.string(),
  urgency: z.enum(['standard', 'priority', 'rush']),
});

export type Plan = z.infer<typeof planSchema>;
export type User = z.infer<typeof userSchema>;
export type Template = z.infer<typeof templateSchema>;
export type Download = z.infer<typeof downloadSchema>;
export type TemplateRequest = z.infer<typeof requestSchema>;

// Mock data
export const MOCK_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Solo',
    slug: 'solo',
    price: 0,
    interval: 'month',
    features: ['3 downloads per day', '1 template request per month', 'Community support'],
    dailyDownloads: 3,
    monthlyRequests: 1,
    prioritySupport: false,
    badge: 'Free',
  },
  {
    id: '2',
    name: 'Studio',
    slug: 'studio',
    price: 29,
    interval: 'month',
    features: ['25 downloads per day', '5 template requests per month', '3 projects', 'Email support', 'Favorites'],
    dailyDownloads: 25,
    monthlyRequests: 5,
    prioritySupport: false,
    badge: 'Popular',
  },
  {
    id: '3',
    name: 'Pro',
    slug: 'pro',
    price: 59,
    interval: 'month',
    features: ['100 downloads per day', '20 template requests per month', 'Unlimited projects', 'Priority support', 'Advanced filters'],
    dailyDownloads: 100,
    monthlyRequests: 20,
    prioritySupport: true,
    badge: 'Pro',
  },
  {
    id: '4',
    name: 'Lifetime',
    slug: 'lifetime',
    price: 299,
    interval: 'year',
    features: ['Unlimited downloads', 'Unlimited requests', 'All features', 'Direct support'],
    dailyDownloads: -1, // unlimited
    monthlyRequests: -1, // unlimited
    prioritySupport: true,
    badge: 'Lifetime',
  },
];

export const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'E-Commerce Landing Page',
    slug: 'ecommerce-landing',
    description: 'Modern shopping experience with product showcase, testimonials, and conversion-focused design.',
    longDescription:
      'Built for conversion-focused eCommerce launches. Showcase hero products, highlight social proof, and drop buyers directly into the checkout journey with modular sections that adapt to any vertical.',
    category: 'E-commerce',
    planRequired: 'solo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1585386959984-a4155223f9a9?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 1247,
    rating: 4.8,
    tags: ['shopping', 'conversion', 'modern'],
    creator: 'DesignPro Studio',
    compatibility: ['Framer'],
  },
  {
    id: '2',
    title: 'SaaS Dashboard',
    slug: 'saas-dashboard',
    description: 'Comprehensive analytics dashboard with charts, data tables, and user management panels.',
    longDescription:
      'Keep stakeholders aligned with real-time metrics, custom alerts, and user cohorts. Includes light/dark theming and ready-to-wire graph components.',
    category: 'SaaS',
    planRequired: 'studio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1580894899552-4c1f7c929b48?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1527254059243-6a0c3a9fd1b5?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 892,
    rating: 4.6,
    tags: ['dashboard', 'analytics', 'data'],
    creator: 'TechFlow',
    compatibility: ['Framer'],
  },
  {
    id: '3',
    title: 'Portfolio Gallery',
    slug: 'portfolio-gallery',
    description: 'Showcase your work with this elegant portfolio template featuring image galleries and case studies.',
    longDescription:
      'Perfect for photographers and designers who need a rich media-first experience. Includes case-study modules, testimonial carousel, and newsletter capture.',
    category: 'Portfolio',
    planRequired: 'solo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 673,
    rating: 4.9,
    tags: ['portfolio', 'creative', 'gallery'],
    creator: 'Creative Minds',
    compatibility: ['Framer'],
  },
  {
    id: '4',
    title: 'Restaurant Menu',
    slug: 'restaurant-menu',
    description: 'Food presentation template with image grids, pricing, and contact information for local restaurants.',
    longDescription:
      'Designed for brick-and-mortar restaurants that want an interactive, appetizing menu experience. Swappable hero banners, menu tabs, and reservation CTA ready to go.',
    category: 'Business',
    planRequired: 'solo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 445,
    rating: 4.5,
    tags: ['restaurant', 'food', 'local'],
    creator: 'Foodie Designs',
    compatibility: ['Framer'],
  },
  {
    id: '5',
    title: 'Corporate Presentation',
    slug: 'corporate-presentation',
    description: 'Professional slide deck template with charts, timelines, and team collaboration tools.',
    longDescription:
      'Pitch decks, quarterly reviews, and investor updates all in one flexible composition. Includes pre-built narrative sections and instant chart styling.',
    category: 'Corporate',
    planRequired: 'pro',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 321,
    rating: 4.7,
    tags: ['business', 'presentation', 'corporate'],
    creator: 'BizTemplates',
    compatibility: ['Framer'],
  },
  {
    id: '6',
    title: 'Photography Portfolio',
    slug: 'photography-portfolio',
    description: 'Grid-based photography showcase with lightbox, categorization, and client testimonials.',
    longDescription:
      'Curated galleries, full-screen hero imagery, and client proofing modules make this template ideal for studios and wedding photographers.',
    category: 'Creative',
    planRequired: 'studio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 789,
    rating: 4.8,
    tags: ['photography', 'portfolio', 'creative'],
    creator: 'LensCraft',
    compatibility: ['Framer'],
  },
  {
    id: '7',
    title: 'Blog Magazine',
    slug: 'blog-magazine',
    description: 'Multi-author blog platform with featured posts, categories, and social sharing functionality.',
    longDescription:
      'Editorial layout with sticky reading progress, author hubs, and category-driven discoverability. Ships with typography styles that feel at home on any magazine.',
    category: 'Blog',
    planRequired: 'solo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 1092,
    rating: 4.6,
    tags: ['blog', 'content', 'news'],
    creator: 'ContentFlow',
    compatibility: ['Framer'],
  },
  {
    id: '8',
    title: 'Event Landing Page',
    slug: 'event-landing',
    description: "Time-sensitive marketing page for conferences and events with countdown timers and registration forms.",
    longDescription:
      'Launch conferences or pop-up events with urgency-driven hero sections, agenda formatting, and speaker highlight cards.',
    category: 'Events',
    planRequired: 'studio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&h=1000&fit=crop',
    ],
    downloadCount: 567,
    rating: 4.4,
    tags: ['events', 'marketing', 'time-sensitive'],
    creator: 'EventMaster',
    compatibility: ['Framer'],
  },
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@framertemplates.com',
    name: 'Demo User',
    planId: '2', // Studio plan
    downloadsToday: 0,
    downloadsReset: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    requestsThisMonth: 0,
    requestsReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(), // next month
    favorites: ['1', '3'],
  },
];

export const MOCK_ADD_ONS = [
  {
    id: 'fast-turnaround',
    name: 'Fast Turnaround',
    description: 'Priority processing for template requests',
    price: 19,
    period: 'month' as const,
  },
  {
    id: 'premium-support',
    name: 'Premium Support',
    description: 'Direct access to our design team',
    price: 49,
    period: 'month' as const,
  },
];

// Helper functions
export const getMockPlanBySlug = (slug: string): Plan | undefined => {
  return MOCK_PLANS.find(plan => plan.slug === slug);
};

export const getMockPlanById = (id: string): Plan | undefined => {
  return MOCK_PLANS.find(plan => plan.id === id);
};

export const getMockUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('ft-user');
  if (!stored) return null;

  try {
    return userSchema.parse(JSON.parse(stored));
  } catch {
    return null;
  }
};

export const saveMockUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ft-user', JSON.stringify(user));
};

export const updateMockUser = (updatedUser: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ft-user', JSON.stringify(updatedUser));
};

export const clearMockUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ft-user');
};

export const getMockDownloads = (): Download[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('ft-downloads');
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    const result = z.array(downloadSchema).parse(parsed);
    return result;
  } catch {
    return [];
  }
};

export const saveMockDownload = (download: Download): void => {
  if (typeof window === 'undefined') return;

  const existing = getMockDownloads();
  existing.unshift(download); // Add to beginning
  localStorage.setItem('ft-downloads', JSON.stringify(existing));
};

export const getMockRequests = (): TemplateRequest[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('ft-requests');
  if (!stored) return [];

  try {
    return z.array(requestSchema).parse(JSON.parse(stored));
  } catch {
    return [];
  }
};

export const saveMockRequest = (request: TemplateRequest): void => {
  if (typeof window === 'undefined') return;

  const existing = getMockRequests();
  existing.unshift(request); // Add to beginning
  localStorage.setItem('ft-requests', JSON.stringify(existing));
};
