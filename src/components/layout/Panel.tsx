import type { ReactNode } from "react";

interface Props {
  title?: string;
  collapsible?: boolean;
  children: ReactNode;
}

export function Panel({ title, children }: Props) {
  return (
    <section className="flex flex-col border-b border-zinc-800">
      {title && (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {title}
        </div>
      )}
      <div className="flex flex-col">{children}</div>
    </section>
  );
}
