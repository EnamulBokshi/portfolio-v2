"use client";

import { useEffect, useState } from "react";

interface TypewriterRolesProps {
  roles?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

const DEFAULT_ROLES = [
  "Full-Stack Engineer",
  "System Architect",
  "DevOps Engineer",
  "AI Solution Crafter",
  "Cloud Native Developer",
];

export function TypewriterRoles({
  roles = DEFAULT_ROLES,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseTime = 1800,
  className = "",
}: TypewriterRolesProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex % roles.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing mode
      if (displayText.length < currentRole.length) {
        // Human-like slight jitter for authentic developer terminal typing
        const jitter = Math.floor(Math.random() * 25) - 10;
        const delay = Math.max(30, typingSpeed + jitter);

        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, delay);
      } else {
        // Finished typing word, hold before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // Deleting mode
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, advance to next role
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono select-none ${className}`}>
      {/* Terminal Command Prompt Symbol */}
      <span className="text-amber-400 font-bold opacity-90">&gt;</span>

      {/* Dynamic Typewriter Text with Subtle Glow */}
      <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-amber-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
        {displayText}
      </span>

      {/* Terminal Block Caret */}
      <span
        aria-hidden="true"
        className="inline-block w-2 h-4 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse rounded-[1px]"
        style={{
          animationDuration: "0.8s",
        }}
      />
    </div>
  );
}
