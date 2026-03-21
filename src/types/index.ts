export type SkillId =
  | 'site-description'
  | 'brand-guide'
  | 'site-structure'
  | 'site-images'
  | 'site-text'
  | 'inspiration';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  skillId?: SkillId;
  timestamp: number;
}

export interface SiteDescription {
  businessName: string;
  businessType: string;
  targetAudience: string;
  brandValues: string[];
  businessGoals: string[];
  summary: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
}

export interface FontScale {
  headingFamily: string;
  bodyFamily: string;
  h1Size: string;
  h2Size: string;
  h3Size: string;
  bodySize: string;
  smallSize: string;
}

export interface ButtonStyle {
  borderRadius: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
  fontWeight: string;
  textTransform: string;
}

export interface BrandGuide {
  colors: ColorPalette;
  fonts: FontScale;
  buttonStyle: ButtonStyle;
}

export interface SitePage {
  id: string;
  name: string;
  slug: string;
  description: string;
  sections: string[];
}

export interface SiteImage {
  id: string;
  url: string;
  alt: string;
  category: string;
}

export interface PageText {
  pageId: string;
  pageName: string;
  sections: { id: string; heading: string; body: string }[];
}

export interface InspirationImage {
  id: string;
  url: string;
  label: string;
  source: 'preset' | 'user';
  selected: boolean;
}

export interface SkillData {
  'site-description': SiteDescription | null;
  'brand-guide': BrandGuide | null;
  'site-structure': SitePage[];
  'site-images': SiteImage[];
  'site-text': PageText[];
  'inspiration': InspirationImage[];
}

export interface GeneratedSite {
  id: string;
  pages: GeneratedPage[];
  brandGuide: BrandGuide;
  generatedAt: number;
}

export interface GeneratedPage {
  id: string;
  name: string;
  slug: string;
  sections: GeneratedSection[];
}

export interface GeneratedSection {
  id: string;
  type: 'hero' | 'text' | 'image-text' | 'gallery' | 'cta' | 'features' | 'testimonials' | 'footer';
  content: {
    heading?: string;
    subheading?: string;
    body?: string;
    imageUrl?: string;
    imageAlt?: string;
    buttonText?: string;
    items?: { icon?: string; title: string; description: string }[];
  };
}
