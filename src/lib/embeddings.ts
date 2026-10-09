import { mergeRanges } from "@/lib/utils";
import type { HighlightRange } from "@/lib/types";

export const EMBEDDING_DIM = 128;

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "was",
  "were",
  "are",
  "has",
  "have",
  "been",
  "into",
  "over",
  "than",
  "its",
  "their",
  "not",
  "but",
  "which",
  "during",
  "after",
  "before",
  "about",
  "between",
  "under",
  "above",
  "only",
  "also",
  "than",
  "per",
  "via",
]);

function hashToken(token: string) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash | 0;
}

export function normalizeSearchText(text: string) {
  return text
    .toLowerCase()
    .replace(/δ/g, "delta")
    .replace(/µ/g, "u")
    .replace(/−/g, "-");
}

export function tokenize(text: string) {
  return normalizeSearchText(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP.has(token));
}

export function embed(text: string) {
  const vector = new Array<number>(EMBEDDING_DIM).fill(0);
  const tokens = tokenize(text);
  const add = (token: string, weight: number) => {
    const hash = hashToken(token);
    const index = Math.abs(hash) % EMBEDDING_DIM;
    const sign = (hash & 1) === 0 ? 1 : -1;
    vector[index] += sign * weight;
  };
  for (const token of tokens) {
    add(token, 1);
    if (token.length >= 5) {
      for (let index = 0; index < token.length - 2; index += 1) add(`#${token.slice(index, index + 3)}`, 0.35);
    }
  }
  for (let index = 0; index < tokens.length - 1; index += 1) {
    add(`${tokens[index]}_${tokens[index + 1]}`, 0.85);
  }
  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  return vector.map((value) => Number((value / norm).toFixed(6)));
}

export function cosine(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  for (let index = 0; index < length; index += 1) dot += left[index] * right[index];
  return dot;
}

export function queryTerms(query: string) {
  return normalizeSearchText(query)
    .split(/[^a-z0-9δ]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);
}

export function termVariants(term: string) {
  const normalized = term.toLowerCase();
  const variants = new Set<string>([normalized]);
  if (normalized.includes("delta")) variants.add(normalized.replace(/delta/g, "δ"));
  if (normalized.includes("δ")) variants.add(normalized.replace(/δ/g, "delta"));
  if (normalized.includes("d18o")) variants.add(normalized.replace(/d18o/g, "δ18o"));
  return [...variants];
}

export function keywordScore(text: string, terms: string[]) {
  if (!terms.length) return 0;
  const haystack = text.toLowerCase();
  let hits = 0;
  for (const term of terms) {
    if (termVariants(term).some((variant) => haystack.includes(variant))) hits += 1;
  }
  return hits / terms.length;
}

export function highlightRanges(text: string, terms: string[]): HighlightRange[] {
  const haystack = text.toLowerCase();
  const ranges: HighlightRange[] = [];
  for (const term of terms) {
    for (const variant of termVariants(term)) {
      let from = 0;
      while (from < haystack.length) {
        const found = haystack.indexOf(variant, from);
        if (found < 0) break;
        ranges.push({ start: found, end: found + variant.length });
        from = found + variant.length;
      }
    }
  }
  return mergeRanges(ranges);
}

export function makeSnippet(text: string, terms: string[], radius = 120) {
  const ranges = highlightRanges(text, terms);
  if (!ranges.length) {
    const snippet = text.length > radius * 2 ? `${text.slice(0, radius * 2).trim()}…` : text;
    return { snippet, highlights: [] as HighlightRange[] };
  }
  const first = ranges[0];
  const start = Math.max(0, first.start - radius);
  const end = Math.min(text.length, first.end + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  const highlights = ranges
    .filter((range) => range.end > start && range.start < end)
    .map((range) => ({
      start: range.start - start + prefix.length,
      end: range.end - start + prefix.length,
    }));
  return { snippet: `${prefix}${text.slice(start, end)}${suffix}`, highlights };
}
