import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  SkillId,
  ChatMessage,
  SkillData,
  GeneratedSite,
  SiteDescription,
  BrandGuide,
  SitePage,
  SiteImage,
  PageText,
  InspirationImage,
  GeneratedPage,
  GeneratedSection,
} from '../types';

interface AppState {
  // Chat
  messages: ChatMessage[];
  activeSkill: SkillId | null;
  isProcessing: boolean;
  addMessage: (role: 'user' | 'assistant', content: string, skillId?: SkillId) => void;
  setActiveSkill: (skill: SkillId | null) => void;
  setIsProcessing: (v: boolean) => void;

  // Skills data
  skillData: SkillData;
  setSiteDescription: (data: SiteDescription) => void;
  setBrandGuide: (data: BrandGuide) => void;
  addPage: (page: SitePage) => void;
  removePage: (id: string) => void;
  updatePage: (id: string, page: Partial<SitePage>) => void;
  addSiteImage: (image: SiteImage) => void;
  removeSiteImage: (id: string) => void;
  addPageText: (text: PageText) => void;
  removePageText: (pageId: string) => void;
  updatePageText: (pageId: string, text: Partial<PageText>) => void;
  addInspirationImage: (image: InspirationImage) => void;
  removeInspirationImage: (id: string) => void;
  toggleInspirationImage: (id: string) => void;

  // Generated site
  generatedSite: GeneratedSite | null;
  generateSite: () => void;
  updateSection: (pageId: string, sectionId: string, content: Partial<GeneratedSection['content']>) => void;
  addSection: (pageId: string, section: GeneratedSection, afterIndex: number) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  moveSection: (pageId: string, sectionId: string, direction: 'up' | 'down') => void;

  // UI
  selectedPageSlug: string;
  setSelectedPageSlug: (slug: string) => void;
  leftPanelView: 'chat' | 'skills';
  setLeftPanelView: (view: 'chat' | 'skills') => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Chat
  messages: [],
  activeSkill: null,
  isProcessing: false,

