import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the unified /api serverless handlers
import loginHandler from '../api/auth/login.ts';
import meHandler from '../api/auth/me.ts';
import logoutHandler from '../api/auth/logout.ts';
import contentHandler from '../api/content.ts';
import heroHandler from '../api/hero.ts';
import apologyHandler from '../api/apology.ts';
import photosHandler from '../api/photos.ts';
import photoLikeHandler from '../api/photos/[id]/like.ts';
import videosHandler from '../api/videos.ts';
import teachersHandler from '../api/teachers.ts';
import memoriesHandler from '../api/memories.ts';
import memoryStatusHandler from '../api/memories/[id]/status.ts';
import peopleHandler from '../api/people.ts';
import { validateAuthEnvironment } from '../api/lib/auth.ts';

dotenv.config();

// Enforce critical security environment variables on server boot
try {
  validateAuthEnvironment();
} catch (err: any) {
  console.error('\n❌ [SERVER STARTUP ABORTED] ' + err.message + '\n');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Unified API Routes routing to serverless handlers
app.all('/api/auth/login', (req, res) => loginHandler(req, res));
app.all('/api/auth/me', (req, res) => meHandler(req, res));
app.all('/api/auth/logout', (req, res) => logoutHandler(req, res));

app.all('/api/content', (req, res) => contentHandler(req, res));
app.all('/api/hero', (req, res) => heroHandler(req, res));
app.all('/api/apology', (req, res) => apologyHandler(req, res));

app.all('/api/photos/:id/like', (req, res) => {
  req.query.id = req.params.id;
  return photoLikeHandler(req, res);
});
app.all('/api/photos', (req, res) => photosHandler(req, res));

app.all('/api/videos', (req, res) => videosHandler(req, res));
app.all('/api/teachers', (req, res) => teachersHandler(req, res));

app.all('/api/memories/:id/status', (req, res) => {
  req.query.id = req.params.id;
  return memoryStatusHandler(req, res);
});
app.all('/api/memories', (req, res) => memoriesHandler(req, res));

app.all('/api/people', (req, res) => peopleHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: "Teachers' Day 2026 Interactive Digital Memory Book",
    timestamp: new Date().toISOString(),
  });
});

// Production static file serving
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
