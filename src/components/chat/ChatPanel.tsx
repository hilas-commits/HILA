import { useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { SkillId } from '../../types';
import {
  parseBusinessInput,
  generateBrandGuide,
  generateSiteStructure,
  generateSiteImages,
  generateSiteTexts,
  getDefaultInspirationImages,
} from '../../store/aiSimulator';
import { Sparkles } from 'lucide-react';

const DEFAULT_PROMPT = `Hi! I'm your AI site builder assistant. Tell me about your business and I'll help you create a website.

Please share:
• **Business name** and **type**
• **Target audience**
• **Brand values** (e.g., modern, trustworthy, fun)
• **Site goals** (e.g., generate leads, sell products)

Or just describe your business naturally and I'll figure out the rest!`;

const SKILL_PROMPTS: Record<SkillId, string> = {
  'site-description': 'Tell me more about your business, or I can refine the description I have.',
  'brand-guide': 'I can adjust colors, fonts, or button styles. What would you like to change?',
  'site-structure': 'Want to add, remove, or rename any pages?',
  'site-images': 'I can generate new images or replace existing ones. What do you need?',
  'site-text': 'Which page\'s text would you like me to write or edit?',
  'inspiration': 'Select inspiration images to influence the design style, or upload your own.',
};

export function ChatPanel() {
  const messages = useStore((s) => s.messages);
  const activeSkill = useStore((s) => s.activeSkill);
  const isProcessing = useStore((s) => s.isProcessing);
  const addMessage = useStore((s) => s.addMessage);
  const setActiveSkill = useStore((s) => s.setActiveSkill);
  const setIsProcessing = useStore((s) => s.setIsProcessing);
  const setLeftPanelView = useStore((s) => s.setLeftPanelView);

  const setSiteDescription = useStore((s) => s.setSiteDescription);
  const setBrandGuide = useStore((s) => s.setBrandGuide);
  const addPage = useStore((s) => s.addPage);
  const addSiteImage = useStore((s) => s.addSiteImage);
  const addPageText = useStore((s) => s.addPageText);
  const addInspirationImage = useStore((s) => s.addInspirationImage);
  const skillData = useStore((s) => s.skillData);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    addMessage('user', text, activeSkill || undefined);
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 800));

    if (!activeSkill && !skillData['site-description']) {
      // First input - parse business description and generate everything
      const desc = parseBusinessInput(text);
      setSiteDescription(desc);

      addMessage(
        'assistant',
        `Great! I've analyzed your business. Here's what I got:\n\n**${desc.businessName}** — ${desc.businessType}\n**Audience:** ${desc.targetAudience}\n**Values:** ${desc.brandValues.join(', ')}\n**Goals:** ${desc.businessGoals.join(', ')}\n\n${desc.summary}\n\nNow generating your brand guide, site structure, images, and text...`,
      );

      await new Promise((r) => setTimeout(r, 500));

      // Generate brand guide
      const brand = generateBrandGuide(desc);
      setBrandGuide(brand);

      // Generate site structure
      const pages = generateSiteStructure(desc);
      pages.forEach((page) => addPage(page));

      // Generate site images
      const images = generateSiteImages(desc, brand);
      images.forEach((img) => addSiteImage(img));

      // Generate site text
      const texts = generateSiteTexts(desc, pages);
      texts.forEach((t) => addPageText(t));

      // Load inspiration presets
      const inspirationImages = getDefaultInspirationImages();
      inspirationImages.forEach((img) => addInspirationImage(img));

      addMessage(
        'assistant',
        `All done! I've prepared:\n\n✅ **Site Description**\n✅ **Brand Guide** — colors, fonts, and button styles\n✅ **Site Structure** — ${pages.length} pages\n✅ **Site Images** — ${images.length} images\n✅ **Site Text** — content for each page\n✅ **Inspiration** — ${inspirationImages.length} style presets\n\nSwitch to the **Skills** tab to review and edit each section. When you're ready, hit **Generate Site** to build your website!`,
      );

      setLeftPanelView('skills');
    } else if (activeSkill) {
      // Handle skill-specific interactions
      addMessage(
        'assistant',
        `I'll update the ${activeSkill.replace('-', ' ')} based on your input. You can review the changes in the Skills panel.`,
        activeSkill,
      );
    } else {
      addMessage(
        'assistant',
        'Your site is already configured! Switch to the **Skills** tab to edit specific sections, or tell me what you\'d like to change.',
      );
    }

    setIsProcessing(false);
  };

  const handleSkillSelect = (skill: SkillId) => {
    setActiveSkill(skill);
    addMessage('assistant', SKILL_PROMPTS[skill], skill);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <Sparkles className="text-primary-600" size={24} />
            </div>
            <div className="text-sm text-surface-600 whitespace-pre-line leading-relaxed">
              {DEFAULT_PROMPT.split('\n').map((line, i) => (
                <p key={i} className="mb-1">
                  {line.includes('**') ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isProcessing && (
          <div className="flex gap-2 items-center text-sm text-surface-400 pl-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            Thinking...
          </div>
        )}
      </div>

      {/* Skill selector */}
      {activeSkill && (
        <div className="px-4 py-2 border-t border-surface-200 bg-primary-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary-700">
              Editing: {activeSkill.replace(/-/g, ' ')}
            </span>
            <button
              onClick={() => setActiveSkill(null)}
              className="text-xs text-primary-600 hover:text-primary-800"
            >
              Exit skill
            </button>
          </div>
        </div>
      )}

      {/* Quick skill triggers */}
      {!activeSkill && skillData['site-description'] && (
        <div className="px-4 py-2 border-t border-surface-200">
          <p className="text-xs text-surface-400 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-1">
            {(
              [
                'site-description',
                'brand-guide',
                'site-structure',
                'site-images',
                'site-text',
                'inspiration',
              ] as SkillId[]
            ).map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillSelect(skill)}
                className="px-2 py-1 text-xs rounded-full bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-600 transition-colors capitalize"
              >
                {skill.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isProcessing} />
    </div>
  );
}
