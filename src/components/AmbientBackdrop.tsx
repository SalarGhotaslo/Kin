"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; r: number; baseAlpha: number; phase: number; speed: number };

/**
 * Decorative only: a handful of soft drifting motes behind the phone frame,
 * colored from the live --accent token so it always matches the active theme.
 * Frozen to a single static frame under prefers-reduced-motion.
 */
export default function AmbientBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particlesRef: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const seed = (count: number) => {
      particlesRef.length = 0;
      for (let i = 0; i < count; i++) {
        particlesRef.push({
          x: Math.random(),
          y: Math.random(),
          r: 0.6 + Math.random() * 1.8,
          baseAlpha: 0.12 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.25,
        });
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const targetCount = Math.round((width * height) / 26000);
      seed(Math.max(24, Math.min(70, targetCount)));
    };

    const getAccentColor = (): [number, number, number] => {
      const style = getComputedStyle(document.documentElement);
      const raw = style.getPropertyValue("--accent").trim() || "#2F6459";
      const hex = raw.replace("#", "");
      const n = parseInt(hex, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    let rafId = 0;
    let start = performance.now();

    const draw = (t: number) => {
      const [r, g, b] = getAccentColor();
      ctx.clearRect(0, 0, width, height);
      const elapsed = reduceMotion ? 0 : (t - start) / 1000;
      for (const p of particlesRef) {
        const twinkle = reduceMotion ? 0 : Math.sin(elapsed * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = p.baseAlpha * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    resize();
    start = performance.now();
    draw(start);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduceMotion) draw(performance.now());
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-backdrop" aria-hidden="true" />;
}
