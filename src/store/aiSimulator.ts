import { v4 as uuid } from 'uuid';
import type {
  SiteDescription,
  BrandGuide,
  SitePage,
  SiteImage,
  PageText,
} from '../types';

/**
 * Simulates AI responses for the chat agent.
 * In production, replace these with actual API calls.
 */

export function parseBusinessInput(input: string): SiteDescription {
  const lines = input.toLowerCase();

  const businessName = extractField(input, 'business name', 'name') || extractFirstCapitalized(input) || 'My Business';
  const businessType = extractField(input, 'business type', 'type') || inferBusinessType(lines);
  const targetAudience = extractField(input, 'target audience', 'audience') || 'General consumers';
  const brandValues = extractList(input, 'brand value', 'values') || ['Quality', 'Innovation'];
  const businessGoals = extractList(input, 'goal', 'goals') || ['Increase online presence'];

  return {
    businessName,
    businessType,
    targetAudience,
    brandValues,
    businessGoals,
    summary: `${businessName} is a ${businessType} targeting ${targetAudience.toLowerCase()}. Core values: ${brandValues.join(', ')}. Goals: ${businessGoals.join(', ')}.`,
  };
}

function extractField(text: string, ...keywords: string[]): string | null {
  for (const kw of keywords) {
    const regex = new RegExp(`${kw}[:\\s]+([^\\n,;.]+)`, 'i');
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  return null;
}

function extractFirstCapitalized(text: string): string | null {
  const match = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
  return match ? match[1] : null;
}

function inferBusinessType(text: string): string {
  const types: Record<string, string[]> = {
    'Restaurant': ['restaurant', 'food', 'dining', 'café', 'cafe', 'bistro'],
    'E-commerce': ['shop', 'store', 'ecommerce', 'e-commerce', 'retail', 'sell'],
    'Agency': ['agency', 'marketing', 'design', 'creative'],
    'SaaS': ['saas', 'software', 'app', 'platform', 'tool'],
    'Consulting': ['consulting', 'consultant', 'advisory'],
    'Healthcare': ['health', 'medical', 'clinic', 'wellness'],
    'Education': ['education', 'school', 'training', 'learn', 'course'],
    'Fitness': ['fitness', 'gym', 'training', 'workout'],
  };

  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some((kw) => text.includes(kw))) return type;
  }
  return 'Business';
}

function extractList(text: string, ...keywords: string[]): string[] | null {
  for (const kw of keywords) {
    const regex = new RegExp(`${kw}s?[:\\s]+([^\\n.]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[1]
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return null;
}

export function generateBrandGuide(desc: SiteDescription): BrandGuide {
  const palettes: Record<string, { primary: string; secondary: string; accent: string }> = {
    'Restaurant': { primary: '#C84B31', secondary: '#2D4059', accent: '#ECDBBA' },
    'E-commerce': { primary: '#2B2D42', secondary: '#8D99AE', accent: '#EF233C' },
    'Agency': { primary: '#6C63FF', secondary: '#3F3D56', accent: '#FF6584' },
    'SaaS': { primary: '#4361EE', secondary: '#3A0CA3', accent: '#F72585' },
    'Consulting': { primary: '#023E8A', secondary: '#0077B6', accent: '#00B4D8' },
    'Healthcare': { primary: '#2A9D8F', secondary: '#264653', accent: '#E9C46A' },
    'Education': { primary: '#5F0F40', secondary: '#9A031E', accent: '#FB8B24' },
    'Fitness': { primary: '#FF6B35', secondary: '#004E89', accent: '#1A936F' },
    'Business': { primary: '#1D3557', secondary: '#457B9D', accent: '#E63946' },
  };

  const pal = palettes[desc.businessType] || palettes['Business'];

  return {
    colors: {
      primary: pal.primary,
      secondary: pal.secondary,
      accent: pal.accent,
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#212529',
      textLight: '#6C757D',
    },
    fonts: {
      headingFamily: 'Inter',
      bodyFamily: 'Inter',
      h1Size: '3rem',
      h2Size: '2rem',
      h3Size: '1.5rem',
      bodySize: '1rem',
      smallSize: '0.875rem',
    },
    buttonStyle: {
      borderRadius: '8px',
      paddingX: '24px',
      paddingY: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      textTransform: 'none',
    },
  };
}

export function generateSiteStructure(desc: SiteDescription): SitePage[] {
  const base: SitePage[] = [
    {
      id: uuid(),
      name: 'Home',
      slug: 'home',
      description: `Landing page for ${desc.businessName}`,
      sections: ['Hero', 'Features', 'About Preview', 'CTA'],
    },
    {
      id: uuid(),
      name: 'About',
      slug: 'about',
      description: `Learn about ${desc.businessName} and our mission`,
      sections: ['Story', 'Team', 'Values'],
    },
    {
      id: uuid(),
      name: 'Contact',
      slug: 'contact',
      description: 'Get in touch with us',
      sections: ['Contact Form', 'Map', 'Info'],
    },
  ];

  const typePages: Record<string, SitePage[]> = {
    'Restaurant': [
      { id: uuid(), name: 'Menu', slug: 'menu', description: 'Our food and drinks menu', sections: ['Menu Categories', 'Specials'] },
      { id: uuid(), name: 'Reservations', slug: 'reservations', description: 'Book a table', sections: ['Booking Form', 'Hours'] },
    ],
    'E-commerce': [
      { id: uuid(), name: 'Products', slug: 'products', description: 'Browse our product catalog', sections: ['Product Grid', 'Categories'] },
      { id: uuid(), name: 'Cart', slug: 'cart', description: 'Shopping cart', sections: ['Cart Items', 'Checkout'] },
    ],
    'SaaS': [
      { id: uuid(), name: 'Features', slug: 'features', description: 'Platform features and capabilities', sections: ['Feature Grid', 'Comparison'] },
      { id: uuid(), name: 'Pricing', slug: 'pricing', description: 'Plans and pricing', sections: ['Pricing Table', 'FAQ'] },
    ],
    'Agency': [
      { id: uuid(), name: 'Services', slug: 'services', description: 'Our services', sections: ['Service List', 'Process'] },
      { id: uuid(), name: 'Portfolio', slug: 'portfolio', description: 'Our work', sections: ['Project Grid', 'Case Studies'] },
    ],
  };

  const extra = typePages[desc.businessType] || [
    { id: uuid(), name: 'Services', slug: 'services', description: `Services offered by ${desc.businessName}`, sections: ['Service List', 'Benefits'] },
  ];

  return [...base.slice(0, 1), ...extra, ...base.slice(1)];
}

export function generateSiteImages(desc: SiteDescription, brand: BrandGuide): SiteImage[] {
  const categories = ['hero', 'about', 'feature', 'background', 'team'];
  const primaryClean = brand.colors.primary.replace('#', '');
  const secondaryClean = brand.colors.secondary.replace('#', '');
  const bgClean = 'ffffff';

  return categories.map((cat) => ({
    id: uuid(),
    url: `https://placehold.co/800x500/${cat === 'hero' ? primaryClean : secondaryClean}/${bgClean}?text=${encodeURIComponent(`${desc.businessName} - ${cat}`)}`,
    alt: `${desc.businessName} ${cat} image`,
    category: cat,
  }));
}

