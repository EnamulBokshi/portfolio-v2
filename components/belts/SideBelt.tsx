interface SideBeltProps {
  side: "left" | "right";
  items: string[];
}

export function SideBelt({ side, items }: SideBeltProps) {
  const isLeft = side === "left";
  const animationClass = isLeft ? "animate-marquee-up" : "animate-marquee-down";

  // Quadruple items to make the infinite vertical loop completely smooth
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <aside
      aria-label={`${side} side belt`}
      className={`fixed top-0 bottom-0 z-20 w-12 sm:w-16 md:w-20 hidden sm:flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none ${
        isLeft ? "left-0 sm:left-3 border-r border-white/[0.04]" : "right-0 sm:right-3 border-l border-white/[0.04]"
      }`}
    >
      {/* ── 1. Soft Warm Amber Ambient Backlight Beam in the Center ── */}
      <div 
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 w-28 h-80 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245, 158, 11, 0.22) 0%, rgba(251, 191, 36, 0.08) 40%, transparent 80%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── 2. Top & Bottom Natural Falloff Gradients ── */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#09090b] via-[#09090b]/90 to-transparent z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent z-20" />

      {/* ── 3. Subtle Vertical Guide Line with Center Amber Light ── */}
      <div 
        aria-hidden="true"
        className={`absolute top-0 bottom-0 w-[1px] pointer-events-none z-10 ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background: "linear-gradient(to bottom, transparent 15%, rgba(255, 255, 255, 0.05) 35%, rgba(245, 158, 11, 0.4) 50%, rgba(255, 255, 255, 0.05) 65%, transparent 85%)",
        }}
      />

      {/* ── 4. Vertical Animated Ticker with Center Luminance Mask ── */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-auto"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,1) 42%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.15) 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,1) 42%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.15) 80%, transparent 100%)",
        }}
      >
        <div
          className={`flex flex-col items-center gap-12 py-10 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default ${animationClass}`}
        >
          {displayItems.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex flex-col items-center gap-3 group"
            >
              {/* Subtle Minimal Dot */}
              <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-amber-400 transition-colors duration-200" />

              {/* Clean Vertical Typography */}
              <span className="text-[11px] md:text-[12px] font-mono tracking-widest text-zinc-400 group-hover:text-amber-200 uppercase whitespace-nowrap transition-colors [writing-mode:vertical-lr] rotate-180">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
