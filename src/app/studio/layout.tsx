import type { ReactNode } from "react";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="flex h-full w-full overflow-hidden">{children}</div>;
}
