"use client";
import { clsx } from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors active:scale-95",
        "disabled:opacity-40 disabled:pointer-events-none",
        {
          "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",
          "bg-zinc-700 text-white hover:bg-zinc-600": variant === "secondary",
          "bg-transparent text-zinc-300 hover:bg-zinc-800": variant === "ghost",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
        },
        {
          "h-9 px-3 text-sm": size === "sm",
          "h-12 px-5 text-base": size === "md",
          "h-14 px-6 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
