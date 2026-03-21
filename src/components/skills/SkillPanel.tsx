import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { SiteDescriptionSkill } from './SiteDescriptionSkill';
import { BrandGuideSkill } from './BrandGuideSkill';
import { SiteStructureSkill } from './SiteStructureSkill';
import { SiteImagesSkill } from './SiteImagesSkill';
import { SiteTextSkill } from './SiteTextSkill';
import { InspirationSkill } from './InspirationSkill';
import type { SkillId } from '../../types';
import {
  FileText,
  Palette,
  Layout,
  Image,
  Type,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Rocket,
} from 'lucide-react';

const SKILLS: { id: SkillId; label: string; icon: React.ReactNode }[] = [
  { id: 'site-description', label: 'Site Description', icon: <FileText size={16} /> },
  { id: 'brand-guide', label: 'Brand Guide', icon: <Palette size={16} /> },
  { id: 'site-structure', label: 'Site Structure', icon: <Layout size={16} /> },
  { id: 'site-images', label: 'Site Images', icon: <Image size={16} /> },
  { id: 'site-text', label: 'Site Text', icon: <Type size={16} /> },
  { id: 'inspiration', label: 'Inspiration', icon: <Lightbulb size={16} /> },
];

export function SkillPanel() {
  const [expandedSkill, setExpandedSkill] = useState<SkillId | null>('site-description');
  const skillData = useStore((s) => s.skillData);
  const generateSite = useStore((s) => s.generateSite);
  const generatedSite = useStore((s) => s.generatedSite);

  const hasContent = (id: SkillId): boolean => {
    switch (id) {
      case 'site-description':
        return !!skillData['site-description'];
      case 'brand-guide':
        return !!skillData['brand-guide'];
      case 'site-structure':
        return skillData['site-structure'].length > 0;
      case 'site-images':
        return skillData['site-images'].length > 0;
      case 'site-text':
        return skillData['site-text'].length > 0;
      case 'inspiration':
        return skillData.inspiration.length > 0;
    }
  };

  const allReady =
    hasContent('site-description') &&
    hasContent('brand-guide') &&
    hasContent('site-structure');

  const toggleSkill = (id: SkillId) => {
    setExpandedSkill(expandedSkill === id ? null : id);
  };

  const renderSkillContent = (id: SkillId) => {
    switch (id) {
      case 'site-description':
        return <SiteDescriptionSkill />;
      case 'brand-guide':
        return <BrandGuideSkill />;
      case 'site-structure':
        return <SiteStructureSkill />;
      case 'site-images':
        return <SiteImagesSkill />;
      case 'site-text':
        return <SiteTextSkill />;
      case 'inspiration':
        return <InspirationSkill />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {SKILLS.map((skill) => (
          <div key={skill.id} className="border-b border-surface-200">
            <button
              onClick={() => toggleSkill(skill.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors text-left"
            >
              <span className={hasContent(skill.id) ? 'text-primary-600' : 'text-surface-400'}>
                {skill.icon}
              </span>
              <span className="flex-1 text-sm font-medium text-surface-800">
                {skill.label}
              </span>
              {hasContent(skill.id) && (
                <span className="w-2 h-2 rounded-full bg-green-500" />
              )}
              {expandedSkill === skill.id ? (
                <ChevronDown size={16} className="text-surface-400" />
              ) : (
                <ChevronRight size={16} className="text-surface-400" />
              )}
            </button>
            {expandedSkill === skill.id && (
              <div className="px-4 pb-4">{renderSkillContent(skill.id)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-surface-200">
        <button
          onClick={generateSite}
          disabled={!allReady}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Rocket size={18} />
          {generatedSite ? 'Regenerate Site' : 'Generate Site'}
        </button>
        {!allReady && (
          <p className="text-xs text-surface-400 text-center mt-2">
            Complete Site Description, Brand Guide, and Site Structure to generate
          </p>
        )}
      </div>
    </div>
  );
}
