import { Router } from 'express';
import { topRated } from '../data/store';

export const appsRouter = Router();

appsRouter.get('/', (_req, res) => {
    res.json(topRated);
});

appsRouter.get('/top-rated', (_req, res) => {
    res.json(topRated);
});

appsRouter.get('/:id', (req, res) => {
    const app = topRated.find(a => a.id === req.params.id);
    if (!app) {
        return res.status(404).json({ error: 'App not found' });
    }
    res.json(app);
});
