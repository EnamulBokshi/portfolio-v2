"use client";

import { useState } from "react";
import { Sparkles, Palette, Save, Check, Loader2 } from "lucide-react";
import type { ThemeConfig } from "@prisma/client";
import { updateThemeConfigAction, updateBeltEffectAction } from "@/actions/theme-actions";
import type { BeltEffectMode } from "@/components/belts/SideBelt";

interface ThemeManagerProps {
  initialTheme: ThemeConfig | null;
}

const BELT_EFFECTS: { id: BeltEffectMode; label: string; desc: string }[] = [
  { id: "plasma-prism", label: "Plasma Prism", desc: "Optical glass chamber with amber plasma filament beam" },
  { id: "magnifier", label: "Magnifier Lens", desc: "Organic 3D convex zoom physics with 60fps center focus" },
  { id: "deep-light", label: "Deep Light", desc: "Volumetric atmospheric light cone & laser filament blade" },
  { id: "text-focus", label: "Text Focus", desc: "Ultra-sharp 100% white luminance with crisp contrast and zero boxes" },
];

export function ThemeManager({ initialTheme }: ThemeManagerProps) {
  const [accentColor, setAccentColor] = useState(initialTheme?.accentColor || "#F59E0B");
  const [accentSecondary, setAccentSecondary] = useState(initialTheme?.accentSecondary || "#FBBF24");
  const [bodyBaseColor, setBodyBaseColor] = useState(initialTheme?.bodyBaseColor || "#09090b");
  const [bodySecondaryColor, setBodySecondaryColor] = useState(initialTheme?.bodySecondaryColor || "#121215");
  const [beltEffect, setBeltEffect] = useState<BeltEffectMode>(
    (initialTheme?.beltEffect as BeltEffectMode) || "plasma-prism"
  );
  const [glassBlurPx, setGlassBlurPx] = useState(initialTheme?.glassBlurPx || 24);
  const [glassOpacity, setGlassOpacity] = useState(initialTheme?.glassOpacity || 0.06);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateThemeConfigAction({
        accentColor,
        accentSecondary,
        bodyBaseColor,
        bodySecondaryColor,
        beltEffect,
        glassBlurPx: Number(glassBlurPx),
        glassOpacity: Number(glassOpacity),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEffectSelect = async (effId: BeltEffectMode) => {
    setBeltEffect(effId);
    try {
      await updateBeltEffectAction(effId);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Theme & Optical Effects</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Configure global design tokens, glassmorphism parameters, and active belt light physics
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono animate-in fade-in duration-150">
            <Check className="w-3.5 h-3.5" />
            <span>Theme Saved Live</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Belt Light Effect Mode Selector */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-white font-heading">
              Active Belt Light & Magnifier Effect
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BELT_EFFECTS.map((eff) => {
              const isSelected = beltEffect === eff.id;
              return (
                <button
                  key={eff.id}
                  type="button"
                  onClick={() => handleEffectSelect(eff.id)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "border-amber-400/50 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono font-bold text-xs text-white">
                      {eff.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {eff.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Color Tokens */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Palette className="w-4 h-4 text-purple-400" />
            <h2 className="font-bold text-sm text-white font-heading">
              Color Tokens & Stage Atmosphere
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Primary Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Secondary Accent / Contrast</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentSecondary}
                  onChange={(e) => setAccentSecondary(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={accentSecondary}
                  onChange={(e) => setAccentSecondary(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Canvas Base Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bodyBaseColor}
                  onChange={(e) => setBodyBaseColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={bodyBaseColor}
                  onChange={(e) => setBodyBaseColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1">Deep Gradient Bloom Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bodySecondaryColor}
                  onChange={(e) => setBodySecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={bodySecondaryColor}
                  onChange={(e) => setBodySecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Glassmorphic Surface Settings */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <h2 className="font-bold text-sm text-white font-heading pb-3 border-b border-white/5">
            Glass Surface & Backdrop Blur
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                <span>Backdrop Blur</span>
                <span className="text-amber-400 font-bold">{glassBlurPx}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                value={glassBlurPx}
                onChange={(e) => setGlassBlurPx(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                <span>Surface Opacity</span>
                <span className="text-amber-400 font-bold">{(glassOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.3}
                step={0.01}
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Theme Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
