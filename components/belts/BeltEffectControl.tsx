"use client";

import { useState } from "react";
import { Sparkles, Sliders, Check } from "lucide-react";
import type { BeltEffectMode } from "./SideBelt";
import { updateBeltEffectAction } from "@/actions/theme-actions";

interface BeltEffectControlProps {
  currentEffect: BeltEffectMode;
  onEffectChange: (effect: BeltEffectMode) => void;
}

const EFFECTS: { id: BeltEffectMode; label: string; desc: string }[] = [
  { id: "plasma-prism", label: "Plasma Prism", desc: "Animated plasma beam & optical glass chamber" },
  { id: "magnifier", label: "Magnifier Lens", desc: "Convex optical zoom lens with refraction" },
  { id: "deep-light", label: "Deep Light", desc: "Volumetric atmospheric light cone & laser blade" },
  { id: "text-focus", label: "Text Focus", desc: "Minimalist spotlight with crisp text illumination" },
];

export function BeltEffectControl({ currentEffect, onEffectChange }: BeltEffectControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (effectId: BeltEffectMode) => {
    onEffectChange(effectId);
    setSaving(true);
    try {
      await updateBeltEffectAction(effectId);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed bottom-3 left-4 z-40 select-none">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-2 p-3 rounded-2xl glass-panel border border-white/15 bg-[#121215]/95 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 w-64 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Belt Light Effects</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {saving ? "Saving..." : "Admin Control"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {EFFECTS.map((eff) => {
              const isSelected = currentEffect === eff.id;
              return (
                <button
                  key={eff.id}
                  onClick={() => handleSelect(eff.id)}
                  className={`flex flex-col text-left p-2 rounded-xl text-xs font-mono transition-all ${
                    isSelected
                      ? "bg-zinc-800 text-amber-300 border border-amber-400/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full font-semibold">
                    <span>{eff.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-tight">
                    {eff.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-400 hover:text-amber-300 shadow-lg transition-all"
        title="Switch Belt Light Effect"
      >
        <Sliders className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Belt Effect:</span>
        <span className="text-zinc-200 font-bold capitalize">
          {currentEffect.replace("-", " ")}
        </span>
      </button>
    </div>
  );
}
