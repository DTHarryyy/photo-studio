import type { ReactNode } from "react";

// Thin layout shell — marketing pages handle their own backgrounds and spacing.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
