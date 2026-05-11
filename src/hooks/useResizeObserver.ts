"use client";

import { useEffect, useRef } from "react";

export function useResizeObserver(
  callback: (entry: ResizeObserverEntry) => void
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => callback(entry));
    observer.observe(el);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
}
