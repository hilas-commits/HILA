import { useStore } from '../../store/useStore';
import { SectionRenderer } from './SectionRenderer';
import { Monitor, Tablet, Smartphone, Globe } from 'lucide-react';
import { useState } from 'react';

type Viewport = 'desktop' | 'tablet' | 'mobile';

export function WebsiteCanvas() {
  const generatedSite = useStore((s) => s.generatedSite);
  const selectedPageSlug = useStore((s) => s.selectedPageSlug);
  const setSelectedPageSlug = useStore((s) => s.setSelectedPageSlug);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  if (!generatedSite) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-surface-200 flex items-center justify-center mb-6">
          <Globe size={40} className="text-surface-400" />
        </div>
        <h2 className="text-2xl font-semibold text-surface-800 mb-2">Your website will appear here</h2>
        <p className="text-surface-500 max-w-md">
          Start by describing your business in the chat, then configure your skills and hit Generate Site.
        </p>
      </div>
    );
  }

  const currentPage = generatedSite.pages.find((p) => p.slug === selectedPageSlug) || generatedSite.pages[0];
  const brand = generatedSite.brandGuide;

  const viewportWidth = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-surface-200">
        {/* Page tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {generatedSite.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPageSlug(page.slug)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                page.slug === selectedPageSlug
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-surface-500 hover:bg-surface-100'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>

        {/* Viewport toggles */}
        <div className="flex gap-1 ml-4">
          {([
            { id: 'desktop', icon: Monitor },
            { id: 'tablet', icon: Tablet },
            { id: 'mobile', icon: Smartphone },
          ] as const).map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewport(id)}
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-surface-400 hover:bg-surface-100'
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-100 p-4 flex justify-center">
        <div
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: viewportWidth[viewport],
            maxWidth: '100%',
            fontFamily: brand.fonts.bodyFamily,
          }}
        >
          {currentPage.sections.map((section, index) => (
            <SectionRenderer
              key={section.id}
              section={section}
              brand={brand}
              pageId={currentPage.id}
              index={index}
              totalSections={currentPage.sections.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
