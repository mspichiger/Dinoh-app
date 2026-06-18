import { Pool, PoolConfig } from 'pg';

const sslEnabled = (process.env.PGSSL ?? 'true').toLowerCase() === 'true';

const config: PoolConfig = {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
};

export const pool = new Pool(config);

pool.on('error', (err) => {
    console.error('Unexpected PG pool error', err);
});

if ((process.env.PG_LOG ?? 'true').toLowerCase() === 'true') {
    const originalQuery = pool.query.bind(pool) as any;
    (pool as any).query = (...args: any[]) => {
        const sql = typeof args[0] === 'string' ? args[0] : args[0]?.text;
        const start = Date.now();
        const result = originalQuery(...args);
        if (result && typeof result.then === 'function') {
            return result
                .then((r: any) => {
                    console.log(`[pg ${Date.now() - start}ms] ${sql?.replace(/\s+/g, ' ').slice(0, 120)} → ${r.rowCount ?? r.rows?.length ?? 0} rows`);
                    return r;
                })
                .catch((err: any) => {
                    console.error(`[pg ERROR] ${sql?.replace(/\s+/g, ' ').slice(0, 120)} → ${err.message}`);
                    throw err;
                });
        }
        return result;
    };
}