export function generateSiteTexts(desc: SiteDescription, pages: SitePage[]): PageText[] {
  return pages.map((page) => ({
    pageId: page.id,
    pageName: page.name,
    sections: page.sections.map((sectionName) => ({
      id: uuid(),
      heading: sectionName,
      body: generateSectionText(desc, page.name, sectionName),
    })),
  }));
}

function generateSectionText(desc: SiteDescription, pageName: string, sectionName: string): string {
  const templates: Record<string, string> = {
    'Hero': `Welcome to ${desc.businessName}. We are a leading ${desc.businessType.toLowerCase()} dedicated to serving ${desc.targetAudience.toLowerCase()}. Our commitment to ${desc.brandValues[0]?.toLowerCase() || 'excellence'} sets us apart.`,
    'Features': `Discover what makes ${desc.businessName} unique. We combine ${desc.brandValues.join(' and ').toLowerCase()} to deliver exceptional results for our clients.`,
    'About Preview': `${desc.businessName} was founded with a simple mission: to bring ${desc.brandValues[0]?.toLowerCase() || 'quality'} ${desc.businessType.toLowerCase()} services to ${desc.targetAudience.toLowerCase()}.`,
    'CTA': `Ready to experience the ${desc.businessName} difference? Get in touch with us today and let us help you achieve your goals.`,
    'Story': `${desc.businessName} began with a passion for ${desc.businessType.toLowerCase()} and a desire to make a difference for ${desc.targetAudience.toLowerCase()}.`,
    'Team': `Our dedicated team brings years of experience in the ${desc.businessType.toLowerCase()} industry, ensuring you receive the highest quality service.`,
    'Values': `At ${desc.businessName}, we believe in ${desc.brandValues.join(', ').toLowerCase()}. These core values guide everything we do.`,
    'Contact Form': `We'd love to hear from you. Reach out to ${desc.businessName} and let us know how we can help.`,
  };

  return templates[sectionName] || `${sectionName} - Content for the ${pageName} page of ${desc.businessName}. Tailored for ${desc.targetAudience.toLowerCase()}.`;
}

export function getDefaultInspirationImages(): {
  id: string;
  url: string;
  label: string;
  source: 'preset';
  selected: boolean;
}[] {
  const presets = [
    { label: 'Minimal Light', color: 'f5f5f5/333333' },
    { label: 'Bold Dark', color: '1a1a2e/e94560' },
    { label: 'Nature Organic', color: '2d6a4f/95d5b2' },
    { label: 'Tech Modern', color: '0f0e17/ff8906' },
    { label: 'Warm Elegant', color: 'fefae0/bc6c25' },
    { label: 'Ocean Calm', color: '0077b6/90e0ef' },
    { label: 'Pastel Soft', color: 'ffd6ff/c8b6ff' },
    { label: 'Corporate Blue', color: '003049/669bbc' },
  ];

  return presets.map((p) => ({
    id: uuid(),
    url: `https://placehold.co/400x300/${p.color}?text=${encodeURIComponent(p.label)}`,
    label: p.label,
    source: 'preset' as const,
    selected: false,
  }));
}
