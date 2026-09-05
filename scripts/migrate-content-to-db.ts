import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === '') {
    console.error('❌ DATABASE_URL environment variable is missing. Please set DATABASE_URL in .env before running migration.');
    process.exit(1);
  }

  console.log('🚀 Connecting to Neon PostgreSQL...');
  const sql = neon(connectionString);

  console.log('📦 Verifying database tables...');
  await sql`
    CREATE TABLE IF NOT EXISTS photos (
      id BIGINT PRIMARY KEY,
      title TEXT NOT NULL,
      caption TEXT,
      description TEXT,
      image_url TEXT NOT NULL,
      drive_file_id TEXT,
      layout_style VARCHAR(50) DEFAULT 'vintage_frame' NOT NULL,
      category VARCHAR(100) DEFAULT 'MEMORIES',
      date TEXT,
      location TEXT,
      uploaded_by TEXT DEFAULT 'Admin',
      likes INTEGER DEFAULT 0 NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE NOT NULL,
      status VARCHAR(20) DEFAULT 'published' NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      created_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS videos (
      id BIGINT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      youtube_url TEXT NOT NULL,
      youtube_id TEXT NOT NULL,
      thumbnail_url TEXT,
      is_short BOOLEAN DEFAULT FALSE NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE NOT NULL,
      status VARCHAR(20) DEFAULT 'published' NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      created_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS teachers (
      id BIGINT PRIMARY KEY,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      photo_url TEXT,
      message TEXT NOT NULL,
      profile_link TEXT,
      video_url TEXT,
      is_featured BOOLEAN DEFAULT FALSE NOT NULL,
      status VARCHAR(20) DEFAULT 'published' NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      created_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS people (
      id BIGINT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      team VARCHAR(50) DEFAULT 'organizer' NOT NULL,
      photo_url TEXT,
      bio TEXT,
      display_order INTEGER DEFAULT 0 NOT NULL,
      created_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS memories (
      id BIGINT PRIMARY KEY,
      author_name TEXT NOT NULL,
      author_role TEXT DEFAULT 'Student' NOT NULL,
      message TEXT NOT NULL,
      image_url TEXT,
      category VARCHAR(50) DEFAULT 'gratitude' NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      is_featured BOOLEAN DEFAULT FALSE NOT NULL,
      approved_at BIGINT,
      created_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS hero (
      id SERIAL PRIMARY KEY,
      badge_text TEXT NOT NULL,
      title_line_1 TEXT NOT NULL,
      title_line_2 TEXT NOT NULL,
      title_line_3 TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      book_image TEXT,
      book_caption TEXT,
      quote_heading TEXT,
      quote_subtext TEXT,
      updated_at BIGINT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS apology (
      id SERIAL PRIMARY KEY,
      label TEXT NOT NULL,
      title TEXT NOT NULL,
      paragraphs JSONB NOT NULL,
      signature TEXT NOT NULL,
      sub_signature TEXT NOT NULL,
      updated_at BIGINT
    );
  `;

  console.log('✅ Tables verified.');

  // Load content/site-content.json
  const contentPath = path.resolve(process.cwd(), 'content/site-content.json');
  if (!fs.existsSync(contentPath)) {
    console.warn('⚠️ content/site-content.json not found, skipping data seed.');
    return;
  }

  const rawJson = fs.readFileSync(contentPath, 'utf-8');
  const content = JSON.parse(rawJson);

  // 1. Hero
  const heroCount = await sql`SELECT count(*)::int as count FROM hero`;
  if (heroCount[0].count === 0 && content.hero) {
    console.log('🌱 Seeding Hero content...');
    await sql`
      INSERT INTO hero (id, badge_text, title_line_1, title_line_2, title_line_3, subtitle, book_image, book_caption, quote_heading, quote_subtext, updated_at)
      VALUES (
        1,
        ${content.hero.badgeText || ''},
        ${content.hero.titleLine1 || ''},
        ${content.hero.titleLine2 || ''},
        ${content.hero.titleLine3 || ''},
        ${content.hero.subtitle || ''},
        ${content.hero.bookImage || null},
        ${content.hero.bookCaption || null},
        ${content.hero.quoteHeading || null},
        ${content.hero.quoteSubtext || null},
        ${Date.now()}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  // 2. Apology
  const apologyCount = await sql`SELECT count(*)::int as count FROM apology`;
  if (apologyCount[0].count === 0 && content.apology) {
    console.log('🌱 Seeding Apology content...');
    await sql`
      INSERT INTO apology (id, label, title, paragraphs, signature, sub_signature, updated_at)
      VALUES (
        1,
        ${content.apology.label || ''},
        ${content.apology.title || ''},
        ${JSON.stringify(content.apology.paragraphs || [])},
        ${content.apology.signature || ''},
        ${content.apology.subSignature || ''},
        ${Date.now()}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  // 3. Photos
  if (Array.isArray(content.photos)) {
    console.log(`🌱 Seeding ${content.photos.length} photos...`);
    for (const p of content.photos) {
      const createdAtMs = p.createdAt ? new Date(p.createdAt).getTime() : Date.now();
      await sql`
        INSERT INTO photos (id, title, caption, description, image_url, drive_file_id, layout_style, category, date, location, uploaded_by, likes, is_featured, status, display_order, created_at)
        VALUES (
          ${p.id},
          ${p.title || ''},
          ${p.caption || null},
          ${p.description || null},
          ${p.imageUrl || ''},
          ${p.driveFileId || null},
          ${p.layoutStyle || 'vintage_frame'},
          ${p.category || 'MEMORIES'},
          ${p.date || null},
          ${p.location || null},
          ${p.uploadedBy || 'Admin'},
          ${p.likes || 0},
          ${Boolean(p.isFeatured)},
          ${p.status || 'published'},
          ${p.displayOrder || 0},
          ${createdAtMs}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // 4. Videos
  if (Array.isArray(content.videos)) {
    console.log(`🌱 Seeding ${content.videos.length} videos...`);
    for (const v of content.videos) {
      const createdAtMs = v.createdAt ? new Date(v.createdAt).getTime() : Date.now();
      await sql`
        INSERT INTO videos (id, title, description, youtube_url, youtube_id, thumbnail_url, is_short, is_featured, status, display_order, created_at)
        VALUES (
          ${v.id},
          ${v.title || ''},
          ${v.description || null},
          ${v.youtubeUrl || ''},
          ${v.youtubeId || ''},
          ${v.thumbnailUrl || null},
          ${Boolean(v.isShort)},
          ${Boolean(v.isFeatured)},
          ${v.status || 'published'},
          ${v.displayOrder || 0},
          ${createdAtMs}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // 5. Teachers
  if (Array.isArray(content.teachers)) {
    console.log(`🌱 Seeding ${content.teachers.length} teachers...`);
    for (const t of content.teachers) {
      const createdAtMs = t.createdAt ? new Date(t.createdAt).getTime() : Date.now();
      await sql`
        INSERT INTO teachers (id, name, department, photo_url, message, profile_link, video_url, is_featured, status, display_order, created_at)
        VALUES (
          ${t.id},
          ${t.name || ''},
          ${t.department || ''},
          ${t.photoUrl || null},
          ${t.message || ''},
          ${t.profileLink || null},
          ${t.videoUrl || null},
          ${Boolean(t.isFeatured)},
          ${t.status || 'published'},
          ${t.displayOrder || 0},
          ${createdAtMs}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // 6. People
  if (Array.isArray(content.people)) {
    console.log(`🌱 Seeding ${content.people.length} people...`);
    for (const p of content.people) {
      const createdAtMs = p.createdAt ? new Date(p.createdAt).getTime() : Date.now();
      await sql`
        INSERT INTO people (id, name, role, team, photo_url, bio, display_order, created_at)
        VALUES (
          ${p.id},
          ${p.name || ''},
          ${p.role || ''},
          ${p.team || 'organizer'},
          ${p.photoUrl || null},
          ${p.bio || null},
          ${p.displayOrder || 0},
          ${createdAtMs}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // 7. Memories
  if (Array.isArray(content.memories)) {
    console.log(`🌱 Seeding ${content.memories.length} memories...`);
    for (const m of content.memories) {
      const createdAtMs = m.createdAt ? new Date(m.createdAt).getTime() : Date.now();
      const approvedAtMs = m.approvedAt ? new Date(m.approvedAt).getTime() : Date.now();
      await sql`
        INSERT INTO memories (id, author_name, author_role, message, image_url, category, status, is_featured, approved_at, created_at)
        VALUES (
          ${m.id},
          ${m.authorName || ''},
          ${m.authorRole || 'Student'},
          ${m.message || ''},
          ${m.imageUrl || null},
          ${m.category || 'gratitude'},
          ${m.status || 'approved'},
          ${Boolean(m.isFeatured)},
          ${approvedAtMs},
          ${createdAtMs}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  console.log('✨ All content successfully migrated and seeded into PostgreSQL!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
