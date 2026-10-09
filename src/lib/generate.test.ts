import { describe, expect, it } from "vitest";
import { assertCitationLock, generateCitationLocked } from "./generate";

const passages = [
  {
    id: "rpt-demo-p1",
    heading: "Winter mixing",
    body: "IndARC-9 recorded a winter mixed-layer depth of 86 m in Kongsfjorden, 18 m deeper than the 2016–2020 mean. Atlantic Water warmed the 50–120 m layer by 0.4 °C relative to the previous September.",
    page: 4,
    assetId: "rpt-demo",
    assetTitle: "IndARC-9 winter mixed layer",
  },
  {
    id: "rpt-demo-p2",
    heading: "Mooring",
    body: "The mooring was recovered on 14 July and redeployed the next day with the same 12-instrument string.",
    page: 6,
    assetId: "rpt-demo",
    assetTitle: "IndARC-9 winter mixed layer",
  },
];

describe("citation lock", () => {
  it("refuses an empty selection", () => {
    expect(() =>
      generateCitationLocked({
        passages: [],
        audience: "public",
        kind: "web",
        assetTitle: "Empty",
        tags: [],
      }),
    ).toThrow(/passage/i);
  });

  it("keeps every sentence locked to a verbatim span", () => {
    const result = generateCitationLocked({
      passages,
      audience: "public",
      kind: "web",
      assetTitle: "IndARC-9 winter mixed layer",
      tags: ["IndARC", "Kongsfjorden"],
    });
    assertCitationLock(result, passages);
    expect(result.adapter).toBe("citation-locked");
    expect(result.body).toContain("[1]");
    expect(result.glossary.some((entry) => entry.term === "Mixed layer")).toBe(true);
    expect(result.body).not.toMatch(/\b99\b/);
  });

  it("does not add hashtags that were not source tags", () => {
    const result = generateCitationLocked({
      passages: [passages[0]],
      audience: "student",
      kind: "social",
      assetTitle: "IndARC-9 winter mixed layer",
      tags: ["IndARC"],
    });
    expect(result.body).toContain("#IndARC");
    expect(result.body).not.toContain("#Penguin");
  });
});
