"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isMouseDown = useRef(false);
  const isVisible = useRef(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
        if (trailRef.current) trailRef.current.style.opacity = "0.6";
      }

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "button, a, input, textarea, select, [role='button'], [tabindex='0'], .group, .clickable"
        );
        isHovered.current = !!interactive;
      }
    };

    const onMouseDown = () => {
      isMouseDown.current = true;
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (trailRef.current) trailRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
      if (trailRef.current) trailRef.current.style.opacity = "0.6";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // ── Ultra-smooth Lerp Render Loop ──
    let rafId: number;
    const lerpFactor = 0.22; // Responsive tracking speed

    const render = () => {
      // Smooth interpolation for the outer cybernetic ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      const { x: mx, y: my } = mousePos.current;
      const { x: rx, y: ry } = ringPos.current;

      // 1. Direct hardware position for inner laser dot
      if (dotRef.current) {
        const dotScale = isMouseDown.current ? 0.5 : isHovered.current ? 1.4 : 1;
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.backgroundColor = isHovered.current ? "#FBBF24" : "#F59E0B";
        dotRef.current.style.boxShadow = isHovered.current
          ? "0 0 12px #FBBF24, 0 0 4px #FFFFFF"
          : "0 0 8px #F59E0B";
      }

      // 2. Smooth trailing outer cybernetic HUD reticle
      if (ringRef.current) {
        const ringScale = isMouseDown.current
          ? 0.75
          : isHovered.current
          ? 1.5
          : 1;

        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${ringScale})`;

        if (isHovered.current) {
          ringRef.current.style.borderColor = "rgba(251, 191, 36, 0.85)";
          ringRef.current.style.backgroundColor = "rgba(245, 158, 11, 0.08)";
          ringRef.current.style.boxShadow = "0 0 24px rgba(245, 158, 11, 0.4), inset 0 0 8px rgba(245, 158, 11, 0.2)";
        } else {
          ringRef.current.style.borderColor = "rgba(255, 255, 255, 0.28)";
          ringRef.current.style.backgroundColor = "transparent";
          ringRef.current.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.15)";
        }
      }

      // 3. Ambient soft trail glow
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${rx - 64}px, ${ry - 64}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none hidden md:block"
    >
      {/* 1. Ambient soft cursor light bloom */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-32 h-32 rounded-full opacity-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 70%)",
          filter: "blur(20px)",
          willChange: "transform",
        }}
      />

      {/* 2. Outer Cybernetic HUD Reticle Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 opacity-0 pointer-events-none transition-[border-color,background-color,box-shadow] duration-200"
        style={{
          willChange: "transform",
        }}
      >
        {/* Subtle Cybernetic HUD Target Notches */}
        <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[2px] h-[3px] bg-amber-400 rounded-full" />
        <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-[2px] h-[3px] bg-amber-400 rounded-full" />
        <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 h-[2px] w-[3px] bg-amber-400 rounded-full" />
        <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 h-[2px] w-[3px] bg-amber-400 rounded-full" />
      </div>

      {/* 3. High-Precision Center Laser Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)] opacity-0 pointer-events-none transition-[background-color,box-shadow] duration-150"
        style={{
          willChange: "transform",
        }}
      />
    </div>
  );
}
