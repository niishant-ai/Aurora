import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function istParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? "0");
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
  };
}

export function formatWhen(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}

export function formatIstClock(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function istDate(day: number, hour = 10) {
  const { year, month } = istParts();
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const clamped = Math.min(Math.max(day, 1), last);
  return new Date(Date.UTC(year, month - 1, clamped, hour - 5, 30, 0));
}

export function monthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, monthIndex, 1, 6, 0, 0)));
}

export function sameIstDay(iso: string, year: number, monthIndex: number, day: number) {
  const parts = istParts(new Date(iso));
  return parts.year === year && parts.month === monthIndex + 1 && parts.day === day;
}

export function provenanceLabel(provenance: string) {
  switch (provenance) {
    case "mock-report":
      return "Mock field report";
    case "illustrative":
      return "Illustrative media";
    case "mock-dataset":
      return "Mock dataset";
    case "intake":
      return "Intake record";
    default:
      return provenance;
  }
}

export function typeLabel(type: string) {
  switch (type) {
    case "report":
      return "Report";
    case "image":
      return "Image";
    case "video":
      return "Video";
    case "dataset":
      return "Dataset";
    default:
      return type;
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case "draft":
      return "Draft";
    case "review":
      return "In review";
    case "approved":
      return "Approved";
    case "published":
      return "Published";
    default:
      return status;
  }
}

export function audienceLabel(audience: string) {
  switch (audience) {
    case "public":
      return "Public";
    case "student":
      return "Student";
    case "researcher":
      return "Researcher";
    default:
      return audience;
  }
}

export function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function safeSlug(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80);
}

export function mergeRanges(ranges: { start: number; end: number }[]) {
  const sorted = [...ranges].filter((range) => range.end > range.start).sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (!last || range.start > last.end) merged.push({ ...range });
    else last.end = Math.max(last.end, range.end);
  }
  return merged;
}
