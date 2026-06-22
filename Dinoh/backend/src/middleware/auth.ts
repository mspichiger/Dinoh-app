import { NextFunction, Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

export interface AuthUser {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    hd?: string;
    email_verified?: boolean;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

interface CacheEntry {
    user: AuthUser;
    expiresAt: number;
}

const tokenCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

let client: OAuth2Client | null = null;
function getClient(): OAuth2Client {
    if (!client) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            throw new Error('GOOGLE_CLIENT_ID is not configured in .env');
        }
        client = new OAuth2Client(clientId);
    }
    return client;
}

function getAllowedDomain(): string | null {
    const d = process.env.GOOGLE_ALLOWED_HD;
    return d && d.trim().length > 0 ? d.trim() : null;
}

async function verifyIdToken(token: string): Promise<AuthUser | null> {
    const cached = tokenCache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.user;
    }

    const ticket = await getClient().verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload: TokenPayload | undefined = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) return null;

    const allowedHd = getAllowedDomain();
    if (allowedHd && payload.hd !== allowedHd) {
        return null;
    }

    const user: AuthUser = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        hd: payload.hd,
        email_verified: payload.email_verified
    };

    const tokenExpMs = typeof payload.exp === 'number' ? payload.exp * 1000 : Number.POSITIVE_INFINITY;
    tokenCache.set(token, {
        user,
        expiresAt: Math.min(Date.now() + CACHE_TTL_MS, tokenExpMs)
    });
    return user;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.header('authorization') ?? '';
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    try {
        const user = await verifyIdToken(match[1]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid, expired, or unauthorized token' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
