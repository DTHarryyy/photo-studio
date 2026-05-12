import type { ReactNode } from "react";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex w-full overflow-hidden"
      style={{ height: "100dvh", overscrollBehavior: "none", touchAction: "none" }}
    >
      {children}
    </div>
  );
}
