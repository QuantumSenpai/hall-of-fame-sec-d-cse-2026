import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.ts';
import chapterRoutes from './routes/chapters.ts';
import photoRoutes from './routes/photos.ts';
import videoRoutes from './routes/videos.ts';
import teacherRoutes from './routes/teachers.ts';
import memoryRoutes from './routes/memories.ts';
import linkRoutes from './routes/links.ts';
import peopleRoutes from './routes/people.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/people', peopleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Teachers Day 2026 Interactive Digital Memory Book',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(` Teachers' Day 2026 API Server running at http://localhost:${PORT}`);
});
