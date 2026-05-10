import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface TemplateState {
  activeTemplateId: string | null;
  setActiveTemplate: (id: string | null) => void;
}

export const useTemplateStore = create<TemplateState>()(
  subscribeWithSelector((set) => ({
    activeTemplateId: null,
    setActiveTemplate: (id) => set({ activeTemplateId: id }),
  }))
);
