'use client';

import { useEffect, useRef } from 'react';

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** 0..1 blend between purple and teal */
  hue: number;
  phase: number;
}

interface Pulse {
  a: number;
  b: number;
  t: number;
  speed: number;
}

/** activation fired from a background click toward a nearby neuron */
interface Burst {
  x0: number;
  y0: number;
  ni: number;
  t: number;
  speed: number;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  a: number;
}

const PURPLE = [124, 58, 237];
const TEAL = [6, 182, 212];
const LINK_DIST = 150;
const PROBE_LINK = 220;

function mix(t: number): number[] {
  return PURPLE.map((p, i) => Math.round(p + (TEAL[i] - p) * t));
}

function rgba(c: number[], a: number): string {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

/**
 * Lightweight animated neural-network graph: drifting glowing neurons,
 * distance-based synapse edges, and signal pulses traveling between them.
 * The cursor gently attracts nearby neurons and brightens nearby edges.
 */
export default function NeuralCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let neurons: Neuron[] = [];
    let pulses: Pulse[] = [];
    let bursts: Burst[] = [];
    let rings: Ring[] = [];
    let raf = 0;

    const seed = () => {
      const count = Math.min(60, Math.max(22, Math.floor((w * h) / 26000)));
      neurons = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.6 + Math.random() * 1.8,
        hue: Math.random(),
        phase: Math.random() * Math.PI * 2,
      }));
      pulses = [];
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // synapse edges
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const a = neurons[i];
          const b = neurons[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > LINK_DIST) continue;

          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const mouseBoost =
            Math.max(0, 1 - Math.hypot(mx - mouse.x, my - mouse.y) / 220) * 0.3;
          const alpha = (1 - d / LINK_DIST) * 0.3 + mouseBoost;

          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, rgba(mix(a.hue), alpha));
          grad.addColorStop(1, rgba(mix(b.hue), alpha));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // traveling signal pulses
      if (!reducedMotion && pulses.length < 6 && Math.random() < 0.04) {
        const i = Math.floor(Math.random() * neurons.length);
        let best = -1;
        let bestD = LINK_DIST;
        for (let j = 0; j < neurons.length; j++) {
          if (j === i) continue;
          const d = Math.hypot(
            neurons[i].x - neurons[j].x,
            neurons[i].y - neurons[j].y
          );
          if (d < bestD) {
            bestD = d;
            best = j;
          }
        }
        if (best >= 0) {
          pulses.push({ a: i, b: best, t: 0, speed: 0.008 + Math.random() * 0.01 });
        }
      }
      pulses = pulses.filter((p) => p.t <= 1);
      for (const p of pulses) {
        const a = neurons[p.a];
        const b = neurons[p.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const c = mix(a.hue + (b.hue - a.hue) * p.t);
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.15);
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.9);
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        p.t += p.speed;
      }

      // the cursor is a live probe neuron: bright links to everything in reach
      const probing =
        !reducedMotion && mouse.x >= 0 && mouse.x <= w && mouse.y >= 0 && mouse.y <= h;
      if (probing) {
        for (const n of neurons) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d > PROBE_LINK) continue;
          const alpha = (1 - d / PROBE_LINK) * 0.55;
          const grad = ctx.createLinearGradient(mouse.x, mouse.y, n.x, n.y);
          grad.addColorStop(0, `rgba(103,232,249,${alpha})`);
          grad.addColorStop(1, rgba(mix(n.hue), alpha * 0.8));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
        // probe halo + core
        ctx.beginPath();
        ctx.fillStyle = 'rgba(6,182,212,0.08)';
        ctx.arc(mouse.x, mouse.y, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(103,232,249,0.28)';
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(224,242,254,0.9)';
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // click bursts: activations shooting from the click point to neighbors
      bursts = bursts.filter((b) => b.t <= 1);
      for (const b of bursts) {
        const n = neurons[b.ni];
        if (!n) continue;
        const x = b.x0 + (n.x - b.x0) * b.t;
        const y = b.y0 + (n.y - b.y0) * b.t;
        const c = mix(n.hue);
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.18);
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.95);
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        b.t += b.speed;
      }

      // expanding activation rings from clicks
      rings = rings.filter((r) => r.a > 0.02);
      for (const r of rings) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(103,232,249,${r.a})`;
        ctx.lineWidth = 1.5;
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        r.r += 3.4;
        r.a *= 0.94;
      }

      // neurons: soft outer glow + pulsing core
      for (const n of neurons) {
        const pulse = reducedMotion
          ? 1
          : 1 + 0.25 * Math.sin(time * 0.0015 + n.phase);
        const r = n.r * pulse;
        const c = mix(n.hue);
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.08);
        ctx.arc(n.x, n.y, r * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.2);
        ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = rgba(c, 0.95);
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (time: number) => {
      for (const n of neurons) {
        // gentle attraction toward the cursor
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 200 && d > 1) {
          n.vx += (dx / d) * 0.014;
          n.vy += (dy / d) * 0.014;
        }
        n.vx = Math.max(-0.4, Math.min(0.4, n.vx));
        n.vy = Math.max(-0.4, Math.min(0.4, n.vy));
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }
      draw(time);
      raf = requestAnimationFrame(step);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // clicking the background fires an activation burst into the network
    const onClick = (e: MouseEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) return;
      rings.push({ x, y, r: 6, a: 0.6 });
      neurons.forEach((n, ni) => {
        if (Math.hypot(n.x - x, n.y - y) < 280) {
          bursts.push({ x0: x, y0: y, ni, t: 0, speed: 0.02 + Math.random() * 0.02 });
        }
      });
    };

    resize();
    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(step);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseout', onMouseLeave);
      canvas.parentElement?.addEventListener('click', onClick);
    }
    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw(0);
    });
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    // pause the animation loop while the hero is offscreen
    const visibility = new IntersectionObserver(([entry]) => {
      if (reducedMotion) return;
      if (entry.isIntersecting && raf === 0) {
        raf = requestAnimationFrame(step);
      } else if (!entry.isIntersecting && raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      canvas.parentElement?.removeEventListener('click', onClick);
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
