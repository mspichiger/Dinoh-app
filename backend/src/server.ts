import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { appsRouter } from './routes/apps';
import { statsRouter } from './routes/stats';
import { exploreRouter } from './routes/explore';
import { submitRouter } from './routes/submit';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:4200';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'dinoh-backend' });
});

app.use('/api/apps', appsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/submissions', submitRouter);

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
