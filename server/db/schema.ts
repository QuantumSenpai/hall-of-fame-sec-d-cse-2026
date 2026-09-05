import { pgTable, text, integer, boolean, timestamp, serial, varchar, jsonb } from 'drizzle-orm/pg-core';

// Photos table
export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  caption: text('caption'),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  driveFileId: text('drive_file_id'),
  layoutStyle: varchar('layout_style', { length: 50 }).default('vintage_frame').notNull(),
  category: varchar('category', { length: 100 }).default('MEMORIES'),
  date: text('date'),
  location: text('location'),
  uploadedBy: text('uploaded_by').default('Admin'),
  likes: integer('likes').default(0).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  status: varchar('status', { length: 20 }).default('published').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Videos table
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
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

// Teachers table
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

// People / Contributors table
export const people = pgTable('people', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  team: varchar('team', { length: 50 }).default('organizer').notNull(),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student Memories table (Moderated)
export const memories = pgTable('memories', {
  id: serial('id').primaryKey(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').default('Student').notNull(),
  message: text('message').notNull(),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 50 }).default('gratitude').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Hero section single-row table
export const hero = pgTable('hero', {
  id: serial('id').primaryKey(),
  badgeText: text('badge_text').notNull(),
  titleLine1: text('title_line_1').notNull(),
  titleLine2: text('title_line_2').notNull(),
  titleLine3: text('title_line_3').notNull(),
  subtitle: text('subtitle').notNull(),
  bookImage: text('book_image'),
  bookCaption: text('book_caption'),
  quoteHeading: text('quote_heading'),
  quoteSubtext: text('quote_subtext'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Apology section single-row table
export const apology = pgTable('apology', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  title: text('title').notNull(),
  paragraphs: jsonb('paragraphs').$type<string[]>().notNull(),
  signature: text('signature').notNull(),
  subSignature: text('sub_signature').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inferred Drizzle types
export type Photo = typeof photos.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type Person = typeof people.$inferSelect;
export type StudentMemory = typeof memories.$inferSelect;
export type HeroContent = typeof hero.$inferSelect;
export type ApologyContent = typeof apology.$inferSelect;
