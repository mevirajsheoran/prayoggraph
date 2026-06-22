"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "danger" | "ghost" | "purple";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS = {
  primary:
    "bg-neon-cyan/10 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-neon-cyan",
  danger:
    "bg-neon-red/10 border-neon-red text-neon-red hover:bg-neon-red/20 hover:shadow-neon-red",
  purple:
    "bg-neon-purple/10 border-neon-purple text-neon-purple hover:bg-neon-purple/20 hover:shadow-neon-purple",
  ghost:
    "bg-bg-card border-border-default text-text-primary hover:border-neon-cyan hover:text-neon-cyan",
} as const;

const SIZES = {
  sm: "px-3 py-1 text-[10px] gap-1.5",
  md: "px-4 py-2 text-xs gap-2",
  lg: "px-6 py-3 text-sm gap-2.5",
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center
          rounded border font-mono font-bold uppercase tracking-widest
          transition-all duration-150 no-select
          disabled:cursor-not-allowed disabled:opacity-40
          ${VARIANTS[variant]}
          ${SIZES[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
        )}
        {!loading && icon && (
          <span className="flex items-center">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";