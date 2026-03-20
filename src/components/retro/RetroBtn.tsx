"use client";

import { type ButtonHTMLAttributes } from "react";

interface RetroBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "gold" | "green" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, string> = {
  default:
    "bg-gradient-to-b from-[#d8d8d8] to-[#b0b0b0] text-[#1a1a2e] border-[#c0c0c0] hover:from-[#e0e0e0] hover:to-[#c0c0c0]",
  gold: "bg-gradient-to-b from-[#E8C840] to-[#C4A030] text-[#1a1a2e] border-[#D4A843] hover:from-[#F0D050] hover:to-[#D4B040]",
  green:
    "bg-gradient-to-b from-[#40B050] to-[#308040] text-white border-[#40B050] hover:from-[#50C060] hover:to-[#40A050]",
  danger:
    "bg-gradient-to-b from-[#D04040] to-[#A03030] text-white border-[#D04040] hover:from-[#E05050] hover:to-[#C04040]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

/**
 * Retro beveled 3D button in the PC Fútbol style.
 */
export default function RetroBtn({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: RetroBtnProps) {
  return (
    <button
      className={`font-[family-name:var(--font-oswald)] uppercase font-bold border-2 border-outset cursor-pointer active:border-inset transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{ borderStyle: "outset" }}
      {...props}
    >
      {children}
    </button>
  );
}
