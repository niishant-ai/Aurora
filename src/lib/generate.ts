import type { Audience, Citation, DraftKind, GenerationResult, GlossaryEntry, Grounding } from "@/lib/types";

export type PassageSource = {
  id: string;
  heading: string;
  body: string;
  page: number | null;
  assetId: string;
  assetTitle: string;
};

const GLOSSARY: { term: string; pattern: RegExp; definition: string }[] = [
  { term: "Black carbon", pattern: /black carbon/i, definition: "Soot particles that darken snow and ice." },
  { term: "Albedo", pattern: /albedo/i, definition: "The fraction of sunlight a surface reflects." },
  { term: "Mixed layer", pattern: /mixed[ -]layer/i, definition: "The upper ocean kept fairly uniform by wind and cooling." },
  { term: "Atlantic Water", pattern: /atlantic water/i, definition: "A relatively warm, salty water mass that enters the Arctic." },
  { term: "Firn", pattern: /firn/i, definition: "Old, compacted snow on its way to becoming glacier ice." },
  { term: "Mooring", pattern: /mooring/i, definition: "A line of instruments anchored in the sea to record change over time." },
  { term: "Active layer", pattern: /active layer/i, definition: "The ground above permafrost that thaws in summer and refreezes in winter." },
  { term: "Permafrost", pattern: /permafrost/i, definition: "Ground that stays frozen for at least two years." },
  { term: "Dimethyl sulfide", pattern: /dimethyl sulfide|\bDMS\b/, definition: "A gas released by some marine microbes." },
  { term: "Ice-rafted debris", pattern: /ice-rafted debris/i, definition: "Rock grains carried out to sea by drifting ice, then dropped as the ice melts." },
  { term: "Aerosol optical depth", pattern: /aerosol optical depth|\bAOD\b/, definition: "A measure of how much aerosol blocks sunlight on its way to the surface." },
  { term: "δ18O", pattern: /δ18O|d18O/i, definition: "A ratio of oxygen isotopes used to read past temperature from ice." },
  { term: "Neutron monitor", pattern: /neutron monitor/i, definition: "A ground detector that counts cosmic-ray particles." },
  { term: "Katabatic", pattern: /katabatic/i, definition: "A wind that rushes downhill off an ice sheet or glacier." },
  { term: "Polynya", pattern: /polynya/i, definition: "An opening in sea ice where open water persists." },
  { term: "Coccolithophore", pattern: /coccolithophore/i, definition: "A tiny marine alga with chalky plates." },
  { term: "Epishelf", pattern: /epishelf/i, definition: "A lake trapped between land ice and a floating ice shelf or tongue." },
];

const INTRO: Record<Audience, string> = {
  public: "The lines below are rewritten only from the passage you selected. Nothing here was added from outside that text.",
  student: "Study note. Each numbered claim is tied to a sentence in the selected passage.",
  researcher: "Citation-locked extract. Numerals are unchanged from the source span.",
};

function splitSentences(body: string) {
  return body
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 32);
}

function digitsOf(value: string) {
  return value.match(/\d+(?:\.\d+)?/g) ?? [];
}

function transform(sentence: string, audience: Audience) {
  if (audience === "researcher") return sentence;
  let next = sentence;
  if (audience === "public") {
    next = next
      .replace(/\bapproximately\b/gi, "about")
      .replace(/\brelative to\b/gi, "compared with")
      .replace(/\baveraged\b/gi, "was about")
      .replace(/\bconcentration\b/gi, "amount")
      .replace(/\bindicates\b/gi, "points to")
      .replace(/\bdemonstrates\b/gi, "shows")
      .replace(/\bobserved\b/gi, "recorded");
  } else {
    next = next.replace(/\brelative to\b/gi, "compared with").replace(/\bindicates\b/gi, "suggests");
  }
  return next.replace(/\s+/g, " ").trim();
}

function rewriteSafe(sentence: string, audience: Audience) {
  const next = transform(sentence, audience);
  const original = new Set(digitsOf(sentence));
  if (digitsOf(next).some((digit) => !original.has(digit))) return sentence;
  return next;
}

function scoreSentence(sentence: string) {
  const digits = digitsOf(sentence).length;
  return digits * 4 + Math.min(sentence.length, 220) / 40;
}

function hashtag(tag: string) {
  const cleaned = tag.replace(/[^A-Za-z0-9 ]/g, " ").trim();
  if (!cleaned) return null;
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const hash = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  return hash.length > 1 ? `#${hash}` : null;
}

