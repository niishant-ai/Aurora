import type { Role } from "@/lib/types";

export async function api<T>(path: string, role: Role, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("x-aurora-role", role);
  if (typeof init?.body === "string" && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const response = await fetch(path, { ...init, headers, cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
  return data;
}
