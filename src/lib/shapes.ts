import * as THREE from 'three';

const PARTICLE_COUNT = 3000;

/**
 * The trophy the hero morphs into.
 *
 * ═══ WHY IT WAS REWRITTEN ═══
 *
 * The original read like a trophy in its comments and was not one in its arithmetic. The
 * branch labelled "Cup bowl (top half) - half sphere" was:
 *
 *     positions[i3]     = (Math.random() - 0.5) * 2;
 *     positions[i3 + 1] = (Math.random() - 0.5) * 2;
 *     positions[i3 + 2] = (Math.random() - 0.5) * 2;
 *
 * — three independent uniform randoms, which is a solid CUBE. Thirty-five per cent of
 * every particle went into a shapeless block. The "stem" used the branch selector as its
 * height, so it came out as a squat disc a fraction of a unit tall; the "base" was a full
 * sphere of radius 1 sitting inside the cube. Composited, it read as a blob with two ears.
 *
 * ═══ HOW THIS ONE IS BUILT ═══
 *
 * Each part is placed from its own parameters rather than from the random number that
 * chose it — that coupling is what produced the disc. Particles are distributed on
 * SURFACES, not through volumes: a cloud of points is only legible as an object when it
 * describes an outline, and filling the interior spends particles where they cannot be
 * seen and blurs the silhouette that carries the shape.
 */
function generateTrophyPoints(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  //: Proportions of a cup, top to bottom. The bowl is the widest thing and reads first,
  //: so it gets the most particles; the stem is thin and needs few to be understood.
  const BOWL = 0.44;
  const RIM = 0.14;
  const HANDLES = 0.14;
  const STEM = 0.10;
  const PLINTH = 1 - BOWL - RIM - HANDLES - STEM;

  const bowlTop = 0.95;
  const bowlBottom = 0.05;
  const rimRadius = 0.78;

  //: The bowl narrows towards the bottom, quickly at first and then less — a cup profile,
  //: not a cone. `y` runs 0 at the base of the bowl to 1 at the rim.
  const bowlRadius = (y: number) => 0.24 + rimRadius * Math.pow(y, 0.62);

  let i = 0;
  const put = (x: number, y: number, z: number) => {
    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    i += 1;
  };

  const count = (share: number) => Math.round(PARTICLE_COUNT * share);

  // ── bowl: a surface of revolution ──────────────────────────────────────────────────
  for (let n = 0; n < count(BOWL); n += 1) {
    const t = Math.random();
    const y = bowlBottom + (bowlTop - bowlBottom) * t;
    const r = bowlRadius(t);
    const a = Math.random() * Math.PI * 2;
    put(Math.cos(a) * r, y, Math.sin(a) * r * 0.9);
  }

  // ── rim: a dense ring, because the top edge is what makes it read as a cup ─────────
  for (let n = 0; n < count(RIM); n += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = rimRadius + 0.02 + (Math.random() - 0.5) * 0.03;
    put(Math.cos(a) * r, bowlTop + (Math.random() - 0.5) * 0.04, Math.sin(a) * r * 0.9);
  }

  // ── handles: open arcs on the silhouette, both in the same plane as the widest axis ─
  for (let n = 0; n < count(HANDLES); n += 1) {
    const side = n % 2 === 0 ? 1 : -1;
    //: Just over half a turn, opening outward, so it reads as a loop attached at two
    //: points rather than a circle floating beside the cup.
    const a = -Math.PI * 0.55 + Math.random() * Math.PI * 1.1;
    const r = 0.3;
    const cx = 0.72;
    const cy = 0.62;
    put(side * (cx + Math.cos(a) * r), cy + Math.sin(a) * r, (Math.random() - 0.5) * 0.06);
  }

  // ── stem ───────────────────────────────────────────────────────────────────────────
  for (let n = 0; n < count(STEM); n += 1) {
    const t = Math.random();
    const y = -0.42 + t * 0.47;
    //: Pinched in the middle, flaring where it meets the bowl and the plinth.
    const r = 0.1 + 0.09 * Math.abs(t - 0.5) * 2;
    const a = Math.random() * Math.PI * 2;
    put(Math.cos(a) * r, y, Math.sin(a) * r);
  }

  // ── plinth: a slab, drawn as edges rather than filled ──────────────────────────────
  for (let n = i; n < PARTICLE_COUNT; n += 1) {
    const w = 0.46;
    const h = 0.16;
    const yTop = -0.42;
    const t = Math.random();
    const a = Math.random() * Math.PI * 2;
    if (t < 0.5) {
      //: The vertical faces — the part that gives it thickness.
      put(Math.cos(a) * w, yTop - Math.random() * h, Math.sin(a) * w * 0.8);
    } else {
      //: Top and bottom edges, which is what a slab is at this distance.
      const r = w * (0.55 + Math.random() * 0.45);
      put(Math.cos(a) * r, Math.random() < 0.5 ? yTop : yTop - h, Math.sin(a) * r * 0.8);
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
