import { Sparkles, Terminal } from "lucide-react";
import type { BeltItemData } from "./beltContent";

interface SkillBeltProps {
  items: BeltItemData[];
  direction: "up" | "down";
  side: "left" | "right";
}

export function SkillBelt({ items, direction, side }: SkillBeltProps) {
  if (!items || items.length === 0) return null;

  // Duplicate items 4 times to ensure seamless infinite vertical looping
  const displayItems = [...items, ...items, ...items, ...items];
  const isLeft = side === "left";
  const animationClass = direction === "up" ? "animate-marquee-up" : "animate-marquee-down";

  return (
    <aside
      aria-label={`${side} side belt marquee`}
      className={`fixed top-0 bottom-0 z-20 w-16 md:w-20 hidden lg:flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none ${
        isLeft ? "left-2 md:left-4" : "right-2 md:right-4"
      }`}
    >
      {/* Top and Bottom Edge Fade Masks */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020617] via-[#020617]/70 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent z-10" />

      {/* Vertical Animated Belt Strip */}
      <div
        className={`flex flex-col items-center gap-8 opacity-35 hover:opacity-90 transition-opacity duration-300 pointer-events-auto cursor-default py-12 ${animationClass}`}
      >
        {displayItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex flex-col items-center gap-2 group"
          >
            {/* Glyph / Dot */}
            <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-purple-400/80 group-hover:text-cyan-300 group-hover:border-cyan-400/40 group-hover:scale-110 transition-all duration-200">
              {isLeft ? (
                <Terminal className="w-3 h-3" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
            </div>

            {/* Vertical or Rotated Tag Label */}
            <span 
              className="text-[11px] font-mono tracking-wider text-slate-400 group-hover:text-slate-100 whitespace-nowrap transition-colors [writing-mode:vertical-lr] rotate-180 py-1"
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
