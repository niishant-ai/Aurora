import { integer, jsonb, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import type { Citation, DraftStatus, GlossaryEntry, Grounding, PassageEmbedding } from "@/lib/types";

export const expeditions = pgTable("expeditions", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  station: text("station").notNull(),
  vessel: text("vessel").notNull(),
  lead: text("lead").notNull(),
  year: integer("year").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  summary: text("summary").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  focus: text("focus").notNull(),
});

export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  expeditionId: text("expedition_id")
    .notNull()
    .references(() => expeditions.id),
  year: integer("year").notNull(),
  abstract: text("abstract").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  authors: text("authors").notNull(),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  mimeType: text("mime_type").notNull(),
  sizeLabel: text("size_label").notNull(),
  citation: text("citation").notNull(),
  status: text("status").notNull(),
  provenance: text("provenance").notNull(),
  credit: text("credit"),
  duration: text("duration"),
  pages: integer("pages"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const passages = pgTable("passages", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  ord: integer("ord").notNull(),
  heading: text("heading").notNull(),
  body: text("body").notNull(),
  page: integer("page"),
  embedding: jsonb("embedding").$type<PassageEmbedding>().notNull(),
});

export const drafts = pgTable("drafts", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  passageIds: jsonb("passage_ids").$type<string[]>().notNull(),
  kind: text("kind").notNull(),
  audience: text("audience").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  citations: jsonb("citations").$type<Citation[]>().notNull(),
  grounding: jsonb("grounding").$type<Grounding[]>().notNull(),
  glossary: jsonb("glossary").$type<GlossaryEntry[]>().notNull(),
  status: text("status").$type<DraftStatus>().notNull(),
  channel: text("channel").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  authorName: text("author_name").notNull(),
  reviewerNote: text("reviewer_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const meta = pgTable("meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
