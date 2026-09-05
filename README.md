<!--
REQUIRED VERCEL ENVIRONMENT VARIABLES:
- JWT_SECRET: Secret string used to sign and verify admin authentication JWT cookies.
- GITHUB_TOKEN: Fine-grained Personal Access Token (PAT) with Read & Write permissions for contents of QuantumSenpai/hall-of-fame-sec-d-cse-2026.
- GITHUB_OWNER: GitHub account or organization name (optional, defaults to "QuantumSenpai").
- GITHUB_REPO: GitHub repository name (optional, defaults to "hall-of-fame-sec-d-cse-2026").
- GITHUB_BRANCH: Target branch for content commits (optional, defaults to "main").
- ADMIN_USERNAME: Username for admin CMS login (defaults to "admin").
- ADMIN_PASSWORD_HASH: Bcrypt hash of the admin password for secure authentication.
- REACTBITS_LICENSE_KEY: React Bits Pro license key for registry component access.
- KV_REST_API_URL: Vercel KV REST API URL for Redis rate limiting and pending memory queue.
- KV_REST_API_TOKEN: Vercel KV REST API authorization token.
-->

# Teachers' Day 2026 — Bento-Grid Digital Memory Book

A simplified, ultra-premium digital memory book web application engineered to let visitors relive the Teachers' Day 2026 celebration of Computer Science & Engineering Section D.

Featuring a responsive Bento Grid gallery, an illustrated static open-book hero with a one-time mount animation, React Bits Pro animated components, and a serverless architecture deployed on Vercel without external databases.

---

## 🌟 Visual Identity & Color Palette

- **Warm Ivory / Cream**: `#EFE6CA`
- **Antique Gold**: `#B9905A`
- **Terracotta**: `#B95F46`
- **Slate Teal**: `#44636A`
- **Charcoal**: `#292D2B` / `#141615`
- **Typography**: High contrast editorial serif (`Cormorant Garamond`) paired with clean modern sans-serif (`Inter`) and accent handwritten script (`Caveat`).

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React icons.
- **Components**: 
  - `HeroBook`: Illustrated open book with parchment texture, spine shadow, and 1s mount entrance.
  - `BentoGallery`: Mixed cell sizes (2x2, 1x2, 1x1), skeleton loaders, photo Lightbox modal, and embedded YouTube modal player.
  - `LetterSwap`: React Bits Pro 3D Letter Swap per-letter staggered text animation.
  - `SkewedCarousel`: React Bits Pro horizontal cards with 3D tilt and perspective scaling.
  - `BackToTop`: Smooth scrolling to top after hero.
- **Serverless Backend (`/api`)**: Vercel Serverless Functions.
- **Data Store**:
  - `content/site-content.json`: Single structured JSON file holding chapters, photos, videos, teachers, memories, people, and links.
  - Admin PUT/POST endpoints commit edits directly back to GitHub using the GitHub REST Contents API (`GITHUB_TOKEN`), triggering automatic Vercel redeployment.
  - `api/content.ts` fetches fresh data from GitHub Raw Content API with live KV likes merge.
- **Vercel KV (`@vercel/kv`)**:
  - **Photo Likes**: Real-time atomic counter (`photo:{id}:likes`), never writing to `site-content.json`.
  - **Pending Memory Queue**: Stores unmoderated public memory submissions until approved by an admin.
  - **Rate Limiting**: IP-based rate limiting on Admin Login (5/15m), Memory submissions (3/10m), and Photo likes (20/1m).
- **Security**:
  - `httpOnly`, `Secure`, `SameSite=Strict` cookie for JWT authentication (no localStorage tokens).
  - Public text sanitization against stored XSS.
  - Strict Content-Security-Policy in `vercel.json` allowlisting YouTube iframes and Google Drive images.
  - `noindex, nofollow` on `/admin` route.

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development environment
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Admin CMS

- Navigate to `/admin` or click the Shield icon in the navigation bar.
- Default credentials (configured via environment):
  - **Username**: `admin`
  - **Password**: `teachersday2026`
