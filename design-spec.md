# Portfolio Design Document — "Persistent Shell" Layout

**Owner:** Enamul Bokshi
**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion / GSAP
**Status:** Draft v1 — architecture & interaction spec, pre-build

---

## 1. Concept Summary

A single persistent shell wraps every route. Only the content inside the **Main Display** panel changes between pages/sections — the **Main Body**, **Side Belts**, and **Dock Nav** never remount. Navigation feels like flipping through a stack of cards inside a fixed frame, not like loading new pages.

Two layers, two moods:

| Layer | Role | Feel |
|---|---|---|
| **Main Body** | Outer wrapper / stage | Dark, saturated, ambient motion (slow gradient mesh or particle drift), graphics live here |
| **Main Display** | Centered content panel | Glassy / frosted, higher contrast, calm — this is the "spotlight" where bio, projects, skills, achievements render |

---

## 2. Layout Anatomy

```
┌───────────────────────────────────────────────────────────┐
│                        DOCK NAV (fixed, top)                │
│                                                               │
│  ▲                                                     ▲     │
│  B   ┌───────────────────────────────────────────┐    B     │
│  E   │                                             │    E     │
│  L   │                                             │    L     │
│  T   │            MAIN DISPLAY (glass)             │    T     │
│  │   │         15–20% margin on all sides          │    │     │
│  L   │                                             │    R     │
│  E   │                                             │    I     │
│  F   │                                             │    G     │
│  T   └───────────────────────────────────────────┘    H     │
│  ▼                                                     T ▼   │
│                                                               │
│                    MAIN BODY (background stage)              │
└───────────────────────────────────────────────────────────┘
```

- **Main Body**: full viewport, `position: fixed`, houses ambient background animation.
- **Main Display**: centered, `~60–70%` viewport width/height (i.e. 15–20% margin per side), `backdrop-filter: blur()`, semi-transparent surface.
- **Side Belts**: two vertical strips, ~60–100px wide, pinned left/right, content scrolls opposite directions (left up, right down, or vice versa), low opacity at rest.
- **Dock Nav**: fixed top, floating, macOS-dock-style icon row, collapses to bottom tab bar on mobile.

---

## 3. Component Architecture (Next.js App Router)

```
app/
  layout.tsx                → renders <ShellLayout> once, wraps {children}
  page.tsx                  → Home / Intro section
  projects/page.tsx
  skills/page.tsx
  achievements/page.tsx
  contact/page.tsx

components/
  shell/
    ShellLayout.tsx         → composes MainBody + MainDisplay + Belts + DockNav
    MainBody.tsx            → ambient background (canvas/WebGL or CSS gradient mesh)
    MainDisplay.tsx         → glass panel wrapper; {children} = actual page content
    SectionIndicator.tsx    → dot/progress indicator for current section
  belts/
    SkillBelt.tsx           → reusable marquee, direction + content as props
    beltContent.ts          → per-route content mapping (see §5)
  nav/
    DockNav.tsx             → desktop dock
    MobileTabBar.tsx        → mobile fallback (rendered via CSS breakpoint, not JS branch, to avoid layout shift)
  motion/
    useScrollSection.ts     → hook: converts scroll delta into section-index state
    PageTransition.tsx      → wraps page content, animates in/out on section change
```

**Key principle:** `ShellLayout` lives in the root `layout.tsx` so it mounts exactly once. Route changes only swap `{children}` inside `MainDisplay`. This is what makes the parallax transition feel seamless — the frame never re-renders.

---

## 4. Scroll & Navigation Mechanics

### 4.1 Why NOT full scroll-hijacking
Raw `wheel`/`touchmove` interception is fragile — stutters on trackpads, actively fights native touch scroll on mobile, breaks accessibility (keyboard, screen readers, reduced-motion users) if not handled carefully.

### 4.2 Recommended approach: scroll-progress-driven sections, not event-hijacking
- Each "page" (Intro, Projects, Skills, Achievements, Contact) is a section with a defined scroll-progress range.
- Use **Framer Motion's `useScroll` + `useTransform`**, or **GSAP ScrollTrigger with `scrub`**, to tie animation progress to actual accumulated scroll distance inside an invisible tall scroll track — not to raw wheel events.
- Content crossfades/slides based on progress crossing thresholds (e.g. 0–20% = Intro, 20–45% = Projects, etc.)
- This degrades gracefully: worst case, if JS fails or reduced-motion is on, it still scrolls — just without the fancy easing.

