import { Router } from 'express';
import { randomUUID } from 'crypto';
import { submissions } from '../data/store';
import { Confidentiality, SubmittedApp } from '../types';

export const submitRouter = Router();

const VALID_CONF: Confidentiality[] = ['C1', 'C2', 'C3', 'C4'];

function isString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

submitRouter.get('/', (_req, res) => {
    res.json(submissions);
});

submitRouter.post('/', (req, res) => {
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

    const submitter = submittedBy && isString(submittedBy.name) && isString(submittedBy.email)
        ? { name: submittedBy.name, email: submittedBy.email }
        : { name: 'Anonymous', email: 'anonymous@roche.com' };

    const entry: SubmittedApp = {
        id: randomUUID(),
        url,
        name,
        description,
        tags,
        function: fn,
        department: isString(department) ? department : '',
        confidentiality,
        submittedBy: submitter,
        submittedAt: new Date().toISOString()
    };

    submissions.push(entry);
    res.status(201).json(entry);
});
