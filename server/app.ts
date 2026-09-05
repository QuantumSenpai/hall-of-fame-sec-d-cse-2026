import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateAuthEnvironment } from './lib/auth.ts';

import authRouter from './routes/auth.ts';
import contentRouter from './routes/content.ts';
import heroRouter from './routes/hero.ts';
import apologyRouter from './routes/apology.ts';
import photosRouter from './routes/photos.ts';
import videosRouter from './routes/videos.ts';
import teachersRouter from './routes/teachers.ts';
import memoriesRouter from './routes/memories.ts';
import peopleRouter from './routes/people.ts';

dotenv.config();

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
