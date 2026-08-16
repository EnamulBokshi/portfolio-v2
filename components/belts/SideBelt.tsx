"use client";

export type BeltEffectMode = "plasma-prism" | "magnifier" | "deep-light" | "text-focus";

interface SideBeltProps {
  side: "left" | "right";
  items: string[];
  effect?: BeltEffectMode;
}

export function SideBelt({ side, items, effect = "plasma-prism" }: SideBeltProps) {
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
      style={{ perspective: "600px" }}
    >
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* EFFECT 1: PLASMA PRISM (Optical Plasma Beam & Glass Prism)       */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {effect === "plasma-prism" && (
        <>
          {/* Animated Optical Backlight Plasma Beam */}
          <div 
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-28 sm:w-36 h-80 pointer-events-none z-0 animate-pulse"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245, 158, 11, 0.4) 0%, rgba(251, 191, 36, 0.2) 35%, rgba(245, 158, 11, 0.05) 60%, transparent 80%)",
              filter: "blur(24px)",
              animationDuration: "4s",
            }}
          />

          {/* Intense Core Light Filament */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-12 h-36 rounded-full pointer-events-none z-0 opacity-70"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(245, 158, 11, 0.35) 45%, transparent 75%)",
              filter: "blur(12px)",
            }}
          />

          {/* Glass Optical Prism Chamber */}
          <div 
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-10 sm:w-14 h-28 sm:h-32 rounded-2xl pointer-events-none z-10 border border-amber-400/20 bg-amber-500/[0.03] backdrop-blur-[2px] shadow-[0_0_25px_rgba(245,158,11,0.15)] flex flex-col justify-between p-1.5"
          >
            <div className="flex justify-between items-center w-full opacity-60">
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <div className="flex justify-between items-center w-full opacity-60">
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
              <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* EFFECT 2: MAGNIFIER (Organic 3D Convex Bulge / Zero Boxes)       */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {effect === "magnifier" && (
        <>
          {/* Organic Convex Ambient Dome (No boxes or borders) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-32 sm:w-40 h-56 rounded-full pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(245, 158, 11, 0.45) 0%, rgba(251, 191, 36, 0.18) 40%, rgba(245, 158, 11, 0.03) 65%, transparent 80%)",
              filter: "blur(22px)",
            }}
          />

          {/* Focal Light Core */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-16 h-28 rounded-full pointer-events-none z-0 opacity-80"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(245, 158, 11, 0.4) 45%, transparent 75%)",
              filter: "blur(14px)",
            }}
          />
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* EFFECT 3: DEEP LIGHT (Volumetric Atmospheric Light Cone)         */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {effect === "deep-light" && (
        <>
          {/* Intense Volumetric Light Beam */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-40 sm:w-48 h-96 pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(245, 158, 11, 0.6) 0%, rgba(217, 119, 6, 0.3) 40%, rgba(180, 83, 9, 0.1) 60%, transparent 80%)",
              filter: "blur(30px)",
            }}
          />

          {/* High Energy Center Flare */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-20 h-20 rounded-full pointer-events-none z-0 animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(251, 191, 36, 0.7) 40%, transparent 70%)",
              filter: "blur(10px)",
              animationDuration: "2s",
            }}
          />

          {/* Horizontal Laser Blade */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] pointer-events-none z-10 bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_15px_rgba(245,158,11,1)]"
          />
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* EFFECT 4: TEXT FOCUS (Clean Spotlight Focus)                     */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {effect === "text-focus" && (
        <>
          {/* Minimal Soft Backlight */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-24 h-48 pointer-events-none z-0 opacity-50"
            style={{
              background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.35) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 75%)",
              filter: "blur(16px)",
            }}
          />

          {/* Crisp Focus Indicator Lines */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 flex flex-col justify-between w-8 sm:w-10 h-16 pointer-events-none z-10 opacity-70"
          >
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
          </div>
        </>
      )}

      {/* ── Top & Bottom Natural Falloff Gradients ────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#09090b] via-[#09090b]/90 to-transparent z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent z-20" />

      {/* ── Vertical Guide Line with Amber Accent ─────────────────── */}
      <div 
        aria-hidden="true"
        className={`absolute top-0 bottom-0 w-[1px] pointer-events-none z-10 ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background: "linear-gradient(to bottom, transparent 15%, rgba(255, 255, 255, 0.05) 35%, rgba(245, 158, 11, 0.6) 50%, rgba(255, 255, 255, 0.05) 65%, transparent 85%)",
        }}
      />

      {/* ── Vertical Animated Ticker with Dynamic Luminance & Magnification */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-auto"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.15) 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.15) 80%, transparent 100%)",
        }}
      >
        <div
          className={`flex flex-col items-center gap-12 py-10 opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-default ${animationClass}`}
        >
          {displayItems.map((item, idx) => {
            const isMagnifier = effect === "magnifier";

            return (
              <div
                key={`${item}-${idx}`}
                className={`flex flex-col items-center gap-3 group transition-all duration-300 ${
                  isMagnifier ? "hover:scale-125" : ""
                }`}
              >
                {/* Glowing Bullet */}
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isMagnifier
                      ? "w-2 h-2 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,1)] group-hover:scale-150"
                      : "w-1.5 h-1.5 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] group-hover:scale-150"
                  }`}
                />

                {/* Vertical Typography with 3D forward pop in magnifier mode */}
                <span
                  className={`font-mono tracking-widest uppercase whitespace-nowrap transition-all duration-300 [writing-mode:vertical-lr] rotate-180 ${
                    isMagnifier
                      ? "text-[12px] md:text-[13px] font-bold text-zinc-200 group-hover:text-amber-300 group-hover:scale-110 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]"
                      : "text-[11px] md:text-[12px] text-zinc-300 group-hover:text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
