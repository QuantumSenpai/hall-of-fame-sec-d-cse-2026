import app from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production static file serving for local / docker / self-hosted environments
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(` Teachers' Day 2026 API Server running at http://localhost:${PORT}`);
});
