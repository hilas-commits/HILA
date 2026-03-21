import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Pencil, Save } from 'lucide-react';
import type { BrandGuide, ColorPalette } from '../../types';

export function BrandGuideSkill() {
  const brand = useStore((s) => s.skillData['brand-guide']);
  const setBrandGuide = useStore((s) => s.setBrandGuide);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<BrandGuide | null>(brand);

  if (!brand) {
    return (
      <p className="text-sm text-surface-400 italic">
        Brand guide will be generated after you describe your business.
      </p>
    );
  }

  if (editing && form) {
    return (
      <div className="space-y-4">
        <Section title="Colors">
          {(Object.keys(form.colors) as (keyof ColorPalette)[]).map((key) => (
            <div key={key} className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={form.colors[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    colors: { ...form.colors, [key]: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-surface-300 cursor-pointer"
              />
              <span className="text-xs text-surface-600 capitalize flex-1">{key}</span>
              <span className="text-xs text-surface-400 font-mono">{form.colors[key]}</span>
            </div>
          ))}
        </Section>

        <Section title="Typography">
          <SmallField label="Heading Font" value={form.fonts.headingFamily} onChange={(v) => setForm({ ...form, fonts: { ...form.fonts, headingFamily: v } })} />
          <SmallField label="Body Font" value={form.fonts.bodyFamily} onChange={(v) => setForm({ ...form, fonts: { ...form.fonts, bodyFamily: v } })} />
          <SmallField label="H1 Size" value={form.fonts.h1Size} onChange={(v) => setForm({ ...form, fonts: { ...form.fonts, h1Size: v } })} />
          <SmallField label="H2 Size" value={form.fonts.h2Size} onChange={(v) => setForm({ ...form, fonts: { ...form.fonts, h2Size: v } })} />
          <SmallField label="Body Size" value={form.fonts.bodySize} onChange={(v) => setForm({ ...form, fonts: { ...form.fonts, bodySize: v } })} />
        </Section>

        <Section title="Buttons">
          <SmallField label="Border Radius" value={form.buttonStyle.borderRadius} onChange={(v) => setForm({ ...form, buttonStyle: { ...form.buttonStyle, borderRadius: v } })} />
          <SmallField label="Font Weight" value={form.buttonStyle.fontWeight} onChange={(v) => setForm({ ...form, buttonStyle: { ...form.buttonStyle, fontWeight: v } })} />
          <SmallField label="Text Transform" value={form.buttonStyle.textTransform} onChange={(v) => setForm({ ...form, buttonStyle: { ...form.buttonStyle, textTransform: v } })} />
        </Section>

        <div className="flex gap-2">
          <button onClick={() => { setBrandGuide(form); setEditing(false); }} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Save size={12} /> Save
          </button>
          <button onClick={() => { setForm(brand); setEditing(false); }} className="px-3 py-1.5 text-xs bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Brand Guide</h4>
        <button onClick={() => { setForm(brand); setEditing(true); }} className="p-1 text-surface-400 hover:text-primary-600">
          <Pencil size={14} />
        </button>
      </div>

      {/* Color palette */}
      <div>
        <p className="text-xs text-surface-400 mb-2">Color Palette</p>
        <div className="flex gap-1.5 flex-wrap">
          {(Object.entries(brand.colors) as [string, string][]).map(([name, color]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-lg border border-surface-200 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-surface-400 capitalize">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <p className="text-xs text-surface-400 mb-2">Typography</p>
        <div className="space-y-1">
          <p className="text-lg font-semibold" style={{ fontFamily: brand.fonts.headingFamily }}>
            {brand.fonts.headingFamily} — Heading
          </p>
          <p className="text-sm" style={{ fontFamily: brand.fonts.bodyFamily }}>
            {brand.fonts.bodyFamily} — Body text at {brand.fonts.bodySize}
          </p>
        </div>
      </div>

      {/* Button preview */}
      <div>
        <p className="text-xs text-surface-400 mb-2">Button Style</p>
        <button
          className="text-white text-sm"
          style={{
            backgroundColor: brand.colors.primary,
            borderRadius: brand.buttonStyle.borderRadius,
            padding: `${brand.buttonStyle.paddingY} ${brand.buttonStyle.paddingX}`,
            fontWeight: brand.buttonStyle.fontWeight,
            fontSize: brand.buttonStyle.fontSize,
            textTransform: brand.buttonStyle.textTransform as 'none',
          }}
        >
          Sample Button
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-surface-500 mb-2">{title}</p>
      {children}
    </div>
  );
}

function SmallField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-xs text-surface-400 min-w-[90px]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-xs border border-surface-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}
