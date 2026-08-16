"use client";

import { useRef, useEffect, useCallback } from "react";

export type BeltEffectMode = "plasma-prism" | "magnifier" | "deep-light" | "text-focus";

interface SideBeltProps {
  side: "left" | "right";
  items: string[];
  effect?: BeltEffectMode;
}

/*
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ SideBelt — Infinite Vertical Marquee with Magnifier Physics    ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║ In "magnifier" mode, each item's scale, opacity, brightness,   ║
 * ║ and glow are computed EVERY FRAME via direct DOM manipulation   ║
 * ║ (no React re-renders). Items near the viewport center get      ║
 * ║ smoothly enlarged with a quadratic ease-out falloff, like a    ║
 * ║ macOS dock magnification or a convex lens passing over text.   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const SCROLL_SPEED = 0.4;        // px per frame (~24px/s at 60fps)
const ITEM_SPACING = 80;          // px between item centers
const MAGNIFIER_RADIUS = 200;     // px radius of magnification field
const MAX_SCALE = 1.8;            // peak scale at dead center
const MIN_SCALE = 0.65;           // items far from center
const MIN_OPACITY = 0.25;
const MAX_OPACITY = 1.0;

export function SideBelt({ side, items, effect = "plasma-prism" }: SideBeltProps) {
  const isLeft = side === "left";
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const itemElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  // Quadruple for seamless loop
  const displayItems = [...items, ...items, ...items, ...items];
  const singleSetHeight = items.length * ITEM_SPACING;

  const isMagnifier = effect === "magnifier";

  // ── rAF loop: direct DOM writes, zero React re-renders ──
  const tick = useCallback(() => {
    const direction = isLeft ? 1 : -1;

    if (!pausedRef.current) {
      offsetRef.current += SCROLL_SPEED * direction;
      // Seamless wrap
      if (offsetRef.current > singleSetHeight) offsetRef.current -= singleSetHeight;
      if (offsetRef.current < -singleSetHeight) offsetRef.current += singleSetHeight;
    }

    // Move the entire strip via transform (GPU-accelerated)
    if (stripRef.current) {
      stripRef.current.style.transform = `translateY(${-offsetRef.current}px)`;
    }

    // Per-item magnification via direct style writes
    if (isMagnifier && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;

      for (let i = 0; i < itemElsRef.current.length; i++) {
        const el = itemElsRef.current[i];
        if (!el) continue;

        const elRect = el.getBoundingClientRect();
        const elCenterY = elRect.top + elRect.height / 2;
        const dist = Math.abs(elCenterY - centerY);
        const norm = Math.min(dist / MAGNIFIER_RADIUS, 1);

        // Smooth quadratic ease-out
        const eased = 1 - norm * norm;

        const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
        const opacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * eased;
        const brightness = 0.5 + 0.7 * eased;

        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `brightness(${brightness.toFixed(2)})`;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [isLeft, isMagnifier, singleSetHeight]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const onEnter = () => { pausedRef.current = true; };
  const onLeave = () => { pausedRef.current = false; };

  // For non-magnifier: CSS animation class
  const animClass = isLeft ? "animate-marquee-up" : "animate-marquee-down";

  return (
    <aside
      aria-label={`${side} side belt`}
      className={`fixed top-0 bottom-0 z-20 w-14 sm:w-16 md:w-20 hidden sm:flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none ${
        isLeft
          ? "left-0 sm:left-3 border-r border-white/[0.04]"
          : "right-0 sm:right-3 border-l border-white/[0.04]"
      }`}
      style={{ perspective: "800px" }}
    >
      {/* ── Effect Overlays ── */}
      {renderEffectOverlay(effect)}

      {/* ── Edge fades ── */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[var(--bg-base,#09090b)] via-[var(--bg-base,#09090b)]/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[var(--bg-base,#09090b)] via-[var(--bg-base,#09090b)]/90 to-transparent z-20 pointer-events-none" />

      {/* ── Vertical guide line ── */}
      <div
        aria-hidden="true"
        className={`absolute top-0 bottom-0 w-[1px] pointer-events-none z-10 ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, transparent 15%, rgba(255,255,255,0.05) 35%, rgba(245,158,11,0.6) 50%, rgba(255,255,255,0.05) 65%, transparent 85%)",
        }}
      />

      {/* ── Ticker strip container ── */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-auto"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 12%, black 30%, black 70%, rgba(0,0,0,0.1) 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 12%, black 30%, black 70%, rgba(0,0,0,0.1) 88%, transparent 100%)",
        }}
      >
        {isMagnifier ? (
          /* ══ MAGNIFIER: rAF-driven direct DOM transforms ══ */
          <div
            ref={stripRef}
            className="flex flex-col items-center py-10 cursor-default will-change-transform"
            style={{ gap: `${ITEM_SPACING - 36}px` }}
          >
            {displayItems.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                ref={(el) => { itemElsRef.current[idx] = el; }}
                className="flex flex-col items-center will-change-[transform,opacity,filter]"
                style={{
                  transformOrigin: "center center",
                  transition: "none",
                }}
              >
                {/* Hairline separator — stays subtle at any scale */}
                <span className="w-3 h-[1px] bg-amber-400/40 shrink-0 rounded-full" />

                {/* Label */}
                <span className="text-[11px] md:text-[12px] font-mono tracking-widest uppercase whitespace-nowrap text-zinc-200 [writing-mode:vertical-lr] rotate-180 py-1">
                  {item}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* ══ NON-MAGNIFIER: pure CSS animation ══ */
          <div
            className={`flex flex-col items-center gap-12 py-10 opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-default ${animClass}`}
          >
            {displayItems.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                className="flex flex-col items-center gap-3 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] group-hover:scale-150 transition-all duration-300" />
                <span className="text-[11px] md:text-[12px] font-mono tracking-widest uppercase whitespace-nowrap text-zinc-300 group-hover:text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300 [writing-mode:vertical-lr] rotate-180">
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Effect Overlay Layers (ambient glow behind belt items)
   ═══════════════════════════════════════════════════════════════════ */
function renderEffectOverlay(effect: BeltEffectMode) {
  switch (effect) {
    case "plasma-prism":
      return (
        <>
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-28 sm:w-36 h-80 pointer-events-none z-0 animate-pulse"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,158,11,0.4) 0%, rgba(251,191,36,0.2) 35%, rgba(245,158,11,0.05) 60%, transparent 80%)",
              filter: "blur(24px)",
              animationDuration: "4s",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-12 h-36 rounded-full pointer-events-none z-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(245,158,11,0.35) 45%, transparent 75%)",
              filter: "blur(12px)",
            }}
          />
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
      );

    case "magnifier":
      return (
        <>
          {/* Convex lens ambient dome */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-32 sm:w-40 h-56 rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(245,158,11,0.35) 0%, rgba(251,191,36,0.12) 40%, rgba(245,158,11,0.02) 65%, transparent 80%)",
              filter: "blur(22px)",
            }}
          />
          {/* Focal core */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-16 h-28 rounded-full pointer-events-none z-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(245,158,11,0.35) 45%, transparent 75%)",
              filter: "blur(14px)",
            }}
          />
        </>
      );

    case "deep-light":
      return (
        <>
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-40 sm:w-48 h-96 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(245,158,11,0.6) 0%, rgba(217,119,6,0.3) 40%, rgba(180,83,9,0.1) 60%, transparent 80%)",
              filter: "blur(30px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-20 h-20 rounded-full pointer-events-none z-0 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.7) 40%, transparent 70%)",
              filter: "blur(10px)",
              animationDuration: "2s",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] pointer-events-none z-10 bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_15px_rgba(245,158,11,1)]"
          />
        </>
      );

    case "text-focus":
      return (
        <>
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 w-24 h-48 pointer-events-none z-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245,158,11,0.35) 0%, rgba(251,191,36,0.1) 50%, transparent 75%)",
              filter: "blur(16px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 flex flex-col justify-between w-8 sm:w-10 h-16 pointer-events-none z-10 opacity-70"
          >
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
          </div>
        </>
      );

    default:
      return null;
  }
}
