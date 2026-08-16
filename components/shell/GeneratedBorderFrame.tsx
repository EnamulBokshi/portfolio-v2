"use client";

import { motion } from "framer-motion";

interface GeneratedBorderFrameProps {
  progress: number;
  isRendering: boolean;
  renderKey: string | number;
}

export function GeneratedBorderFrame({
  progress,
  isRendering,
  renderKey,
}: GeneratedBorderFrameProps) {
  const normalizedProgress = Math.min(Math.max(progress / 100, 0), 1);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-20 overflow-visible rounded-3xl"
    >
      {/* SVG Path Tracing Layer */}
      <svg
        className="w-full h-full absolute inset-0 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glowing Gradient for Generating Stroke */}
          <linearGradient id="borderGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
          </linearGradient>

          {/* Soft Filter for Luminous Edge */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Single Clean Animated Stroke Tracing the Perimeter */}
        <motion.rect
          key={`stroke-primary-${renderKey}`}
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="28"
          fill="none"
          stroke="url(#borderGlow)"
          strokeWidth="1.5"
          filter="url(#glowFilter)"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{
            pathLength: normalizedProgress,
            opacity: isRendering ? 0.9 : 0.35,
          }}
          transition={{ ease: "easeOut", duration: 0.15 }}
        />

        {/* Dashed Accent Trace During Rendering */}
        {isRendering && (
          <motion.rect
            key={`stroke-secondary-${renderKey}`}
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="28"
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1"
            strokeDasharray="30 180"
            initial={{ strokeDashoffset: 600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
          />
        )}
      </svg>
    </div>
  );
}
