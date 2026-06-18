import { Router } from 'express';
import { pool } from '../db/pool';
import { ExploreItem } from '../types';

export const exploreRouter = Router();

function rowToItem(r: any): ExploreItem {
    return {
        id: r.id,
        type: r.type,
        title: r.title,
        author: r.author,
        description: r.description,
        tags: r.tags ?? [],
        extraTags: Number(r.extra_tags),
        confidentiality: r.confidentiality,
        rating: Number(r.rating),
        reviews: Number(r.reviews),
        bookmarks: Number(r.bookmarks)
    };
}

exploreRouter.get('/', async (req, res, next) => {
    try {
        const q = (req.query.q as string | undefined)?.toLowerCase().trim();
        if (!q) {
            const { rows } = await pool.query('SELECT * FROM explore_items ORDER BY title ASC');
            return res.json(rows.map(rowToItem));
        }
        const like = `%${q}%`;
        const { rows } = await pool.query(
            `SELECT * FROM explore_items
             WHERE LOWER(title) LIKE $1
                OR LOWER(description) LIKE $1
                OR EXISTS (SELECT 1 FROM unnest(tags) t WHERE LOWER(t) LIKE $1)
             ORDER BY title ASC`,
            [like]
        );
        res.json(rows.map(rowToItem));
    } catch (err) { next(err); }
});
