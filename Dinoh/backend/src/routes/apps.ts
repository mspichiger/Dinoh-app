import { Router } from 'express';
import { pool } from '../db/pool';
import { AppCard } from '../types';

export const appsRouter = Router();

function rowToApp(r: any): AppCard {
    return {
        id: r.id,
        name: r.name,
        author: r.author,
        description: r.description,
        rating: Number(r.rating),
        reviews: Number(r.reviews),
        value: Number(r.value),
        users: Number(r.users),
        tags: r.tags ?? [],
        rank: Number(r.rank),
        emoji: r.emoji
    };
}

appsRouter.get('/', async (_req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM apps ORDER BY rank ASC');
        res.json(rows.map(rowToApp));
    } catch (err) { next(err); }
});

appsRouter.get('/top-rated', async (_req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM apps ORDER BY rating DESC, reviews DESC, rank ASC'
        );
        res.json(rows.map(rowToApp));
    } catch (err) { next(err); }
});

appsRouter.get('/:id', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM apps WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'App not found' });
        }
        res.json(rowToApp(rows[0]));
    } catch (err) { next(err); }
});
