import * as THREE from 'three';

const PARTICLE_COUNT = 3000;

function generateTrophyPoints(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const t = Math.random();
    
    if (t < 0.35) {
      // Cup bowl (top half) - half sphere
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
    } else if (t < 0.55) {
      // Stem
      const radius = Math.random() * (1 - t);
      const angle = Math.random() * Math.PI * 2;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = t * 2 - 1; // vertical taper
      positions[i3 + 2] = Math.sin(angle) * radius;
    } else if (t < 0.7) {
      // Base
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;
      const r = 1 + Math.random() * 0.05;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.cos(phi);
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    } else if (t < 0.85) {
      // Handles
      const side = Math.random() > 0.5 ? 1 : -1;
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const r = 0.35;
      positions[i3] = side * (1.2 + Math.cos(angle) * r);
      positions[i3 + 1] = 0.6 + Math.sin(angle) * r;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    } else {
      // Rim highlights
      const angle = Math.random() * Math.PI * 2;
      const r = 1.15 + Math.random() * 0.1;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = 1.0 + (Math.random() - 0.5) * 0.05;
      positions[i3 + 2] = Math.sin(angle) * r * 0.6;
    }
  }
  return positions;
}

function generateChartPoints(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const barHeights = [0.4, 0.7, 0.5, 1.0, 0.85];
  const barWidth = 0.3;
  const gap = 0.15;
  const totalWidth = barHeights.length * (barWidth + gap) - gap;
  const startX = -totalWidth / 2;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const t = Math.random();
    
    if (t < 0.75) {
      // Bars
      const barIdx = Math.floor(Math.random() * barHeights.length);
      const h = barHeights[barIdx] * 1.8;
      const x = startX + barIdx * (barWidth + gap);
      positions[i3] = x + Math.random() * barWidth;
      positions[i3 + 1] = Math.random() * h - 0.9;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.15;
    } else if (t < 0.9) {
      // Trend line arrow going up
      const prog = Math.random();
      positions[i3] = startX + prog * totalWidth;
      positions[i3 + 1] = -0.5 + prog * 1.5 + (Math.random() - 0.5) * 0.08;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    } else {
      // Axis lines
      if (Math.random() > 0.5) {
        positions[i3] = startX - 0.1 + (Math.random() - 0.5) * 0.03;
        positions[i3 + 1] = Math.random() * 2 - 1;
        positions[i3 + 2] = 0;
      } else {
        positions[i3] = startX + Math.random() * (totalWidth + 0.2) - 0.1;
        positions[i3 + 1] = -0.9 + (Math.random() - 0.5) * 0.03;
        positions[i3 + 2] = 0;
      }
    }
  }
  return positions;
}

function generatePenPoints(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const t = Math.random();
    
    if (t < 0.6) {
      // Pen body (rotated 45deg)
      const len = Math.random() * 2.0 - 0.3;
      const angle = Math.random() * Math.PI * 2;
      const r = 0.12 + Math.random() * 0.03;
      const bodyX = Math.cos(angle) * r;
      const bodyZ = Math.sin(angle) * r;
      positions[i3] = (len - bodyX) * 0.707;
      positions[i3 + 1] = (len + bodyX) * 0.707;
      positions[i3 + 2] = bodyZ;
    } else if (t < 0.8) {
      // Pen tip
      const len = -0.3 - Math.random() * 0.4;
      const progress = (len + 0.7) / 0.4;
      const r = Math.max(0.01, 0.12 * progress) * Math.random();
      const angle = Math.random() * Math.PI * 2;
      const tipX = Math.cos(angle) * r;
      const tipZ = Math.sin(angle) * r;
      positions[i3] = (len - tipX) * 0.707;
      positions[i3 + 1] = (len + tipX) * 0.707;
      positions[i3 + 2] = tipZ;
    } else {
      // Ink strokes at the bottom
      const cx = -0.8 + Math.random() * 0.3;
      const cy = -0.8 + Math.random() * 0.1;
      const swirl = Math.random() * Math.PI * 2;
      const sr = Math.random() * 0.4;
      positions[i3] = cx + Math.cos(swirl) * sr;
      positions[i3 + 1] = cy + Math.sin(swirl) * sr * 0.3;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
  }
  return positions;
}

function generateChatPoints(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const t = Math.random();
    
    if (t < 0.7) {
      // Main bubble (rounded rectangle)
      const x = (Math.random() - 0.5) * 2.2;
      const y = (Math.random() - 0.5) * 1.4 + 0.2;
      const rx = 1.1, ry = 0.7;
      // Keep points within rounded rect boundary
      const dx = Math.abs(x) - (rx - 0.3);
      const dy = Math.abs(y - 0.2) - (ry - 0.3);
      if (dx > 0 && dy > 0) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.3) continue;
      }
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.15;
    } else if (t < 0.82) {
      // Tail triangle
      positions[i3] = -0.7 + Math.random() * 0.4;
      positions[i3 + 1] = -0.5 - Math.random() * 0.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    } else {
      // Dots inside (ellipsis)
      const dotIdx = Math.floor(Math.random() * 3);
      const cx = -0.4 + dotIdx * 0.4;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.1;
      positions[i3] = cx + Math.cos(angle) * r;
      positions[i3 + 1] = 0.2 + Math.sin(angle) * r;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
  }
  return positions;
}

function generateChessPoints(): Float32Array {
const positions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const t = Math.random();

    if (t < 0.35) {
      // Cup bowl
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 0.05;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 + 0.2;
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    } else if (t < 0.55) {
      // Stem
      const angle = Math.random() * Math.PI * 2;
      const r = 0.15 + Math.random() * 0.03;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = -Math.random() * 0.8;
      positions[i3 + 2] = Math.sin(angle) * r;
    } else if (t < 0.7) {
      // Base
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.6;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = -0.8 - Math.random() * 0.05;
      positions[i3 + 2] = Math.sin(angle) * r;
    } else {
      // Handles and rim highlights
      const side = Math.random() > 0.5 ? 1 : -1;
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      const r = 0.35 + Math.random() * 0.05;
      positions[i3] = side * (1.2 + Math.cos(angle) * r);
      positions[i3 + 1] = 0.6 + Math.sin(angle) * r;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
  }
  return positions;
}

export const SHAPES = {
  trophy: generateTrophyPoints,
  chart: generateChartPoints,
  pen: generatePenPoints,
  chat: generateChatPoints,
  chess: generateChessPoints,
};

export const SHAPE_KEYS = ['trophy', 'chart', 'pen', 'chat', 'chess'] as const;
export type ShapeKey = typeof SHAPE_KEYS[number];
export { PARTICLE_COUNT };
