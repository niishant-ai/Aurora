import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Serverless connection budget.
//
// Supabase's serverless guidance is to keep the pool small, because a warm
// function instance shares one client across every invocation it handles.
// Vercel's guidance for Fluid Compute is the opposite: it warns that `max: 1`
// harms concurrency on a warm instance. The default here follows Supabase
// (smallest safe pool against a free/limited Postgres); raise it with
// PG_POOL_MAX when you can show invocations are queuing.
//
// Note: `pgbouncer=true` and `connection_limit=1` in a connection string are
// Prisma-only flags. node-postgres ignores both — pool size is set here.
const poolMax = Number.parseInt(process.env.PG_POOL_MAX ?? "1", 10);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: Number.isFinite(poolMax) && poolMax > 0 ? poolMax : 1,
    // Vercel suspends idle instances; recycling idle sockets quickly avoids
    // handing a dead TCP socket to the next request.
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

// A pooled client can error while idle (e.g. the pooler drops a suspended
// function's socket). Without a handler that is an unhandled 'error' event and
// takes the function down; the pool replaces the client on its own.
pool.on("error", (error) => {
  console.error("[db] idle client error", error.message);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
