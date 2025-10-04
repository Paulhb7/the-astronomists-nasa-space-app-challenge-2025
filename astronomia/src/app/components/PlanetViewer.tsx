"use client";
import React from "react";

export interface Exoplanet {
  name: string;
  radiusEarth: number; // Planetary radius in Earth radii
  massEarth?: number;  // Planetary mass in Earth masses
  equilibriumTempK?: number;
  orbitalPeriodDays?: number;
  semiMajorAxisAU?: number;
  hostStar: string;
  discoveryMethod?: string;
  description?: string;
  palette?: { base: string; glow: string; band: string };
}

export default function PlanetViewer({ planet, size = 520 }: { planet: Exoplanet; size?: number }) {
  const palette = planet.palette || { base: "#1e2b5a", glow: "#7aa2ff", band: "#2f3f7f" };
  const radius = size * 0.4;

  return (
    <div style={{ 
      position: "relative", 
      width: size, 
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* Simple planet representation */}
      <div
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${palette.base}, ${darken(palette.base, 0.3)})`,
          boxShadow: `0 0 ${radius * 0.3}px ${palette.glow}40`,
          position: "relative"
        }}
      >
        {/* Simple atmospheric glow */}
        <div
          style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.glow}20, transparent 70%)`,
            filter: "blur(4px)",
            opacity: 0.6
          }}
        />
      </div>
    </div>
  );
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const l = (v: number) => Math.round(v + (255 - v) * amount);
  return `rgb(${l(r)}, ${l(g)}, ${l(b)})`;
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const d = (v: number) => Math.round(v * (1 - amount));
  return `rgb(${d(r)}, ${d(g)}, ${d(b)})`;
}

function hexToRgb(hex: string) {
  const c = hex.replace('#', '');
  const bigint = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}


