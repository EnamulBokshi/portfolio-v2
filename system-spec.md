# Portfolio — Master Specification (Final)

**Owner:** Enamul Bokshi
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Prisma + PostgreSQL · Custom Session Auth (jose + bcryptjs) · Resend · Tiptap · Vercel Blob · Docker
**Status:** Final — all open decisions resolved, updated with typography, color palette, and Docker containerization

This document consolidates and finalizes:
- `portfolio-design-doc.md` (shell/layout/scroll design)
- `portfolio-tech-requirements.md` (base stack)
- `portfolio-admin-db-architecture.md` (DB-backed content + admin dashboard)
- `portfolio-contact-inbox-architecture.md` (dynamic contact inbox + rich-text replies)

All prior "open decisions" across those docs are resolved below. This is the version to build from.

---

## 1. Resolved Decisions

| Decision | Resolution |
|---|---|
| Runtime & Containerization | **Docker.** Multi-stage `Dockerfile` with Next.js standalone output and `docker-compose.yml` orchestrating PostgreSQL and the Next.js application container. |
| Static vs DB-backed content | **DB-backed.** CV, Projects, Achievements, Belt Content, Skills, Theme — all admin-editable. |
| Authentication | **Custom Secure Session Auth** (HTTP-only signed/encrypted cookie with `jose` + `bcryptjs`), avoiding heavyweight auth libraries. |
| Typography Hierarchy | **Headings:** `Space Grotesk` (or `Sora` / `General Sans`)<br>**Body:** `Inter`<br>**Tags / Labels / Meta:** `JetBrains Mono` |
| Color System | **Primary Theme:** "Violet Signal"<br>• Background Base: `#020617` (Near-black navy)<br>• Background Secondary: `#1e1b4b` (Deep indigo bloom)<br>• Glass Surface: `rgba(255, 255, 255, 0.06)`<br>• Glass Border: `rgba(255, 255, 255, 0.12)`<br>• Accent Primary: `#7C3AED` (Electric violet)<br>• Accent Secondary: `#22D3EE` (Cyan hover/contrast)<br>• Text Primary: `#F8FAFC` (Off-white)<br>• Text Muted: `#94A3B8` (Slate gray)<br>• Success: `#34D399` (Emerald)<br>• Error: `#FB7185` (Rose) |
| Confirmation email to visitor on contact form submit | **Included.** Sent immediately on submission, separate from the eventual personal reply. |
| Notification email to admin (you) on new message | **Included.** Sent immediately on submission alongside the visitor confirmation. |
| Heading levels in reply composer | **H2/H3 only.** Capped to avoid inconsistent rendering across email clients; H1 reserved for email subject-equivalent context, deeper levels (H4–H6) excluded as unnecessary for reply-length content. |
| Retry UI for failed email sends | **Included.** Simple "Retry" action re-triggers the *same* `MessageReply` row (re-attempts send with the same stored HTML) rather than creating a duplicate reply — keeps the thread history clean. |
| File storage | **Vercel Blob** (native Vercel integration, least setup friction). |
| Cache/revalidation strategy | **`force-dynamic`** on public pages initially — always fresh reads, no caching complexity. Revisit only if real latency issues appear. |
| Admin list reordering | **Numeric `order` field**, edited directly — no drag-and-drop library in the initial build. Can be added later without schema changes. |
| Belt content | **Manual `BeltItem` table** with fallback to tech tags / skill list when no manual items exist for a given context. |

---

## 2. Design Tokens & Typography

### Typography Hierarchy
- **Headings:** `Space Grotesk` (with `Sora` / `General Sans` modern clean tech feel)
- **Body:** `Inter`
- **Tags, Labels, Meta Text:** `JetBrains Mono`

