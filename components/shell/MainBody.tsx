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
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#09090b] select-none"
    >
      {/* Subtle Micro Dot Matrix (Linear style) */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Interactive Subtle Warm Amber Mouse Glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-700 ease-out opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 70%)",
          left: `calc(${mousePos.x}% - 250px)`,
          top: `calc(${mousePos.y}% - 250px)`,
        }}
      />

      {/* Deep Obsidian Stage Ambient Blooms */}
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-amber-500/[0.04] rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-40 w-[32rem] h-[32rem] bg-zinc-700/[0.05] rounded-full blur-[160px]" />
      <div className="absolute -bottom-40 left-1/3 w-[34rem] h-[34rem] bg-amber-600/[0.03] rounded-full blur-[150px]" />

      {/* Subtle Geometric Corner Tick Marks */}
      <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10" />
      <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10" />
      <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/10" />
      <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/10" />
    </div>
  );
}