function glossaryFor(text: string): GlossaryEntry[] {
  return GLOSSARY.filter((entry) => entry.pattern.test(text)).map((entry) => ({
    term: entry.term,
    definition: entry.definition,
  }));
}

export function generateCitationLocked(input: {
  passages: PassageSource[];
  audience: Audience;
  kind: DraftKind;
  assetTitle: string;
  tags: string[];
}): GenerationResult {
  if (!input.passages.length) {
    throw new Error("Select at least one passage before generating.");
  }

  const pool = input.passages.flatMap((passage) => {
    const sentences = splitSentences(passage.body);
    const usable = sentences.length ? sentences : passage.body.trim().length > 24 ? [passage.body.trim()] : [];
    return usable.map((sentence) => ({ passage, sentence }));
  });

  if (!pool.length) {
    throw new Error("The selected passage does not contain a citable sentence.");
  }

  const limit = input.kind === "social" ? 2 : input.audience === "researcher" ? 5 : input.audience === "student" ? 4 : 3;
  const chosen = [...pool].sort((a, b) => scoreSentence(b.sentence) - scoreSentence(a.sentence)).slice(0, limit);

  const citations: Citation[] = [];
  const citationByPassage = new Map<string, number>();
  const grounding: Grounding[] = [];
  const lines: string[] = [];

  for (const item of chosen) {
    let citation = citationByPassage.get(item.passage.id);
    if (!citation) {
      citation = citations.length + 1;
      citationByPassage.set(item.passage.id, citation);
      citations.push({
        n: citation,
        passageId: item.passage.id,
        assetId: item.passage.assetId,
        assetTitle: item.passage.assetTitle,
        heading: item.passage.heading,
        page: item.passage.page,
        excerpt: item.sentence,
      });
    }
    const sentence = rewriteSafe(item.sentence, input.audience);
    grounding.push({
      sentence,
      citation,
      passageId: item.passage.id,
      sourceExcerpt: item.sentence,
    });
    lines.push(`${sentence} [${citation}]`);
  }

  const sourceText = input.passages.map((passage) => passage.body).join("\n");
  const glossary = glossaryFor(sourceText);
  const tags = [...new Set(input.tags.map(hashtag).filter((tag): tag is string => Boolean(tag)))].slice(0, 4);

  let title = input.assetTitle;
  if (input.kind === "web" && input.audience === "public") title = `From the ice log: ${input.assetTitle}`;
  if (input.kind === "web" && input.audience === "student") title = `Study note — ${input.assetTitle}`;
  if (input.kind === "social") title = input.assetTitle.length > 86 ? `${input.assetTitle.slice(0, 83)}…` : input.assetTitle;

  const body =
    input.kind === "social"
      ? `${lines.join("\n\n")}${tags.length ? `\n\n${tags.join(" ")}` : ""}`
      : `${INTRO[input.audience]}\n\n${lines.join("\n\n")}`;

  const result: GenerationResult = {
    title,
    body,
    citations,
    grounding,
    glossary,
    adapter: "citation-locked",
    kind: input.kind,
    audience: input.audience,
    charCount: body.length,
  };
  assertCitationLock(result, input.passages);
  return result;
}

export function assertCitationLock(result: GenerationResult, passages: { id: string; body: string }[]) {
  if (!result.grounding.length) throw new Error("Generation produced no grounded sentences.");
  const byId = new Map(passages.map((passage) => [passage.id, passage.body]));
  for (const item of result.grounding) {
    const body = byId.get(item.passageId);
    if (!body || !body.includes(item.sourceExcerpt)) {
      throw new Error("A generated sentence is not locked to a selected passage.");
    }
    const sourceDigits = new Set(digitsOf(item.sourceExcerpt));
    if (digitsOf(item.sentence).some((digit) => !sourceDigits.has(digit))) {
      throw new Error("A generated sentence introduced a numeral that is not in the source span.");
    }
    if (!result.citations.some((citation) => citation.n === item.citation && citation.passageId === item.passageId)) {
      throw new Error("A grounding row points at a missing citation.");
    }
  }
  const markers = result.body.match(/\[(\d+)\]/g) ?? [];
  for (const marker of markers) {
    const n = Number(marker.slice(1, -1));
    if (!result.citations.some((citation) => citation.n === n)) {
      throw new Error(`Citation marker ${marker} is not in the source list.`);
    }
  }
}

export const generationAdapter = {
  id: "citation-locked",
  label: "Citation-locked local adapter",
  generate: generateCitationLocked,
};
