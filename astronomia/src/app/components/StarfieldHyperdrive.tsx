"use client";
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export default function StarfieldHyperdrive({
  density = 1200,
  speed = 0.12,
  warpBoost = 2.4,
  color = "#bcdcff",
}: {
  density?: number;
  speed?: number;
  warpBoost?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const warpRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const initStars = () => {
      const count = Math.min(density, Math.floor((canvas.width * canvas.height) / 1500));
      starsRef.current = Array.from({ length: count }, () => ({
        x: (Math.random() * 2 - 1) * canvas.width,
        y: (Math.random() * 2 - 1) * canvas.height,
        z: Math.random() * canvas.width,
        pz: 0,
      }));
    };

    initStars();

    // Subtle pulsing warp factor to feel like hyperspace
    const updateWarp = () => {
      const t = performance.now() * 0.0015;
      warpRef.current = 1 + Math.sin(t) * 0.15 + warpBoost;
    };

    const draw = () => {
      if (!ctx) return;
      updateWarp();

      ctx.fillStyle = "#030711";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula gradient
      const g = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.6
      );
      g.addColorStop(0, "rgba(20,40,90,0.35)");
      g.addColorStop(1, "rgba(3,7,17,0.0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseSpeed = speed * canvas.width * 0.0015;

      ctx.strokeStyle = color;
      ctx.lineCap = "round";

      for (let i = 0; i < starsRef.current.length; i++) {
        const s = starsRef.current[i];
        const velocity = (baseSpeed + 0.2) * warpRef.current;
        s.z -= velocity * 10;
        if (s.z < 1) {
          s.x = (Math.random() * 2 - 1) * canvas.width;
          s.y = (Math.random() * 2 - 1) * canvas.height;
          s.z = canvas.width;
          s.pz = s.z;
        }

        const sx = (s.x / s.z) * cx + cx;
        const sy = (s.y / s.z) * cy + cy;
        const px = (s.x / (s.pz || s.z)) * cx + cx;
        const py = (s.y / (s.pz || s.z)) * cy + cy;
        s.pz = s.z;

        const distCenter = Math.hypot(sx - cx, sy - cy);
        const thickness = Math.max(0.5, 2.2 - distCenter / (Math.max(cx, cy)));
        ctx.lineWidth = thickness;
        ctx.globalAlpha = Math.min(1, 0.2 + (1 - s.z / canvas.width) * 1.2);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      // Subtle star twinkles overlay
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#d8e7ff";
      for (let i = 0; i < 60; i++) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        const rs = Math.random() * 1.6 + 0.2;
        ctx.beginPath();
        ctx.arc(rx, ry, rs, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density, speed, warpBoost, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    />
  );
}


