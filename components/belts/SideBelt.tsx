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
        isLeft ? "left-0 sm:left-2 border-r border-white/5" : "right-0 sm:right-2 border-l border-white/5"
      }`}
    >
      {/* Top & Bottom Fade Masks */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-10" />

      {/* Decorative Outer Border Lines */}
      <div className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent ${isLeft ? "right-0" : "left-0"}`} />

      {/* Vertical Animated Ticker */}
      <div
        className={`flex flex-col items-center gap-10 py-10 opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-default ${animationClass}`}
      >
        {displayItems.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="flex flex-col items-center gap-3 group"
          >
            {/* Dot Bullet */}
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:bg-cyan-400 group-hover:scale-150 transition-all duration-200 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />

            {/* Vertical Text */}
            <span className="text-[12px] md:text-[13px] font-mono tracking-widest text-slate-400 group-hover:text-cyan-200 uppercase whitespace-nowrap transition-colors [writing-mode:vertical-lr] rotate-180">
              {item}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
