import { describe, expect, it } from "vitest";
import { cosine, embed, EMBEDDING_DIM, keywordScore } from "./embeddings";

describe("embeddings", () => {
  it("returns a unit vector of fixed width", () => {
    const vector = embed("Black carbon lowered the albedo of spring snow at Himadri.");
    expect(vector).toHaveLength(EMBEDDING_DIM);
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeGreaterThan(0.98);
    expect(norm).toBeLessThan(1.02);
  });

  it("ranks a related sentence above an unrelated one", () => {
    const query = embed("black carbon albedo snow Himadri");
    const related = embed("Black carbon in the April snow lowered albedo beside Himadri.");
    const unrelated = embed("The neutron monitor at Maitri counted a solar proton event.");
    expect(cosine(query, related)).toBeGreaterThan(cosine(query, unrelated));
  });

  it("scores keyword overlap without inventing a hit", () => {
    expect(keywordScore("IndARC mixed layer in Kongsfjorden", ["indarc", "mixed"])).toBe(1);
    expect(keywordScore("Neutron monitor counts", ["indarc"])).toBe(0);
  });
});
