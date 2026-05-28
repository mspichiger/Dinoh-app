import { Router } from 'express';
import { exploreItems } from '../data/store';

export const exploreRouter = Router();

exploreRouter.get('/', (req, res) => {
    const q = (req.query.q as string | undefined)?.toLowerCase().trim();
    if (!q) {
        return res.json(exploreItems);
    }
    const filtered = exploreItems.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
    );
    res.json(filtered);
});
