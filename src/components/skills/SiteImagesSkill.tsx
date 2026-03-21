import { useStore } from '../../store/useStore';
import { v4 as uuid } from 'uuid';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export function SiteImagesSkill() {
  const images = useStore((s) => s.skillData['site-images']);
  const addSiteImage = useStore((s) => s.addSiteImage);
  const removeSiteImage = useStore((s) => s.removeSiteImage);
  const [showAdd, setShowAdd] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', alt: '', category: 'general' });

  if (images.length === 0 && !showAdd) {
    return (
      <p className="text-sm text-surface-400 italic">
        Site images will be generated after you describe your business.
      </p>
    );
  }

  const handleAdd = () => {
    if (!newImage.url.trim()) return;
    addSiteImage({
      id: uuid(),
      url: newImage.url,
      alt: newImage.alt || 'Site image',
      category: newImage.category,
    });
    setNewImage({ url: '', alt: '', category: 'general' });
    setShowAdd(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addSiteImage({
      id: uuid(),
      url,
      alt: file.name,
      category: 'uploaded',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          Images ({images.length})
        </h4>
        <div className="flex gap-1">
          <label className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg cursor-pointer">
            <ImageIcon size={12} /> Upload
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            <Plus size={12} /> Add URL
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="p-3 bg-surface-50 rounded-lg space-y-2 border border-surface-200">
          <input value={newImage.url} onChange={(e) => setNewImage({ ...newImage, url: e.target.value })} placeholder="Image URL" className="w-full px-2 py-1.5 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
          <input value={newImage.alt} onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })} placeholder="Alt text" className="w-full px-2 py-1.5 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500" />
          <select value={newImage.category} onChange={(e) => setNewImage({ ...newImage, category: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500">
            <option value="hero">Hero</option>
            <option value="about">About</option>
            <option value="feature">Feature</option>
            <option value="background">Background</option>
            <option value="general">General</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1 text-xs bg-surface-200 text-surface-600 rounded hover:bg-surface-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-surface-200">
            <img src={img.url} alt={img.alt} className="w-full h-24 object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                onClick={() => removeSiteImage(img.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-[10px] truncate">
              {img.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
