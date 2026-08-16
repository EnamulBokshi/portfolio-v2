import { ReactNode } from "react";

interface MainDisplayProps {
  children: ReactNode;
}

export function MainDisplay({ children }: MainDisplayProps) {
  return (
    <section 
      aria-label="Main Display Viewport"
      className="relative z-10 w-full max-w-5xl mx-auto h-full flex-1 flex flex-col"
    >
      <div className="w-full h-full flex-1 rounded-2xl md:rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-y-auto px-5 py-6 sm:p-8 md:p-10 transition-all duration-300">
        {children}
      </div>
    </section>
  );
}
