import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuid } from 'uuid';
import { Plus, Trash2, GripVertical, Pencil, Save, X } from 'lucide-react';
import type { SitePage } from '../../types';

export function SiteStructureSkill() {
  const pages = useStore((s) => s.skillData['site-structure']);
  const addPage = useStore((s) => s.addPage);
  const removePage = useStore((s) => s.removePage);
  const updatePage = useStore((s) => s.updatePage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SitePage>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newPage, setNewPage] = useState({ name: '', slug: '', description: '' });

  if (pages.length === 0) {
    return (
      <p className="text-sm text-surface-400 italic">
        Site structure will be generated after you describe your business.
      </p>
    );
  }

  const handleAdd = () => {
    if (!newPage.name.trim()) return;
    addPage({
      id: uuid(),
      name: newPage.name,
      slug: newPage.slug || newPage.name.toLowerCase().replace(/\s+/g, '-'),
      description: newPage.description,
      sections: ['Content'],
    });
    setNewPage({ name: '', slug: '', description: '' });
    setShowAdd(false);
  };

  const startEdit = (page: SitePage) => {
    setEditingId(page.id);
    setEditForm({ name: page.name, slug: page.slug, description: page.description });
  };

  const saveEdit = (id: string) => {
    updatePage(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          Pages ({pages.length})
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
          <input
            value={newPage.name}
            onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
            placeholder="Page name"
            className="w-full px-2 py-1.5 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <input
            value={newPage.description}
            onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
            placeholder="Page description"
            className="w-full px-2 py-1.5 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1 text-xs bg-surface-200 text-surface-600 rounded hover:bg-surface-300">Cancel</button>
          </div>
        </div>
      )}

      {pages.map((page) => (
        <div
          key={page.id}
          className="flex items-start gap-2 p-2.5 bg-surface-50 rounded-lg border border-surface-200 group"
        >
          <GripVertical size={14} className="text-surface-300 mt-0.5 shrink-0" />
          {editingId === page.id ? (
            <div className="flex-1 space-y-1.5">
              <input
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <input
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <div className="flex gap-1">
                <button onClick={() => saveEdit(page.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                  <Save size={12} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1 text-surface-400 hover:bg-surface-100 rounded">
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800">{page.name}</p>
                <p className="text-xs text-surface-400 truncate">{page.description}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {page.sections.map((sec) => (
                    <span key={sec} className="px-1.5 py-0.5 text-[10px] bg-surface-200 text-surface-500 rounded">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(page)} className="p-1 text-surface-400 hover:text-primary-600">
                  <Pencil size={12} />
                </button>
                <button onClick={() => removePage(page.id)} className="p-1 text-surface-400 hover:text-red-500">
                  <Trash2 size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
