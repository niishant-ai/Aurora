export const ROLES = ["public", "researcher", "editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const ASSET_TYPES = ["report", "image", "video", "dataset"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const REGIONS = ["Arctic", "Antarctic", "Southern Ocean", "Himalaya"] as const;
export type Region = (typeof REGIONS)[number];

export const AUDIENCES = ["public", "student", "researcher"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const DRAFT_KINDS = ["web", "social"] as const;
export type DraftKind = (typeof DRAFT_KINDS)[number];

export const DRAFT_STATUSES = ["draft", "review", "approved", "published"] as const;
export type DraftStatus = (typeof DRAFT_STATUSES)[number];

export const SEARCH_MODES = ["keyword", "semantic", "hybrid"] as const;
export type SearchMode = (typeof SEARCH_MODES)[number];

export type PassageEmbedding = number[];

export type Citation = {
  n: number;
  passageId: string;
  assetId: string;
  assetTitle: string;
  heading: string;
  page: number | null;
  excerpt: string;
};

export type Grounding = {
  sentence: string;
  citation: number;
  passageId: string;
  sourceExcerpt: string;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export type ExpeditionDTO = {
  id: string;
  code: string;
  name: string;
  region: string;
  station: string;
  vessel: string;
  lead: string;
  year: number;
  startDate: string;
  endDate: string;
  summary: string;
  lat: number;
  lng: number;
  focus: string;
};

export type AssetDTO = {
  id: string;
  title: string;
  type: AssetType;
  expeditionId: string;
  expeditionCode?: string;
  expeditionName?: string;
  region?: string;
  year: number;
  abstract: string;
  tags: string[];
  authors: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  mimeType: string;
  sizeLabel: string;
  citation: string;
  status: string;
  provenance: string;
  credit: string | null;
  duration: string | null;
  pages: number | null;
  createdAt: string;
};

export type PassageDTO = {
  id: string;
  assetId: string;
  ord: number;
  heading: string;
  body: string;
  page: number | null;
  embedding: number[];
};

export type DraftDTO = {
  id: string;
  assetId: string;
  assetTitle?: string;
  passageIds: string[];
  kind: DraftKind;
  audience: Audience;
  title: string;
  body: string;
  citations: Citation[];
  grounding: Grounding[];
  glossary: GlossaryEntry[];
  status: DraftStatus;
  channel: string;
  scheduledAt: string | null;
  authorName: string;
  reviewerNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityDTO = {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
};

export type HighlightRange = {
  start: number;
  end: number;
};

export type SearchHit = {
  asset: AssetDTO;
  passage: PassageDTO | null;
  score: number;
  snippet: string;
  highlights: HighlightRange[];
  mode: SearchMode;
};

export type DatasetPreview = {
  headers: string[];
  rows: string[][];
};

export type GenerationResult = {
  title: string;
  body: string;
  citations: Citation[];
  grounding: Grounding[];
  glossary: GlossaryEntry[];
  adapter: string;
  kind: DraftKind;
  audience: Audience;
  charCount: number;
  draftId?: string;
};
