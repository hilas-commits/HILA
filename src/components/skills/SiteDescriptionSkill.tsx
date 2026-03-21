import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Pencil, Save } from 'lucide-react';

export function SiteDescriptionSkill() {
  const desc = useStore((s) => s.skillData['site-description']);
  const setSiteDescription = useStore((s) => s.setSiteDescription);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(desc);

  if (!desc) {
    return (
      <p className="text-sm text-surface-400 italic">
        Start a conversation in the Chat tab to generate your site description.
      </p>
    );
  }

  if (editing && form) {
    return (
      <div className="space-y-3">
        <Field label="Business Name" value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} />
        <Field label="Business Type" value={form.businessType} onChange={(v) => setForm({ ...form, businessType: v })} />
        <Field label="Target Audience" value={form.targetAudience} onChange={(v) => setForm({ ...form, targetAudience: v })} />
        <Field label="Brand Values" value={form.brandValues.join(', ')} onChange={(v) => setForm({ ...form, brandValues: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
        <Field label="Business Goals" value={form.businessGoals.join(', ')} onChange={(v) => setForm({ ...form, businessGoals: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
        <TextAreaField label="Summary" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} />
        <div className="flex gap-2">
          <button
            onClick={() => { setSiteDescription(form); setEditing(false); }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Save size={12} /> Save
          </button>
          <button
            onClick={() => { setForm(desc); setEditing(false); }}
            className="px-3 py-1.5 text-xs bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Overview</h4>
        <button onClick={() => { setForm(desc); setEditing(true); }} className="p-1 text-surface-400 hover:text-primary-600">
          <Pencil size={14} />
        </button>
      </div>
      <InfoRow label="Name" value={desc.businessName} />
      <InfoRow label="Type" value={desc.businessType} />
      <InfoRow label="Audience" value={desc.targetAudience} />
      <InfoRow label="Values" value={desc.brandValues.join(', ')} />
      <InfoRow label="Goals" value={desc.businessGoals.join(', ')} />
      <p className="text-xs text-surface-500 mt-2 leading-relaxed">{desc.summary}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-surface-400 min-w-[70px]">{label}:</span>
      <span className="text-surface-800">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-surface-500 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-surface-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-1.5 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
      />
    </div>
  );
}