### 4.3 Section indicator (replaces missing scrollbar)
- Small dot/line indicator on one edge (or integrated into a belt) showing current section.
- Directly clickable/tappable — jumps to that section's scroll-progress range with an eased animation.
- Doubles as a keyboard nav target (`aria-label`, `tabIndex`) for accessibility.

### 4.4 Mobile touch behavior
- Do **not** attempt to replicate scroll-hijacking on touch — let native touch scroll drive the same progress-based transform. This avoids fighting the browser's own scroll physics, which is the #1 cause of "broken feeling" scroll-jack sites on phones.
- Dock nav becomes the primary explicit navigation method on mobile; the scroll-parallax becomes a secondary/bonus interaction.

---

## 5. Side Belts — Content Strategy

Avoid literal "logo soup" marquees — make them contextual and low-noise:

- **Content pairing:** skill name + small glyph, generous vertical spacing, default state at low opacity (~30–40%), brightens on hover/tap.
- **Context-aware content:** belts are not static across the whole site.
  - On **Projects** page → belts show tech stack tags used in the currently-viewed project.
  - On **Skills** page → belts show the full skill list.
  - On **Intro/Home** → belts show a rotating mix (identity words: "Full-Stack", "Next.js", "AI Automation", etc.)
  - Content source: `beltContent.ts` maps route (or active section) → array of belt items.
- **Motion:** CSS-driven infinite marquee (`@keyframes translateY` looping, duplicated content for seamless loop) — cheap, GPU-accelerated, no JS animation loop needed for the base motion.
- **Edge bleed:** belts should visually bleed off the top/bottom edge so they don't read as a bounded "sidebar," reinforcing the endless-scroll feel.

---

## 6. Dock Nav

- **Desktop:** floating pill/dock, fixed top-center. Icons scale up + lift on hover with a magnification falloff on neighboring icons (classic macOS dock physics) — achievable with Framer Motion `useMotionValue` + distance-based scale transform on mouse-x position.
- **Mobile:** do not shrink the dock — replace it entirely with a bottom tab bar (standard mobile nav pattern). Swap via Tailwind breakpoint (`hidden md:flex` / `flex md:hidden`), not conditional JS render, to avoid hydration mismatch and layout shift.
- **Behavior on click:** jumps directly to the corresponding section's scroll-progress range (animated, not instant snap) — keeps the dock and the scroll-parallax system as one coherent state machine rather than two competing navigation systems.

---

## 7. Visual Language

| Element | Treatment |
|---|---|
| Main Body background | Dark base (`slate-950`/near-black), slow-drifting gradient mesh or low-density particle field. Motion should read as *ambient*, not *busy* — think breathing, not flashing. |
| Main Display panel | `backdrop-filter: blur(20–30px)`, semi-transparent surface (`bg-white/5` to `bg-white/10` range depending on theme), subtle border (`border-white/10`), soft shadow for lift. |
| Typography | High contrast against glass panel; body copy should stay readable over blur at all times — test against busiest background frame, not the calmest one. |
| Belts | Low-opacity default, single accent color on hover, thin (60–100px), don't compete with Main Display for focus. |
| Dock Nav | Frosted/glass pill, consistent with Main Display material so it reads as "floating over" the body, not "part of" it. |

---

## 7.1 Typography — Final

Three-tier type system for clear hierarchy without relying on color alone:

| Role | Font | Notes |
|---|---|---|
| Headings | **Space Grotesk** | Geometric, technical character; used for hero text, section titles, project names. Loaded via `next/font/google`. |
| Body | **Inter** | All paragraph copy, form fields, general UI text. High readability at small sizes. |
| Labels / meta / tags | **JetBrains Mono** | Used sparingly — tech stack tags, timestamps, belt labels, status badges. Reinforces developer identity without becoming a terminal pastiche. |

**Alternative heading pairing (if a different flavor is wanted later):** Sora or General Sans in place of Space Grotesk — both sit in the same "clean modern tech" register.

Implementation note: all three fonts self-hosted via `next/font` — no external font-loading requests, no layout shift, respects the earlier performance guardrails (§8 in this doc / §7 in tech-requirements).

---

## 7.2 Color Palette — Final ("Violet Signal")

