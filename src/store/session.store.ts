import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface SessionState {
  sessionId: string | null;
  initSession: () => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  subscribeWithSelector((set) => ({
    sessionId: null,
    initSession: () => set({ sessionId: crypto.randomUUID() }),
    clearSession: () => set({ sessionId: null }),
  }))
);
