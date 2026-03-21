import { useStore } from '../../store/useStore';
import { ChatPanel } from '../chat/ChatPanel';
import { SkillPanel } from '../skills/SkillPanel';
import { WebsiteCanvas } from '../canvas/WebsiteCanvas';
import { MessageSquare, Layers } from 'lucide-react';

export function AppLayout() {
  const leftPanelView = useStore((s) => s.leftPanelView);
  const setLeftPanelView = useStore((s) => s.setLeftPanelView);

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <div className="w-[420px] min-w-[420px] border-r border-surface-200 flex flex-col bg-white">
        {/* Panel Toggle */}
        <div className="flex border-b border-surface-200">
          <button
            onClick={() => setLeftPanelView('chat')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              leftPanelView === 'chat'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
            }`}
          >
            <MessageSquare size={16} />
            AI Chat
          </button>
          <button
            onClick={() => setLeftPanelView('skills')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              leftPanelView === 'skills'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
            }`}
          >
            <Layers size={16} />
            Skills
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          {leftPanelView === 'chat' ? <ChatPanel /> : <SkillPanel />}
        </div>
      </div>

      {/* Right Canvas */}
      <div className="flex-1 overflow-hidden bg-surface-100">
        <WebsiteCanvas />
      </div>
    </div>
  );
}
