import { Router } from 'express';
import { randomUUID } from 'crypto';
import { pool } from '../db/pool';
import { Confidentiality, SubmittedApp } from '../types';

export const submitRouter = Router();

const VALID_CONF: Confidentiality[] = ['C1', 'C2', 'C3', 'C4'];

function isString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

function rowToSubmission(r: any): SubmittedApp {
    return {
        id: r.id,
        url: r.url,
        name: r.name,
        description: r.description,
        tags: r.tags ?? [],
        function: r.function,
        department: r.department ?? '',
        confidentiality: r.confidentiality,
        submittedBy: { name: r.submitter_name, email: r.submitter_email },
        submittedAt: new Date(r.submitted_at).toISOString()
    };
}

submitRouter.get('/', async (_req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM submissions ORDER BY submitted_at DESC');
        res.json(rows.map(rowToSubmission));
    } catch (err) { next(err); }
});

submitRouter.post('/', async (req, res, next) => {
    const body = req.body ?? {};
    const {
        url, name, description, tags, function: fn,
        department, confidentiality, submittedBy
    } = body;

    if (!isString(url) || !isString(name) || !isString(description) || !isString(fn)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isString)) {
        return res.status(400).json({ error: 'tags must be a non-empty string array' });
    }
    if (!VALID_CONF.includes(confidentiality)) {
        return res.status(400).json({ error: 'Invalid confidentiality level' });
    }

    const submitterName = submittedBy && isString(submittedBy.name) ? submittedBy.name : 'Anonymous';
    const submitterEmail = submittedBy && isString(submittedBy.email) ? submittedBy.email : 'anonymous@roche.com';

    try {
        const id = randomUUID();
        const { rows } = await pool.query(
            `INSERT INTO submissions
                (id, url, name, description, tags, function, department, confidentiality, submitter_name, submitter_email)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             RETURNING *`,
            [
                id, url, name, description, tags, fn,
                isString(department) ? department : '',
                confidentiality, submitterName, submitterEmail
            ]
        );
        res.status(201).json(rowToSubmission(rows[0]));
    } catch (err) { next(err); }
});
