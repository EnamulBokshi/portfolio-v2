"use client";

import { useEffect, useState } from "react";

export function MainBody() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#06070a] select-none"
    >
      {/* ── High-Tech Developer Binary & Circuit Background ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22] mix-blend-screen scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: "url('/binary-bg.jpg')",
          transform: `translate(${((mousePos.x - 50) * -0.05).toFixed(2)}px, ${((mousePos.y - 50) * -0.05).toFixed(2)}px)`,
        }}
      />

      {/* ── Radial Vignette for Depth & Focus ── */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(6, 7, 10, 0.75) 70%, rgba(6, 7, 10, 0.95) 100%)",
        }}
      />

      {/* ── Subtle Micro Dot Matrix ── */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Interactive Ambient Cursor Glow ── */}
      <div
        className="absolute w-[550px] h-[550px] rounded-full blur-[140px] transition-all duration-700 ease-out opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(124, 58, 237, 0.1) 45%, transparent 70%)",
          left: `calc(${mousePos.x}% - 275px)`,
          top: `calc(${mousePos.y}% - 275px)`,
        }}
      />

      {/* ── Ambient Color Bleeds ── */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-amber-500/[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-1/2 -right-40 w-[36rem] h-[36rem] bg-indigo-600/[0.04] rounded-full blur-[160px]" />
      <div className="absolute -bottom-40 left-1/3 w-[36rem] h-[36rem] bg-amber-600/[0.04] rounded-full blur-[160px]" />

      {/* ── Corner Cybernetic Accent Marks ── */}
      <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10" />
      <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10" />
      <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/10" />
      <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/10" />
    </div>
  );
}
