import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { appsRouter } from './routes/apps';
import { statsRouter } from './routes/stats';
import { exploreRouter } from './routes/explore';
import { submitRouter } from './routes/submit';
import { requireAuth } from './middleware/auth';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:4200';
const AUTH_ENABLED = process.env.AUTH_ENABLED !== 'false';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'dinoh-backend' });
});

const protect = AUTH_ENABLED ? [requireAuth] : [];

app.get('/api/me', ...protect, (req, res) => {
    res.json({ user: req.user ?? null });
});

app.use('/api/apps', ...protect, appsRouter);
app.use('/api/stats', ...protect, statsRouter);
app.use('/api/explore', ...protect, exploreRouter);
app.use('/api/submissions', ...protect, submitRouter);

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`DINOH backend listening on http://localhost:${PORT}`);
});
