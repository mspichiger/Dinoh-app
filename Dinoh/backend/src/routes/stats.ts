import { Router } from 'express';
import { pool } from '../db/pool';

export const statsRouter = Router();

statsRouter.get('/', async (_req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT label, value, delta, icon, accent FROM stats ORDER BY sort_order ASC'
        );
        res.json(rows);
    } catch (err) { next(err); }
});
