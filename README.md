# Teachers' Day 2026 — Interactive Digital Memory Book

An interactive, cinematic, premium digital memory book web application engineered to let visitors relive the Teachers' Day 2026 celebration of Computer Science & Engineering Section D.

The central visual element is a **3D Physical-Looking Vintage Book** with scroll-driven opening, page-flipping, stage zooming, and dynamic media storytelling.

---

## 🌟 Visual Identity & Color Palette

- **Warm Ivory**: `#EFE6CA`
- **Antique Gold**: `#B9905A`
- **Terracotta**: `#B95F46`
- **Muted Blue**: `#44636A`
- **Charcoal**: `#292D2B`
- **Typography**: High contrast editorial serif (`Cormorant Garamond` / `Bodoni Moda`) paired with clean modern sans-serif (`Inter`) and handwritten script (`Caveat`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React icons.
- **Backend API**: Node.js, Express, TypeScript, JWT Authentication.
- **Database**: Neon PostgreSQL with Drizzle ORM.
- **Media System**: YouTube Embed & Shorts parser, Google Drive direct stream link normalizer.
- **Admin CMS**: Protected management dashboard with moderation queue for public memory submissions.

---

## 📁 Folder Structure

```
.
├── ARCHITECTURE.md                  # Detailed system architecture design doc
├── .env.example                     # Environment variables template
├── package.json                     # Root scripts and unified dependencies
├── vite.config.ts                   # Vite frontend & API proxy config
├── tailwind.config.js               # Color tokens & typography configuration
├── drizzle.config.ts                # Drizzle ORM migration configuration
│
├── server/                          # Express Backend API & Services
│   ├── index.ts                     # Server entry point
│   ├── db/                          # Database connection & schema definitions
│   │   ├── index.ts                 # Neon PostgreSQL client initializer
│   │   ├── schema.ts                # Drizzle tables & TypeScript types
│   │   └── seed.ts                  # Database seeding script
│   ├── middleware/                  # Auth JWT validation
│   ├── routes/                      # REST API endpoint handlers
│   └── services/                    # Media link transformers & memory store
│
└── src/                             # React Frontend Application
    ├── main.tsx                     # React DOM entry
    ├── App.tsx                      # Root component & page router
    ├── index.css                    # 3D perspective & vintage paper textures
    ├── types/                       # Shared entity interfaces
    ├── lib/                         # API fetch wrapper
    ├── book/                        # 3D Vintage Book engine & scroll controller
    ├── components/                  # Scrapbook UI, Polaroid stack, film strip, cards
    └── admin/                       # Admin CMS Dashboard & moderation queue
```

---

## 🚀 Quick Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default local `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=teachers_day_2026_super_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=teachersday2026
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teachers_day_db
```

### 3. Run Development Server
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 🔐 Admin CMS & Moderation

- Access Admin Login via the shield icon in the navigation header or directly through the app.
- **Default Admin Credentials**:
  - Username: `admin`
  - Password: `teachersday2026`
- **CMS Capabilities**:
  - Manage Photos (supports direct Google Drive share links).
  - Manage YouTube Videos (supports standard links, watch URLs & Shorts).
  - Manage Faculty Messages & Profiles.
  - Manage Book Chapters and presentation layouts.
  - Approve or Reject student memory submissions.

---

## 🏗️ Production Build

To test production build compilation:
```bash
npm run build
```

To run production server:
```bash
NODE_ENV=production node dist/server/index.js
```

---

## ❤️ Dedication

Made with love by the students of Computer Science & Engineering — Section D (Class of 2026) for our guiding lights.
