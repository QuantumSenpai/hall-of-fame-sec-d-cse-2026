import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { validateAuthEnvironment } from './lib/auth.js';

import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';
import heroRouter from './routes/hero.js';
import apologyRouter from './routes/apology.js';
import photosRouter from './routes/photos.js';
import videosRouter from './routes/videos.js';
import teachersRouter from './routes/teachers.js';
import memoriesRouter from './routes/memories.js';
import peopleRouter from './routes/people.js';

// Enforce critical security environment variables on initialization
try {
  validateAuthEnvironment();
} catch (err: any) {
  console.error('\n❌ [SECURITY CONFIG ERROR] ' + err.message + '\n');
}

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Vercel rewrite compatibility
app.use((req, _res, next) => {
  const matched = req.headers['x-matched-path'];
  if (matched && typeof matched === 'string' && !matched.endsWith('/api/index') && !matched.endsWith('/api')) {
    const qIndex = req.url.indexOf('?');
    req.url = matched + (qIndex !== -1 ? req.url.slice(qIndex) : '');
  }
  next();
});

// Router holding all endpoints
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/hero', heroRouter);
apiRouter.use('/apology', apologyRouter);
apiRouter.use('/photos', photosRouter);
apiRouter.use('/videos', videosRouter);
apiRouter.use('/teachers', teachersRouter);
apiRouter.use('/memories', memoriesRouter);
apiRouter.use('/people', peopleRouter);

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    project: "Teachers' Day 2026 Interactive Digital Memory Book",
    timestamp: new Date().toISOString(),
  });
});

// Mount the apiRouter under both '/api' and '/'
// This ensures that requests arriving as /api/photos or rewritten to /photos or /api/index
// are routed accurately regardless of proxy/rewrite path alterations.
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
