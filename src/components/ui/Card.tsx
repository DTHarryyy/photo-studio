import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "bordered";
}

const variants: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-white/5",
  glass: "border border-white/10 bg-white/8 backdrop-blur-md",
  bordered: "border border-white/10 bg-transparent",
};

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div className={cn("rounded-2xl", variants[variant], className)}>
      {children}
    </div>
  );
}