  addMessage: (role, content, skillId) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { id: uuid(), role, content, skillId, timestamp: Date.now() },
      ],
    })),

  setActiveSkill: (skill) => set({ activeSkill: skill }),
  setIsProcessing: (v) => set({ isProcessing: v }),

  // Skills data
  skillData: {
    'site-description': null,
    'brand-guide': null,
    'site-structure': [],
    'site-images': [],
    'site-text': [],
    'inspiration': [],
  },

  setSiteDescription: (data) =>
    set((s) => ({
      skillData: { ...s.skillData, 'site-description': data },
    })),

  setBrandGuide: (data) =>
    set((s) => ({
      skillData: { ...s.skillData, 'brand-guide': data },
    })),

  addPage: (page) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-structure': [...s.skillData['site-structure'], page],
      },
    })),

  removePage: (id) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-structure': s.skillData['site-structure'].filter((p) => p.id !== id),
      },
    })),

  updatePage: (id, page) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-structure': s.skillData['site-structure'].map((p) =>
          p.id === id ? { ...p, ...page } : p
        ),
      },
    })),

  addSiteImage: (image) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-images': [...s.skillData['site-images'], image],
      },
    })),

  removeSiteImage: (id) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-images': s.skillData['site-images'].filter((img) => img.id !== id),
      },
    })),

  addPageText: (text) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-text': [...s.skillData['site-text'], text],
      },
    })),

  removePageText: (pageId) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-text': s.skillData['site-text'].filter((t) => t.pageId !== pageId),
      },
    })),

  updatePageText: (pageId, text) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        'site-text': s.skillData['site-text'].map((t) =>
          t.pageId === pageId ? { ...t, ...text } : t
        ),
      },
    })),

  addInspirationImage: (image) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        inspiration: [...s.skillData.inspiration, image],
      },
    })),

  removeInspirationImage: (id) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        inspiration: s.skillData.inspiration.filter((img) => img.id !== id),
      },
    })),

  toggleInspirationImage: (id) =>
    set((s) => ({
      skillData: {
        ...s.skillData,
        inspiration: s.skillData.inspiration.map((img) =>
          img.id === id ? { ...img, selected: !img.selected } : img
        ),
      },
    })),

  // Generated site
  generatedSite: null,
  selectedPageSlug: 'home',
  setSelectedPageSlug: (slug) => set({ selectedPageSlug: slug }),
  leftPanelView: 'chat',
  setLeftPanelView: (view) => set({ leftPanelView: view }),

  generateSite: () => {
    const { skillData } = get();
    const desc = skillData['site-description'];
    const brand = skillData['brand-guide'];
    const pages = skillData['site-structure'];
    const images = skillData['site-images'];
    const texts = skillData['site-text'];

    if (!desc || !brand || pages.length === 0) return;

    const generatedPages: GeneratedPage[] = pages.map((page) => {
      const pageText = texts.find((t) => t.pageId === page.id);
      const sections: GeneratedSection[] = [];

      // Hero section
      const heroImage = images.find((img) => img.category === 'hero') || images[0];
      sections.push({
        id: uuid(),
        type: 'hero',
        content: {
          heading: page.slug === 'home'
            ? `Welcome to ${desc.businessName}`
            : page.name,
          subheading: page.slug === 'home'
            ? desc.summary
            : page.description,
          imageUrl: heroImage?.url || `https://placehold.co/1200x600/${brand.colors.primary.replace('#', '')}/${brand.colors.background.replace('#', '')}?text=${encodeURIComponent(page.name)}`,
          buttonText: page.slug === 'home' ? 'Get Started' : undefined,
        },
      });

      // Content sections from page text
      if (pageText) {
        pageText.sections.forEach((sec, i) => {
          const sectionImage = images[i % images.length];
          if (i % 2 === 0) {
            sections.push({
              id: uuid(),
              type: 'image-text',
              content: {
                heading: sec.heading,
                body: sec.body,
                imageUrl: sectionImage?.url || `https://placehold.co/600x400/${brand.colors.secondary.replace('#', '')}/${brand.colors.background.replace('#', '')}?text=${encodeURIComponent(sec.heading)}`,
                imageAlt: sec.heading,
              },
            });
          } else {
            sections.push({
              id: uuid(),
              type: 'text',
              content: {
                heading: sec.heading,
                body: sec.body,
              },
            });
          }
        });
      }

      // CTA section for home
      if (page.slug === 'home') {
        sections.push({
          id: uuid(),
          type: 'cta',
          content: {
            heading: 'Ready to get started?',
            subheading: `Join ${desc.businessName} today`,
            buttonText: 'Contact Us',
          },
        });
      }

      // Footer
      sections.push({
        id: uuid(),
        type: 'footer',
        content: {
          heading: desc.businessName,
          body: `© ${new Date().getFullYear()} ${desc.businessName}. All rights reserved.`,
        },
      });

      return {
        id: page.id,
        name: page.name,
        slug: page.slug,
        sections,
      };
    });

    set({
      generatedSite: {
        id: uuid(),
        pages: generatedPages,
        brandGuide: brand,
        generatedAt: Date.now(),
      },
      selectedPageSlug: 'home',
    });
  },

  updateSection: (pageId, sectionId, content) =>
    set((s) => {
      if (!s.generatedSite) return s;
      return {
        generatedSite: {
          ...s.generatedSite,
          pages: s.generatedSite.pages.map((p) =>
            p.id === pageId
              ? {
                  ...p,
                  sections: p.sections.map((sec) =>
                    sec.id === sectionId
                      ? { ...sec, content: { ...sec.content, ...content } }
                      : sec
                  ),
                }
              : p
          ),
        },
      };
    }),

  addSection: (pageId, section, afterIndex) =>
    set((s) => {
      if (!s.generatedSite) return s;
      return {
        generatedSite: {
          ...s.generatedSite,
          pages: s.generatedSite.pages.map((p) => {
            if (p.id !== pageId) return p;
            const sections = [...p.sections];
            sections.splice(afterIndex + 1, 0, section);
            return { ...p, sections };
          }),
        },
      };
    }),

  removeSection: (pageId, sectionId) =>
    set((s) => {
      if (!s.generatedSite) return s;
      return {
        generatedSite: {
          ...s.generatedSite,
          pages: s.generatedSite.pages.map((p) =>
            p.id === pageId
              ? { ...p, sections: p.sections.filter((sec) => sec.id !== sectionId) }
              : p
          ),
        },
      };
    }),

  moveSection: (pageId, sectionId, direction) =>
    set((s) => {
      if (!s.generatedSite) return s;
      return {
        generatedSite: {
          ...s.generatedSite,
          pages: s.generatedSite.pages.map((p) => {
            if (p.id !== pageId) return p;
            const sections = [...p.sections];
            const idx = sections.findIndex((sec) => sec.id === sectionId);
            if (idx === -1) return p;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= sections.length) return p;
            [sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]];
            return { ...p, sections };
          }),
        },
      };
    }),
}));
