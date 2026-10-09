import type { Role } from "@/lib/types";

export const ROLE_LABEL: Record<Role, string> = {
  public: "Public reader",
  researcher: "Researcher",
  editor: "Editor",
  admin: "Admin",
};

export const ROLE_NOTE: Record<Role, string> = {
  public: "Reading room. Search, watch, and follow citations. Generation stays with the desk.",
  researcher: "Research desk. Search the archive and generate citation-locked notes.",
  editor: "Editorial desk. Ingest, draft, review, and place items on the calendar.",
  admin: "Control room. Approve, publish, and reschedule the dissemination queue.",
};

export function isRole(value: string | null | undefined): value is Role {
  return value === "public" || value === "researcher" || value === "editor" || value === "admin";
}

export function roleFromRequest(request: Request): Role {
  const header = request.headers.get("x-aurora-role");
  return isRole(header) ? header : "public";
}

export function actorName(role: Role) {
  switch (role) {
    case "admin":
      return "Desk admin";
    case "editor":
      return "Imran Desai";
    case "researcher":
      return "Dr. Ananya Rao";
    default:
      return "Public reader";
  }
}

export function canGenerate(role: Role) {
  return role !== "public";
}

export function canIngest(role: Role) {
  return role === "editor" || role === "admin";
}

export function canReview(role: Role) {
  return role === "editor" || role === "admin";
}

export function canApprove(role: Role) {
  return role === "admin";
}

export function canSchedule(role: Role) {
  return role === "editor" || role === "admin";
}

export function canSubmit(role: Role) {
  return role === "researcher" || role === "editor" || role === "admin";
}
