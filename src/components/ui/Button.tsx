"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white " +
    "shadow-[0_8px_32px_-4px_rgba(139,92,246,0.45),0_4px_16px_-4px_rgba(236,72,153,0.25)] " +
    "hover:-translate-y-px hover:brightness-110 hover:shadow-[0_10px_40px_-4px_rgba(139,92,246,0.65)] " +
    "active:translate-y-0 active:brightness-100",
  secondary:
    "border border-white/15 bg-white/[0.07] text-white backdrop-blur-md " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] " +
    "hover:-translate-y-px hover:bg-white/[0.11] hover:border-white/25 " +
    "active:translate-y-0",
  ghost: "text-zinc-300 hover:text-white hover:bg-white/8",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
    />
  )
);

Button.displayName = "Button";

