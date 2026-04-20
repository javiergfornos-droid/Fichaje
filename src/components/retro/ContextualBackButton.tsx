"use client";

import Link from "next/link";
import { useState } from "react";

interface ContextualBackButtonProps {
  href: string;
  label: string;
}

/**
 * Compact PC-Fútbol style "back" button, sized to sit inside a panel header
 * (28px tall, 2px bevel, navy gradient, gold pixel arrow).
 * Press flips the outset bevel to inset for ~100ms.
 */
export default function ContextualBackButton({
  href,
  label,
}: ContextualBackButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 28,
        padding: "4px 10px",
        borderWidth: 2,
        borderStyle: pressed ? "inset" : "outset",
        borderColor: "#4A5A8E",
        background: "linear-gradient(180deg, #1A2A5E, #0F1A3E)",
        color: "#F5F0E8",
        fontFamily: "var(--font-oswald), sans-serif",
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 1,
        textTransform: "uppercase",
        textDecoration: "none",
        transform: pressed
          ? "translate(0, 1px)"
          : hovered
            ? "translateX(-1px)"
            : "translate(0, 0)",
        filter: hovered ? "brightness(1.2)" : "none",
        boxShadow: pressed
          ? "1px 1px 0 rgba(0,0,0,0.35)"
          : "2px 2px 0 rgba(0,0,0,0.4)",
        transition: "filter 0.1s, transform 0.1s",
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 16 16"
        shapeRendering="crispEdges"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <g fill="#D4A843">
          <rect x="6" y="6" width="8" height="4" />
          <rect x="5" y="4" width="2" height="8" />
          <rect x="4" y="5" width="2" height="6" />
          <rect x="3" y="6" width="2" height="4" />
          <rect x="2" y="7" width="2" height="2" />
        </g>
      </svg>
      {label}
    </Link>
  );
}
