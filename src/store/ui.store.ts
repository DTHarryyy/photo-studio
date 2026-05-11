import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
}

interface UiState {
  toasts: Toast[];
  activeModal: string | null;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()(
  subscribeWithSelector((set) => ({
    toasts: [],
    activeModal: null,
    addToast: (toast) =>
      set((s) => ({
        toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
      })),
    removeToast: (id) =>
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),
  }))
);