```css
--font-heading: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Color Tokens (Violet Signal)
| Role | Color Name | Hex / Value |
|---|---|---|
| Background Base | Near-black navy | `#020617` |
| Background Secondary | Deep indigo (gradient bloom) | `#1e1b4b` |
| Glass Panel Surface | Translucent white surface | `rgba(255, 255, 255, 0.06)` |
| Glass Panel Border | Subtle edge border | `rgba(255, 255, 255, 0.12)` |
| Accent Primary | Electric violet | `#7C3AED` |
| Accent Secondary | Cyan (hover/contrast) | `#22D3EE` |
| Text Primary | Off-white | `#F8FAFC` |
| Text Secondary / Muted | Slate gray | `#94A3B8` |
| Success / Status | Emerald ("sent" indicators) | `#34D399` |
| Error / Failed Status | Rose | `#FB7185` |

---

## 3. Full Prisma Schema

```prisma
// ── Auth ──────────────────────────────────────────────
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

// ── Content ───────────────────────────────────────────
model Project {
  id          String         @id @default(cuid())
  slug        String         @unique
  title       String
  summary     String
  description String         @db.Text
  techTags    String[]
  images      ProjectImage[]
  liveUrl     String?
  repoUrl     String?
  featured    Boolean        @default(false)
  order       Int            @default(0)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProjectImage {
  id        String  @id @default(cuid())
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String
  url       String
  alt       String?
  order     Int     @default(0)
}

model Achievement {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  issuer      String?
  date        DateTime
  imageUrl    String?
  link        String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model Skill {
  id          String  @id @default(cuid())
  name        String
  category    String
  iconUrl     String?
  proficiency Int?
  order       Int     @default(0)
}

model BeltItem {
  id         String      @id @default(cuid())
  label      String
  glyphUrl   String?
  context    BeltContext @default(GLOBAL)
  contextRef String?
  order      Int         @default(0)
  active     Boolean     @default(true)
}

enum BeltContext {
  GLOBAL
  PROJECT
  SKILLS
}

model CV {
  id           String   @id @default(cuid())
  fileUrl      String
  versionLabel String?
  isActive     Boolean  @default(true)
  uploadedAt   DateTime @default(now())
}

model ThemeConfig {
  id                 String   @id @default(cuid())
  isActive           Boolean  @default(true)
  accentColor        String   @default("#7C3AED")
  accentSecondary    String   @default("#22D3EE")
  bodyBackgroundMode String   @default("gradient-mesh")
  bodyBaseColor      String   @default("#020617")
  bodySecondaryColor String   @default("#1e1b4b")
  glassBlurPx        Int      @default(24)
  glassOpacity       Float    @default(0.06)
  glassBorderOpacity Float    @default(0.12)
  fontHeading        String?  @default("Space Grotesk")
  fontBody           String?  @default("Inter")
  fontMono           String?  @default("JetBrains Mono")
  updatedAt          DateTime @updatedAt
}

// ── Contact Inbox ─────────────────────────────────────
model ContactMessage {
  id        String         @id @default(cuid())
  name      String
  email     String
  subject   String?
  body      String         @db.Text
  status    MessageStatus  @default(UNREAD)
  ipAddress String?
  createdAt DateTime       @default(now())
  replies   MessageReply[]
}

model MessageReply {
  id          String         @id @default(cuid())
  message     ContactMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
  messageId   String
  bodyHtml    String         @db.Text
  sentAt      DateTime       @default(now())
  emailStatus EmailStatus    @default(PENDING)
}

enum MessageStatus {
  UNREAD
  READ
  REPLIED
  ARCHIVED
  SPAM
}

enum EmailStatus {
  PENDING
  SENT
  FAILED
}
```

---

## 4. Docker Architecture

### Multi-stage Dockerfile (`Dockerfile`)
- **Stage 1 (`deps`):** Install dependencies using `pnpm` with lockfile caching.
- **Stage 2 (`builder`):** Generate Prisma client and compile Next.js standalone build (`output: "standalone"` in `next.config.ts`).
- **Stage 3 (`runner`):** Minimal Alpine/Node runner copying `.next/standalone`, `.next/static`, and `public`, running as non-root user.

