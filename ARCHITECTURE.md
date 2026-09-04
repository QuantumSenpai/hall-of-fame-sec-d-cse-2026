# Teachers' Day 2026 — Interactive Digital Memory Book
## System Architecture & Technical Specifications

### 1. Vision & Identity
- **Theme**: Vintage Interactive Digital Memory Book.
- **Color Palette**:
  - Warm Ivory: `#EFE6CA`
  - Antique Gold: `#B9905A`
  - Terracotta: `#B95F46`
  - Muted Blue: `#44636A`
  - Charcoal: `#292D2B`
- **Typography**: High contrast editorial serif (Cormorant Garamond / Bodoni Moda) paired with modern sans-serif (Inter / System font).

### 2. Architecture Layers
1. **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, shadcn/ui patterns.
2. **Backend API**: Node.js, Express, TypeScript, JWT Authentication.
3. **Database Layer**: Neon PostgreSQL with Drizzle ORM schemas and relations.
4. **Media Layer**: YouTube URL & Embed parser, Google Drive image link standardizer & fallbacks.

### 3. Core Interaction Flow
- Initial entrance: Cinematic book reveal with 360-degree rotation.
- Scroll engine: Scroll progress drives 3D book perspective, opening, chapter zooming, and page flip transitions.
- Chapters: Dynamic chapters mapped from database with customizable layout templates (Polaroids, film strips, editorial collages, video theaters).
- Ending sequence: Book closes -> soft energy particle sweep -> emotional closing quote -> "One Last Page" student apology note.

### 4. CMS & Administration
- Protected `/admin` login route.
- Operations: Chapters, Photos, Videos, Teachers, Student Memory Submissions moderation, External Links, People list.
- Data states: Draft, Published, Archived with soft-delete capabilities.
