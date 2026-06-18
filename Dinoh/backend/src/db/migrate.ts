import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './pool';
import { stats, topRated, exploreItems } from '../data/store';

async function run() {
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

    const client = await pool.connect();
    try {
        console.log('→ Applying schema…');
        await client.query(schemaSql);

        console.log('→ Seeding stats…');
        await client.query('TRUNCATE stats');
        for (let i = 0; i < stats.length; i++) {
            const s = stats[i];
            await client.query(
                `INSERT INTO stats (label, value, delta, icon, accent, sort_order)
                 VALUES ($1,$2,$3,$4,$5,$6)`,
                [s.label, s.value, s.delta, s.icon, s.accent, i]
            );
        }

        console.log('→ Seeding apps (top rated)…');
        await client.query('TRUNCATE apps');
        for (const a of topRated) {
            await client.query(
                `INSERT INTO apps (id, name, author, description, rating, reviews, value, users, tags, rank, emoji)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
                [a.id, a.name, a.author, a.description, a.rating, a.reviews, a.value, a.users, a.tags, a.rank, a.emoji]
            );
        }

        console.log('→ Seeding explore items…');
        await client.query('TRUNCATE explore_items');
        for (const e of exploreItems) {
            await client.query(
                `INSERT INTO explore_items (id, type, title, author, description, tags, extra_tags, confidentiality, rating, reviews, bookmarks)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
                [e.id, e.type, e.title, e.author, e.description, e.tags, e.extraTags, e.confidentiality, e.rating, e.reviews, e.bookmarks]
            );
        }

        console.log('✓ Migration & seed complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch((err) => {
    console.error('✗ Migration failed:', err);
    process.exit(1);
});