| Role | Hex | Usage |
|---|---|---|
| Background base | `#020617` | Main Body base color |
| Background bloom (gradient mesh) | `#1E1B4B` | Secondary color in the ambient drifting gradient |
| Glass panel surface | `rgba(255,255,255,0.06)` | Main Display panel fill |
| Glass panel border | `rgba(255,255,255,0.12)` | Main Display panel edge, Dock Nav pill edge |
| Accent primary | `#7C3AED` (violet) | Links, active states, primary buttons, glow effects, dock hover |
| Accent secondary | `#22D3EE` (cyan) | Hover contrast, secondary highlights, belt hover-brighten state |
| Text primary | `#F8FAFC` | Headings and primary body text on glass panel |
| Text secondary/muted | `#94A3B8` | Captions, timestamps, secondary copy |
| Status — success | `#34D399` (emerald) | "Sent" / "Replied" indicators in admin inbox |
| Status — error | `#FB7185` (rose) | "Failed" send status, form validation errors |

This palette maps directly onto `ThemeConfig` (§ Prisma schema, master spec): `accentColor` defaults to `#7C3AED`, `bodyBaseColor` defaults to `#020617`. Since theme is admin-editable at runtime, these are defaults/starting values, not hardcoded constants — the admin theme editor can shift accent/background colors without a redeploy, but this palette is the intended out-of-the-box look.

**Alternatives considered (kept here for reference, not the current default):**
- *Amber Circuit* — warm dark base (`#0A0A0A`/`#1C1917`) with amber (`#F59E0B`) + pink (`#F472B6`) accents. Warmer, less common in dev portfolios.
- *Cold Terminal* — near-monochrome (`#050505` base) with phosphor green (`#00FF9C`) + blue (`#3B82F6`) accents. More minimal, lets project screenshots carry the color.

---

## 8. Performance Guardrails

Because the shell persists across every route and stacks several animated layers, performance discipline matters more than usual:

1. **Prefer CSS transforms/opacity over layout-affecting properties.** All belt marquees, dock hover states, and section transitions should animate `transform`/`opacity` only.
2. **Ambient background:** if using WebGL/canvas (e.g. via `three.js` or a lightweight shader), cap frame rate or pause when tab is backgrounded (`document.visibilitychange`). If using pure CSS gradient mesh, this concern mostly disappears — worth trying CSS-only first before reaching for WebGL.
3. **`will-change` used sparingly** — only on the elements actually mid-transition, removed after.
4. **`backdrop-filter` cost:** blur is expensive on low-end Android GPUs. Test on a mid-range device early; consider reducing blur radius or disabling backdrop-filter (fallback to solid semi-transparent panel) below a certain viewport/device tier.
5. **Respect `prefers-reduced-motion`:** disable ambient background motion and belt marquees (or drastically slow them) for users with this preference set — also makes the site more robust, not just more accessible.
6. **Route-level code splitting:** since the shell never remounts, only page content should be lazy-loaded per route — keeps initial bundle lean.

---

## 9. Build Phases

**Phase 1 — Static shell**
- `ShellLayout` with Main Body (static gradient, no animation yet), Main Display (glass panel, static), Dock Nav (desktop only, no hover physics yet).
- One page (Home) rendering inside the display. Confirm the frame doesn't remount on route change.

**Phase 2 — Belts + Dock polish**
- `SkillBelt` component with CSS marquee, static content per route.
- Dock hover magnification (desktop), mobile tab bar swap.

**Phase 3 — Scroll-progress navigation**
- `useScrollSection` hook, section indicator, Framer Motion/GSAP-driven transitions between sections.
- Wire dock nav clicks into the same progress state machine.

**Phase 4 — Ambient motion + context-aware belts**
- Background gradient/particle animation in Main Body.
- Belt content becomes route/section-aware (`beltContent.ts` per-page mapping).

**Phase 5 — Performance + accessibility pass**
- `prefers-reduced-motion` handling, mobile GPU testing, `backdrop-filter` fallback tier, lazy-loading audit.

---

## 10. Open Decisions (to confirm before/while building)

- [ ] Ambient background: CSS gradient mesh vs. lightweight WebGL/canvas — recommend starting CSS-only, upgrading only if it feels flat.
- [ ] Exact section list/order for the scroll-progress system (Intro → Projects → Skills → Achievements → Contact, or different?).
- [ ] Color scheme / accent color for Main Display vs Main Body (dark base confirmed — accent color still open).
- [ ] Whether belt content is manually curated per page or pulled from a shared content/config file (recommend shared config for maintainability).