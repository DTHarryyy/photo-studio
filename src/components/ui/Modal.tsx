"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) el.showModal();
    else el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="rounded-lg bg-zinc-900 text-white p-0 backdrop:bg-black/60 max-w-lg w-full"
    >
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
        {title && <h2 className="text-sm font-semibold">{title}</h2>}
        <button onClick={onClose} className="ml-auto text-zinc-400 hover:text-white text-lg leading-none">
          ×
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}
