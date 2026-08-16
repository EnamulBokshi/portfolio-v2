"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RenderProgressCounterProps {
  progress: number;
  isVisible: boolean;
}

export function RenderProgressCounter({ progress, isVisible }: RenderProgressCounterProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="render-counter"
          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.35, ease: "easeInOut" } }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 z-30 pointer-events-none select-none flex flex-col items-start"
        >
          {/* Large Clean Minimalist Percentage matching reference photo */}
          <div className="flex items-baseline gap-1">
            <span className="text-5xl sm:text-6xl md:text-7xl font-light font-heading tracking-tighter text-white/80 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              {Math.round(progress)}
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-light text-white/50 tracking-normal">
              %
            </span>
          </div>

          {/* Subtle Dynamic Status Bar */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-16 sm:w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400/80 uppercase">
              RENDERING
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
