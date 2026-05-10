import type { ReactNode } from "react";

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900 border-b border-zinc-800">
      {children}
    </div>
  );
}
