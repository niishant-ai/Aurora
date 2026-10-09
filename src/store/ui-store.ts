"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, ThemeMode } from "@/lib/types";

type Toast = { id: string; message: string };

type UiState = {
  role: Role;
  theme: ThemeMode;
  hydrated: boolean;
  toasts: Toast[];
  setRole: (role: Role) => void;
  setTheme: (theme: ThemeMode) => void;
  setHydrated: (value: boolean) => void;
  pushToast: (message: string) => void;
  dismissToast: (id: string) => void;
};

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      role: "editor",
      theme: "system",
      hydrated: false,
      toasts: [],
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setHydrated: (hydrated) => set({ hydrated }),
      pushToast: (message) =>
        set((state) => ({
          toasts: [...state.toasts, { id: crypto.randomUUID(), message }].slice(-3),
        })),
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: "aurora-ui",
      partialize: (state) => ({ role: state.role, theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
