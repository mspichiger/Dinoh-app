import { Router } from 'express';
import { stats } from '../data/store';

export const statsRouter = Router();

statsRouter.get('/', (_req, res) => {
    res.json(stats);
});
