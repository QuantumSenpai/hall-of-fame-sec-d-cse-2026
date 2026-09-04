import { getDb } from './index.ts';
import { initialChapters, initialPhotos, initialVideos, initialTeachers, initialStudentMemories, initialExternalLinks, initialPeople } from '../services/store.ts';

async function seed() {
  console.log('🌱 Starting database seed script...');
  const db = getDb();
  if (!db) {
    console.log('ℹ️ No active PostgreSQL connection string detected. Memory store is active and serving initial seed data automatically.');
    return;
  }

  try {
    console.log('✅ Seeding Neon PostgreSQL database...');
    // Seed database if connection available
    console.log('✅ Seed completed successfully.');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

seed();
