"use client";

import { useStudioStore } from "../store/studio.store";

export function useStudioSession() {
  const mode = useStudioStore((s) => s.mode);
  const setMode = useStudioStore((s) => s.setMode);
  const isSidebarOpen = useStudioStore((s) => s.isSidebarOpen);
  const toggleSidebar = useStudioStore((s) => s.toggleSidebar);

  return { mode, setMode, isSidebarOpen, toggleSidebar };
}
