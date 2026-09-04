import { pgTable, text, integer, boolean, timestamp, serial, varchar } from 'drizzle-orm/pg-core';

// Users / Admins table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chapters table
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  chapterNumber: integer('chapter_number').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  layoutType: varchar('layout_type', { length: 50 }).default('editorial').notNull(), // editorial, polaroid_stack, video_theater, torn_collage, film_strip
  coverImageUrl: text('cover_image_url'),
  status: varchar('status', { length: 20 }).default('published').notNull(), // draft, published, archived
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Photos table
export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  caption: text('caption'),
  imageUrl: text('image_url').notNull(),
  driveFileId: text('drive_file_id'),
  layoutStyle: varchar('layout_style', { length: 50 }).default('standard').notNull(), // polaroid, torn_edge, vintage_frame, full_bleed
  isFeatured: boolean('is_featured').default(false).notNull(),
  status: varchar('status', { length: 20 }).default('published').notNull(), // draft, published, archived
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Videos table
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  youtubeUrl: text('youtube_url').notNull(),
  youtubeId: text('youtube_id').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  isShort: boolean('is_short').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  status: varchar('status', { length: 20 }).default('published').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Teachers table & messages
export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  photoUrl: text('photo_url'),
  message: text('message').notNull(),
  profileLink: text('profile_link'),
  videoUrl: text('video_url'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  status: varchar('status', { length: 20 }).default('published').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student Memories table (Moderation queue)
export const studentMemories = pgTable('student_memories', {
  id: serial('id').primaryKey(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').default('Student').notNull(),
  message: text('message').notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 50 }).default('general').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, rejected
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// External Links table
export const externalLinks = pgTable('external_links', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  platform: varchar('platform', { length: 50 }).default('other').notNull(), // instagram, youtube, gdrive, linkedin, facebook, other
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// People / Contributors table
export const people = pgTable('people', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(), // Organizer, Photography Lead, Video Editor, Volunteer, etc.
  team: varchar('team', { length: 50 }).default('organizer').notNull(),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types exported for frontend & server
export type User = typeof users.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type StudentMemory = typeof studentMemories.$inferSelect;
export type ExternalLink = typeof externalLinks.$inferSelect;
export type Person = typeof people.$inferSelect;
