import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuid } from 'uuid';
import type { GeneratedSection, BrandGuide } from '../../types';
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Save,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface Props {
  section: GeneratedSection;
  brand: BrandGuide;
  pageId: string;
  index: number;
  totalSections: number;
}

export function SectionRenderer({ section, brand, pageId, index, totalSections }: Props) {
  const updateSection = useStore((s) => s.updateSection);
  const removeSection = useStore((s) => s.removeSection);
  const moveSection = useStore((s) => s.moveSection);
  const addSection = useStore((s) => s.addSection);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content);
  const [hovered, setHovered] = useState(false);

  const save = () => {
    updateSection(pageId, section.id, editContent);
    setEditing(false);
  };

  const handleAddSection = () => {
    addSection(
      pageId,
      {
        id: uuid(),
        type: 'text',
        content: {
          heading: 'New Section',
          body: 'Click to edit this section content.',
        },
      },
      index
    );
  };

  const handleImageReplace = () => {
    const url = prompt('Enter new image URL:');
    if (url) {
      updateSection(pageId, section.id, { imageUrl: url });
    }
  };

  const renderSection = () => {
    const { content } = section;

    switch (section.type) {
      case 'hero':
        return (
          <div
            className="relative py-20 px-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
              color: '#fff',
            }}
          >
            <h1
              style={{
                fontSize: brand.fonts.h1Size,
                fontFamily: brand.fonts.headingFamily,
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              {editing ? (
                <input
                  value={editContent.heading || ''}
                  onChange={(e) => setEditContent({ ...editContent, heading: e.target.value })}
                  className="w-full text-center bg-transparent border-b-2 border-white/50 outline-none text-white"
                  style={{ fontSize: brand.fonts.h1Size }}
                />
              ) : (
                content.heading
              )}
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              {editing ? (
                <textarea
                  value={editContent.subheading || ''}
                  onChange={(e) => setEditContent({ ...editContent, subheading: e.target.value })}
                  className="w-full text-center bg-transparent border-b border-white/50 outline-none text-white resize-none"
                  rows={2}
                />
              ) : (
                content.subheading
              )}
            </p>
            {content.buttonText && (
              <button
                className="text-sm"
                style={{
                  backgroundColor: brand.colors.accent,
                  color: '#fff',
                  borderRadius: brand.buttonStyle.borderRadius,
                  padding: `${brand.buttonStyle.paddingY} ${brand.buttonStyle.paddingX}`,
                  fontWeight: brand.buttonStyle.fontWeight,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {editing ? (
                  <input
                    value={editContent.buttonText || ''}
                    onChange={(e) => setEditContent({ ...editContent, buttonText: e.target.value })}
                    className="bg-transparent outline-none text-white text-center w-32"
                  />
                ) : (
                  content.buttonText
                )}
              </button>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="py-12 px-8 max-w-3xl mx-auto">
            <h2
              style={{
                fontSize: brand.fonts.h2Size,
                fontFamily: brand.fonts.headingFamily,
                color: brand.colors.text,
                fontWeight: 600,
                marginBottom: '12px',
              }}
            >
              {editing ? (
                <input
                  value={editContent.heading || ''}
                  onChange={(e) => setEditContent({ ...editContent, heading: e.target.value })}
                  className="w-full border-b-2 border-primary-300 outline-none"
                  style={{ fontSize: brand.fonts.h2Size, color: brand.colors.text }}
                />
              ) : (
                content.heading
              )}
            </h2>
            <div style={{ color: brand.colors.textLight, lineHeight: 1.7, fontSize: brand.fonts.bodySize }}>
              {editing ? (
                <textarea
                  value={editContent.body || ''}
                  onChange={(e) => setEditContent({ ...editContent, body: e.target.value })}
                  className="w-full border border-surface-300 rounded p-2 outline-none resize-none"
                  rows={4}
                  style={{ color: brand.colors.textLight }}
                />
              ) : (
                content.body
              )}
            </div>
          </div>
        );

      case 'image-text':
        return (
          <div className="py-12 px-8 flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto">
            <div className="flex-1 relative group/img">
              <img
                src={content.imageUrl}
                alt={content.imageAlt || ''}
                className="w-full rounded-lg shadow-md"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              {(editing || hovered) && (
                <button
                  onClick={handleImageReplace}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"
                >
                  <ImageIcon size={14} className="text-surface-600" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2
                style={{
                  fontSize: brand.fonts.h2Size,
                  fontFamily: brand.fonts.headingFamily,
                  color: brand.colors.text,
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                {editing ? (
                  <input
                    value={editContent.heading || ''}
                    onChange={(e) => setEditContent({ ...editContent, heading: e.target.value })}
                    className="w-full border-b-2 border-primary-300 outline-none"
                    style={{ fontSize: brand.fonts.h2Size, color: brand.colors.text }}
                  />
                ) : (
                  content.heading
                )}
              </h2>
              <p style={{ color: brand.colors.textLight, lineHeight: 1.7, fontSize: brand.fonts.bodySize }}>
                {editing ? (
                  <textarea
                    value={editContent.body || ''}
                    onChange={(e) => setEditContent({ ...editContent, body: e.target.value })}
                    className="w-full border border-surface-300 rounded p-2 outline-none resize-none"
                    rows={4}
                    style={{ color: brand.colors.textLight }}
                  />
                ) : (
                  content.body
                )}
              </p>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div
            className="py-16 px-8 text-center"
            style={{ backgroundColor: brand.colors.surface }}
          >
            <h2
              style={{
                fontSize: brand.fonts.h2Size,
                fontFamily: brand.fonts.headingFamily,
                color: brand.colors.text,
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              {editing ? (
                <input
                  value={editContent.heading || ''}
                  onChange={(e) => setEditContent({ ...editContent, heading: e.target.value })}
                  className="w-full text-center border-b-2 border-primary-300 outline-none"
                  style={{ fontSize: brand.fonts.h2Size, color: brand.colors.text }}
                />
              ) : (
                content.heading
              )}
            </h2>
            <p className="mb-6" style={{ color: brand.colors.textLight }}>
              {editing ? (
                <input
                  value={editContent.subheading || ''}
                  onChange={(e) => setEditContent({ ...editContent, subheading: e.target.value })}
                  className="w-full text-center border-b border-surface-300 outline-none"
                  style={{ color: brand.colors.textLight }}
                />
              ) : (
                content.subheading
              )}
            </p>
            {content.buttonText && (
              <button
                style={{
                  backgroundColor: brand.colors.primary,
                  color: '#fff',
                  borderRadius: brand.buttonStyle.borderRadius,
                  padding: `${brand.buttonStyle.paddingY} ${brand.buttonStyle.paddingX}`,
                  fontWeight: brand.buttonStyle.fontWeight,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {content.buttonText}
              </button>
            )}
          </div>
        );

      case 'footer':
        return (
          <div
            className="py-8 px-8 text-center"
            style={{
              backgroundColor: brand.colors.text,
              color: brand.colors.surface,
            }}
          >
            <p className="font-semibold mb-2" style={{ fontFamily: brand.fonts.headingFamily }}>
              {content.heading}
            </p>
            <p className="text-sm opacity-70">{content.body}</p>
          </div>
        );

      default:
        return (
          <div className="py-8 px-8 text-center text-surface-400">
            Unknown section type: {section.type}
          </div>
        );
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {renderSection()}

      {/* Section controls overlay */}
      {hovered && !editing && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/95 rounded-lg shadow-lg p-1 z-10">
          <button
            onClick={() => { setEditContent(section.content); setEditing(true); }}
            className="p-1.5 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => moveSection(pageId, section.id, 'up')}
            disabled={index === 0}
            className="p-1.5 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded disabled:opacity-30"
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => moveSection(pageId, section.id, 'down')}
            disabled={index === totalSections - 1}
            className="p-1.5 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded disabled:opacity-30"
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={handleAddSection}
            className="p-1.5 text-surface-500 hover:text-green-600 hover:bg-green-50 rounded"
            title="Add section below"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => removeSection(pageId, section.id)}
            className="p-1.5 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="Remove section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Edit mode controls */}
      {editing && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/95 rounded-lg shadow-lg p-1 z-10">
          <button
            onClick={save}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
            title="Save"
          >
            <Save size={14} />
          </button>
          <button
            onClick={() => setEditing(false)}
            className="p-1.5 text-surface-500 hover:bg-surface-100 rounded"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Add section indicator between sections */}
      {hovered && !editing && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-8 h-0.5 bg-primary-400 rounded-full" />
        </div>
      )}
    </div>
  );
}
