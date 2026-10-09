import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config as loadEnvLocal } from "dotenv";

// Next.js loads .env.local; dotenv/config only loads .env. Load the local file
// too so `drizzle-kit push` sees the same URL the app does.
loadEnvLocal({ path: ".env.local", quiet: true });

// Migrations and schema pushes go over a DIRECT connection, not the transaction
// pooler: pooled connections are recycled per transaction and DDL/session state
// does not survive that. Fall back to DATABASE_URL for a plain local Postgres.
const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "Set DATABASE_URL (or DIRECT_DATABASE_URL) before running drizzle-kit. See .env.example.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