### Docker Compose (`docker-compose.yml`)
- **`postgres`:** PostgreSQL 16 Alpine container with healthcheck and persistent named volume (`pgdata`).
- **`app`:** Next.js application container with restart policies, environment variable wiring, and network connection to PostgreSQL.

---

## 5. Full Route Map

```
app/
  layout.tsx                      → ShellLayout, fetches active ThemeConfig, injects CSS vars & Google fonts
  page.tsx                        → Home/Intro
  projects/page.tsx
  projects/[slug]/page.tsx
  achievements/page.tsx
  skills/page.tsx
  contact/page.tsx                → public contact form

  admin/
    layout.tsx                    → session-gated shell (sidebar nav)
    login/page.tsx
    page.tsx                      → dashboard overview
    projects/{page.tsx, new/page.tsx, [id]/edit/page.tsx}
    achievements/{page.tsx, new/page.tsx, [id]/edit/page.tsx}
    skills/page.tsx
    belts/page.tsx
    cv/page.tsx
    theme/page.tsx
    messages/
      page.tsx                    → inbox list
      [id]/page.tsx               → thread + reply composer

app/api/
  contact/route.ts                → PUBLIC POST: create ContactMessage, send visitor confirmation + admin notification
  auth/
    login/route.ts                → POST (verify password, set HTTP-only JWT session cookie)
    logout/route.ts               → POST (clear session cookie)
    me/route.ts                   → GET (verify current session)
  admin/
    projects/route.ts             → GET, POST
    projects/[id]/route.ts        → PATCH, DELETE
    achievements/route.ts         → GET, POST
    achievements/[id]/route.ts    → PATCH, DELETE
    skills/route.ts               → GET, POST
    skills/[id]/route.ts          → PATCH, DELETE
    belts/route.ts                → GET, POST
    belts/[id]/route.ts           → PATCH, DELETE
    cv/route.ts                   → POST (upload new), PATCH (set active)
    theme/route.ts                → GET, PATCH
    messages/route.ts             → GET (list, filterable by status)
    messages/[id]/route.ts        → GET (thread), PATCH (status update)
    messages/[id]/reply/route.ts  → POST (send new reply)
    messages/[id]/reply/[replyId]/retry/route.ts → POST (retry failed send)
```

Middleware (`middleware.ts`) protects `/admin/*` and `/api/admin/*` via JWT session cookie verification (`jose`).

---

## 6. Implementation Phases

No version splitting — this is one continuous build, broken into sequential phases so each is independently testable before moving to the next.

### Phase 1 — Foundation & Docker
- Next.js project scaffold with standalone output, TypeScript, Tailwind CSS v4, font configuration (Space Grotesk, Inter, JetBrains Mono).
- Docker setup: Multi-stage `Dockerfile`, `docker-compose.yml` (PostgreSQL 16 + App), `.dockerignore`.
- Prisma schema + migrations against Postgres.
- Custom Admin Auth (JWT session with `jose`, password hashing with `bcryptjs`), single admin user seeded, `middleware.ts` protecting `/admin/*` and `/api/admin/*`.
- Vercel Blob configured for file uploads.

**Exit criteria:** `docker compose up` spins up DB and App cleanly; DB reachable, admin can log in, protected routes redirect when unauthenticated.

---

### Phase 2 — Static Shell
- `ShellLayout` (Main Body, Main Display, Dock Nav — desktop only at this stage).
- Root layout fetches `ThemeConfig` and injects CSS custom properties.
- One route (Home) renders inside Main Display, pulling seeded placeholder content directly via Prisma.

**Exit criteria:** Shell persists across route changes without remounting; theme values visibly control accent color/blur/background from DB, not hardcoded CSS.

---

