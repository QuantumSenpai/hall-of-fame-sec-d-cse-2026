import app from '../server/app.js';

/**
 * Unified Vercel Serverless Function entry point.
 * All /api/* traffic is routed to this single handler via vercel.json rewrite.
 */
export default function handler(req: any, res: any) {
  return app(req, res);
}
