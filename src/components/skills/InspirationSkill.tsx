import { useStore } from '../../store/useStore';
import { v4 as uuid } from 'uuid';
import { Check, Upload, Trash2 } from 'lucide-react';

export function InspirationSkill() {
  const images = useStore((s) => s.skillData.inspiration);
  const addInspirationImage = useStore((s) => s.addInspirationImage);
  const removeInspirationImage = useStore((s) => s.removeInspirationImage);
  const toggleInspirationImage = useStore((s) => s.toggleInspirationImage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addInspirationImage({
      id: uuid(),
      url,
      label: file.name.replace(/\.[^.]+$/, ''),
      source: 'user',
      selected: true,
    });
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-surface-400 italic mb-3">
          Inspiration images will be loaded after you describe your business.
        </p>
        <label className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary-600 border border-primary-300 rounded-lg cursor-pointer hover:bg-primary-50">
          <Upload size={16} /> Upload Image
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    );
  }

  const selectedCount = images.filter((img) => img.selected).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          Inspiration ({selectedCount} selected)
        </h4>
        <label className="flex items-center gap-1 px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg cursor-pointer">
          <Upload size={12} /> Upload
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <p className="text-xs text-surface-400">
        Select images to influence the brand guide and design style.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => toggleInspirationImage(img.id)}
            className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all group ${
              img.selected
                ? 'border-primary-500 shadow-md'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <img src={img.url} alt={img.label} className="w-full h-24 object-cover" />
            {img.selected && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-[10px] flex justify-between items-center">
              <span className="truncate">{img.label}</span>
              {img.source === 'user' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeInspirationImage(img.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
            {img.source === 'user' && (
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/50 text-white text-[9px] rounded">
                Custom
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
