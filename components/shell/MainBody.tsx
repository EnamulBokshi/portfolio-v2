"use client";

import { useEffect, useState, useRef } from "react";

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
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#020617] select-none"
    >
      {/* Background Cyber Gradient Grid */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Interactive Cursor Reactive Light */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-700 ease-out opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(34, 211, 238, 0.15) 50%, transparent 70%)",
          left: `calc(${mousePos.x}% - 300px)`,
          top: `calc(${mousePos.y}% - 300px)`,
        }}
      />

      {/* Ambient Drifting Blooms */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-purple-700/20 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-1/2 -right-40 w-[36rem] h-[36rem] bg-indigo-600/15 rounded-full blur-[160px]" />
      <div className="absolute -bottom-32 left-1/4 w-[34rem] h-[34rem] bg-cyan-500/15 rounded-full blur-[140px]" />

      {/* Cyber Frame Corner Accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-purple-500/40" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-500/40" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/40" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40" />
    </div>
  );
}