### Phase 3 — Content Admin (CRUD)
- Admin screens: Projects, Achievements, Skills, CV upload — list/create/edit/delete.
- Image and CV PDF upload flow via Vercel Blob, URLs saved to DB.
- Public pages (`/projects`, `/achievements`, `/skills`) render DB content via Server Components.

**Exit criteria:** You can add a project in the dashboard and see it live on the public site (via `force-dynamic`, no redeploy needed).

---

### Phase 4 — Belts, Dock Polish, Theme Editor
- `SkillBelt` component with CSS marquee, resolved via `BeltItem` + fallback logic.
- Admin belts screen (manage `BeltItem` entries, filter by context).
- Dock nav hover magnification (desktop), mobile tab bar variant.
- Admin theme editor: live local-state preview, color pickers, blur/opacity sliders, "Save" commits to `ThemeConfig`.

**Exit criteria:** Belts show contextual content per page; theme changes made in dashboard reflect on the public site after save.

---

### Phase 5 — Contact Inbox & Rich-Text Reply
- Public contact form → `/api/contact` → creates `ContactMessage`, sends visitor confirmation email + admin notification email (both via Resend).
- Admin inbox (`/admin/messages`): list with status filters, unread indicator.
- Thread view + Tiptap composer (bold, italic, underline, H2/H3, links, text color).
- Reply send flow → Resend → `MessageReply` status tracking (`PENDING`/`SENT`/`FAILED`) with Retry action on failed sends.
- Honeypot field + rate limiting on `/api/contact`.

**Exit criteria:** Full loop works — visitor submits, you get notified, you reply with formatting from the dashboard, visitor receives styled HTML email, thread is visible in dashboard.

---

### Phase 6 — Scroll-Progress Navigation
- `useScrollSection` hook (Framer Motion `useScroll`/`useTransform`), section indicator component.
- Section-to-section transitions wired to scroll progress, not raw wheel events.
- Dock nav clicks jump into the same progress state machine (not a separate navigation system).
- Mobile: native touch scroll drives the same progress-based transform; dock/tab bar is primary explicit nav on mobile.

**Exit criteria:** Scrolling through the site feels like the designed parallax experience on desktop; mobile navigation is fully usable via tab bar even if parallax is subtler there.

---

### Phase 7 — Ambient Motion & Final Polish
- Main Body ambient background (CSS gradient mesh first; WebGL only if needed).
- Belt content becomes fully context-aware across all pages.
- `prefers-reduced-motion` handling across all animated elements.
- Performance pass: `backdrop-filter` cost on mid-range Android, `will-change` audit, image optimization check, Lighthouse pass.
- Cross-browser/cross-device QA.

**Exit criteria:** Site is animation-complete, accessible, and performs acceptably on a mid-range mobile device — ready to point your real domain at it.

---

## 7. Full Dependency List

```
next
react / react-dom
typescript
tailwindcss / @tailwindcss/postcss / postcss
framer-motion
prisma
@prisma/client
jose
bcryptjs
@types/bcryptjs
resend
zod
@vercel/blob
react-hook-form
@tiptap/react
@tiptap/starter-kit
@tiptap/extension-link
@tiptap/extension-color
@tiptap/extension-text-style
@tiptap/extension-underline
react-colorful
lucide-react
clsx
tailwind-merge
```

---

## 8. Environment Variables (anticipated)

```
DATABASE_URL=                   # postgres://postgres:postgres@postgres:5432/portfolio (in Docker)
AUTH_SECRET=                    # secret for signing JWT admin session cookies
RESEND_API_KEY=
BLOB_READ_WRITE_TOKEN=
ADMIN_NOTIFICATION_EMAIL=       # where new-message notifications are sent
CONTACT_FROM_EMAIL=             # verified sender for Resend (confirmation + replies)
ADMIN_INITIAL_EMAIL=            # default admin email for seed script
ADMIN_INITIAL_PASSWORD=         # default admin password for seed script
```