"use client";

import { useStudioSession } from "../hooks/useStudioSession";

export function StudioOrchestrator() {
  const { mode } = useStudioSession();

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white">
      {/* Toolbar, Sidebar, and active feature panel will be composed here */}
      <main className="flex flex-1 items-center justify-center text-zinc-500 text-sm">
        Studio — active mode: <span className="ml-1 text-white font-medium">{mode}</span>
      </main>
    </div>
  );
}
