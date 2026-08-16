import type { BeltItem } from "@prisma/client";
import { Sparkles } from "lucide-react";

interface BeltMarqueeProps {
  items: BeltItem[];
}

export function BeltMarquee({ items }: BeltMarqueeProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Duplicate items to ensure smooth continuous marquee loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden py-3 my-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-6 whitespace-nowrap animate-ticker">
        {displayItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] border border-white/10 text-slate-300 transition-colors group-hover:border-purple-500/30"
          >
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
