"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SectionIndicator() {
  const pathname = usePathname();

  const sections = [
    { label: "01", name: "Intro", href: "/" },
    { label: "02", name: "Projects", href: "/projects" },
    { label: "03", name: "Skills", href: "/skills" },
    { label: "04", name: "Achievements", href: "/achievements" },
    { label: "05", name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      aria-label="Section Indicator"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden 2xl:flex flex-col gap-4 select-none"
    >
      {sections.map((section) => {
        const isActive = section.href === "/" ? pathname === "/" : pathname.startsWith(section.href);

        return (
          <Link
            key={section.name}
            href={section.href}
            className="group flex items-center gap-2.5 text-xs font-mono transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-cyan-400 scale-125 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  : "bg-white/20 group-hover:bg-white/50"
              }`}
            />
            <span
              className={`transition-colors duration-200 ${
                isActive ? "text-cyan-300 font-semibold" : "text-slate-500 group-hover:text-slate-300"
              }`}
            >
              {section.label} — {section.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
