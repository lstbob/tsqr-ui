"use client";

import { useState } from "react";

type Line = { x1: number; y1: number; x2: number; y2: number };

const WIDTH = 1920;
const HEIGHT = 1080;

const INITIAL_LINES: Line[] = [
  { x1: 200, y1: 200, x2: 600, y2: 400 },
  { x1: 600, y1: 400, x2: 1000, y2: 300 },
  { x1: 1000, y1: 300, x2: 1400, y2: 500 },
  { x1: 1400, y1: 500, x2: 1700, y2: 200 },
  { x1: 600, y1: 400, x2: 800, y2: 700 },
  { x1: 800, y1: 700, x2: 1200, y2: 800 },
  { x1: 1200, y1: 800, x2: 1400, y2: 500 },
  { x1: 200, y1: 200, x2: 800, y2: 700 },
];

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomPolygon(): Line[] {
  const cx = between(WIDTH * 0.3, WIDTH * 0.7);
  const cy = between(HEIGHT * 0.3, HEIGHT * 0.7);
  const count = Math.floor(between(5, 9));
  const step = (Math.PI * 2) / count;
  const start = between(0, Math.PI * 2);

  const points = Array.from({ length: count }, (_, i) => {
    const angle = start + i * step + between(-step / 3, step / 3);
    const radius = between(250, 650);
    return {
      x: Math.min(WIDTH - 40, Math.max(40, cx + Math.cos(angle) * radius * 1.4)),
      y: Math.min(HEIGHT - 40, Math.max(40, cy + Math.sin(angle) * radius * 0.8)),
    };
  });

  const lines = points.map((p, i) => {
    const q = points[(i + 1) % count];
    return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
  });

  const chords = Math.floor(between(1, 4));
  for (let c = 0; c < chords; c++) {
    const a = Math.floor(between(0, count));
    const b = (a + 2 + Math.floor(between(0, count - 3))) % count;
    lines.push({ x1: points[a].x, y1: points[a].y, x2: points[b].x, y2: points[b].y });
  }

  return lines;
}

export default function ConnectionLines() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);

  return (
    <div className="connection-lines">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
        {lines.map((line, i) => (
          <line
            key={i}
            {...line}
            onAnimationIteration={i === 0 ? () => setLines(randomPolygon()) : undefined}
          />
        ))}
      </svg>
    </div>
  );
}
