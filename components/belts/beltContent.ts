export interface BeltItemData {
  label: string;
  glyph?: string;
  category?: string;
}

export const DEFAULT_LEFT_BELT: BeltItemData[] = [
  { label: "Full Stack Architecture" },
  { label: "Next.js App Router" },
  { label: "TypeScript & Strict Types" },
  { label: "PostgreSQL & Prisma" },
  { label: "Docker & Cloud Native" },
  { label: "Server Actions & RSC" },
  { label: "Clean Code & Modularity" },
];

export const DEFAULT_RIGHT_BELT: BeltItemData[] = [
  { label: "High Performance Web" },
  { label: "Glassmorphic Interfaces" },
  { label: "Framer Motion & Animations" },
  { label: "Real-time Messaging" },
  { label: "Tailwind CSS & Design Tokens" },
  { label: "REST & RPC APIs" },
  { label: "Session Security & JWT" },
];
