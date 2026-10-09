import type { AssetType } from "@/lib/types";

const HINTS: { pattern: RegExp; expeditionId: string; tags: string[] }[] = [
  { pattern: /isea[-\s]?44|bharati|larsemann/i, expeditionId: "exp-isea44", tags: ["Bharati", "Antarctica"] },
  { pattern: /isea[-\s]?43|schirmacher|ice core/i, expeditionId: "exp-isea43", tags: ["Maitri", "ice core"] },
  { pattern: /indarc|kongsfjorden/i, expeditionId: "exp-indarc9", tags: ["IndARC", "Kongsfjorden"] },
  { pattern: /neutron|space weather|geomagnetic/i, expeditionId: "exp-space", tags: ["neutron monitor", "Maitri"] },
  { pattern: /dakshin|gangotri/i, expeditionId: "exp-heritage", tags: ["Dakshin Gangotri"] },
  { pattern: /madice|katabatic|dronning/i, expeditionId: "exp-madice", tags: ["MADICE"] },
  { pattern: /himansh|chandra|himalaya/i, expeditionId: "exp-himalaya", tags: ["Himalaya", "Himansh"] },
  { pattern: /permafrost|active layer|thaw depth/i, expeditionId: "exp-lakes", tags: ["permafrost", "Bharati"] },
  { pattern: /microb|epishelf|soil crust/i, expeditionId: "exp-microbe", tags: ["microbes", "Bharati"] },
  { pattern: /sagar nidhi|southern ocean|dimethyl|ice-rafted/i, expeditionId: "exp-sagar-2024", tags: ["Southern Ocean"] },
  { pattern: /carbon pump|pco2|coccolith/i, expeditionId: "exp-carbon", tags: ["carbon", "Southern Ocean"] },
  { pattern: /energy balance|drainage wind/i, expeditionId: "exp-cryo", tags: ["Himadri", "energy balance"] },
  { pattern: /himadri|ny-?alesund|black carbon|albedo/i, expeditionId: "exp-arctic-bc", tags: ["Himadri", "Arctic"] },
  { pattern: /maitri/i, expeditionId: "exp-isea43", tags: ["Maitri"] },
];

const TAG_RULES: [RegExp, string][] = [
  [/aerosol|aod|black carbon/i, "aerosol"],
  [/albedo/i, "albedo"],
  [/ice core|δ18|d18o/i, "δ18O"],
  [/ozone/i, "ozone"],
  [/mooring/i, "mooring"],
  [/firn/i, "firn"],
  [/katabatic/i, "katabatic"],
  [/chlorophyll|dms|dimethyl/i, "biology"],
  [/neutron/i, "space weather"],
  [/penguin|petrel|wildlife/i, "wildlife"],
];

export type ExtractedMeta = {
  title: string;
  year: number;
  type: AssetType;
  expeditionId: string;
  tags: string[];
  abstract: string;
  confidence: string[];
};

function titleFromFilename(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
  if (!base) return "Untitled intake";
  return base.replace(/\b([a-z])/g, (letter) => letter.toUpperCase());
}

export function inferType(filename: string, mime: string): AssetType {
  const lower = filename.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.includes("csv") || lower.endsWith(".csv") || lower.endsWith(".tsv")) return "dataset";
  return "report";
}

export function extractMetadata(filename: string, mime: string, notes: string): ExtractedMeta {
  const blob = `${filename} ${notes}`;
  const yearMatch = blob.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear();
  const type = inferType(filename, mime);
  const hint = HINTS.find((item) => item.pattern.test(blob));
  const tags = new Set<string>(hint?.tags ?? ["unassigned"]);
  for (const [pattern, tag] of TAG_RULES) {
    if (pattern.test(blob)) tags.add(tag);
  }
  if (type === "video") tags.add("video");
  if (type === "image") tags.add("still");
  if (type === "dataset") tags.add("dataset");
  const confidence = [
    yearMatch ? "Year read from the filename or notes" : "Year defaulted to this calendar year",
    hint ? "Expedition matched from the intake dictionary" : "No expedition token matched — left on the Bharati season for correction",
    `Type set from ${mime || "the file extension"}`,
  ];
  const abstract = notes.trim()
    ? notes.trim().slice(0, 700)
    : `Filed from ${filename}. Metadata was inferred from the filename, the media type, and the expedition dictionary. Replace this abstract before publishing a public line.`;
  return {
    title: titleFromFilename(filename),
    year,
    type,
    expeditionId: hint?.expeditionId ?? "exp-isea44",
    tags: [...tags].slice(0, 8),
    abstract,
    confidence,
  };
}

export function passagesFromText(text: string) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 40);
  if (blocks.length) {
    return blocks.slice(0, 8).map((block, index) => {
      const [first, ...rest] = block.split("\n");
      const heading = first.length < 80 ? first.replace(/^#+\s*/, "") : `Passage ${index + 1}`;
      const body = first.length < 80 && rest.length ? rest.join(" ").trim() : block;
      return { heading, body: body || block };
    });
  }
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    chunks.push(sentences.slice(index, index + 2).join(" "));
  }
  return chunks.filter((chunk) => chunk.length > 24).slice(0, 8).map((body, index) => ({
    heading: `Extract ${index + 1}`,
    body,
  }));
}
