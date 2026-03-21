import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuid } from 'uuid';
import { ChevronDown, ChevronRight, Pencil, Save, Plus, Trash2, X } from 'lucide-react';

export function SiteTextSkill() {
  const texts = useStore((s) => s.skillData['site-text']);
  const updatePageText = useStore((s) => s.updatePageText);
  const removePageText = useStore((s) => s.removePageText);
  const addPageText = useStore((s) => s.addPageText);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ heading: '', body: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  if (texts.length === 0 && !showAdd) {
    return (
      <p className="text-sm text-surface-400 italic">
        Site text will be generated after you describe your business.
      </p>
    );
  }

  const handleAddPage = () => {
    if (!newPageName.trim()) return;
    addPageText({
      pageId: uuid(),
      pageName: newPageName,
      sections: [{ id: uuid(), heading: 'Main Content', body: 'Enter your content here...' }],
    });
    setNewPageName('');
    setShowAdd(false);
  };

  const handleAddSection = (pageId: string) => {
    const pageText = texts.find((t) => t.pageId === pageId);
    if (!pageText) return;
    updatePageText(pageId, {
      sections: [...pageText.sections, { id: uuid(), heading: 'New Section', body: 'Content goes here...' }],
    });
  };

  const handleDeleteSection = (pageId: string, sectionId: string) => {
    const pageText = texts.find((t) => t.pageId === pageId);
    if (!pageText) return;
    updatePageText(pageId, {
      sections: pageText.sections.filter((s) => s.id !== sectionId),
    });
  };

  const startEditSection = (section: { id: string; heading: string; body: string }) => {
    setEditingSection(section.id);
    setEditForm({ heading: section.heading, body: section.body });
  };

  const saveSection = (pageId: string, sectionId: string) => {
    const pageText = texts.find((t) => t.pageId === pageId);
    if (!pageText) return;
    updatePageText(pageId, {
      sections: pageText.sections.map((s) =>
        s.id === sectionId ? { ...s, ...editForm } : s
      ),
    });
    setEditingSection(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          Page Content ({texts.length} pages)
        </h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          <Plus size={12} /> Add Page
        </button>
      </div>

      {showAdd && (
        <div className="p-3 bg-surface-50 rounded-lg space-y-2 border border-surface-200">
          <input value={newPageName} onChange={(e) => setNewPageName(e.target.value)} placeholder="Page name" className="w-full px-2 py-1.5 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
          <div className="flex gap-2">
            <button onClick={handleAddPage} className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1 text-xs bg-surface-200 text-surface-600 rounded hover:bg-surface-300">Cancel</button>
          </div>
        </div>
      )}

      {texts.map((pageText) => (
        <div key={pageText.pageId} className="border border-surface-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedPage(expandedPage === pageText.pageId ? null : pageText.pageId)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-surface-50 hover:bg-surface-100 text-left"
          >
            {expandedPage === pageText.pageId ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="text-sm font-medium text-surface-800 flex-1">{pageText.pageName}</span>
            <span className="text-xs text-surface-400">{pageText.sections.length} sections</span>
            <button
              onClick={(e) => { e.stopPropagation(); removePageText(pageText.pageId); }}
              className="p-1 text-surface-300 hover:text-red-500"
            >
              <Trash2 size={12} />
            </button>
          </button>

          {expandedPage === pageText.pageId && (
            <div className="p-3 space-y-2">
              {pageText.sections.map((section) => (
                <div key={section.id} className="p-2.5 bg-white rounded border border-surface-200 group">
                  {editingSection === section.id ? (
                    <div className="space-y-2">
                      <input
                        value={editForm.heading}
                        onChange={(e) => setEditForm({ ...editForm, heading: e.target.value })}
                        className="w-full px-2 py-1 text-xs font-medium border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <textarea
                        value={editForm.body}
                        onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                        rows={3}
                        className="w-full px-2 py-1 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                      />
                      <div className="flex gap-1">
                        <button onClick={() => saveSection(pageText.pageId, section.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={12} /></button>
                        <button onClick={() => setEditingSection(null)} className="p-1 text-surface-400 hover:bg-surface-100 rounded"><X size={12} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <h5 className="text-xs font-semibold text-surface-700">{section.heading}</h5>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditSection(section)} className="p-0.5 text-surface-400 hover:text-primary-600"><Pencil size={10} /></button>
                          <button onClick={() => handleDeleteSection(pageText.pageId, section.id)} className="p-0.5 text-surface-400 hover:text-red-500"><Trash2 size={10} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-surface-500 mt-1 leading-relaxed line-clamp-3">{section.body}</p>
                    </>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleAddSection(pageText.pageId)}
                className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs text-primary-600 border border-dashed border-primary-300 rounded-lg hover:bg-primary-50"
              >
                <Plus size={12} /> Add Section
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
