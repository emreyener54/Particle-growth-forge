import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SHAPES, PARTICLE_COUNT, type ShapeKey } from '@/lib/shapes';

interface ParticleCloudProps {
  targetShape: ShapeKey;
}

function ParticleCloud({ targetShape }: ParticleCloudProps) {
  const meshRef = useRef<THREE.Points>(null);
  const currentPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const targetPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const morphProgress = useRef(1);
  const prevShape = useRef<ShapeKey>('trophy');
  const timeRef = useRef(0);

  // Generate initial positions
  useMemo(() => {
    const initial = SHAPES.trophy();
    currentPositions.current.set(initial);
    targetPositions.current.set(initial);
  }, []);

  // Update target when shape changes
  useEffect(() => {
    if (targetShape !== prevShape.current) {
      const newTarget = SHAPES[targetShape]();
      targetPositions.current.set(newTarget);
      morphProgress.current = 0;
      // Add burst velocity for dissolution effect
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        velocities.current[i] = (Math.random() - 0.5) * 0.08;
      }
      prevShape.current = targetShape;
    }
  }, [targetShape]);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    const cyanR = 0, cyanG = 0.95, cyanB = 1;
    const violetR = 0.55, violetG = 0.36, violetB = 0.96;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random();
      const blend = Math.random();
      col[i * 3] = cyanR + (violetR - cyanR) * blend;
      col[i * 3 + 1] = cyanG + (violetG - cyanG) * blend;
      col[i * 3 + 2] = cyanB + (violetB - cyanB) * blend;
      sz[i] = 1.5 + Math.random() * 2.5;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const time = timeRef.current;

    const geom = meshRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    morphProgress.current = Math.min(1, morphProgress.current + delta * 0.55);
    const progress = morphProgress.current;
    // Ease in-out cubic
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Dampen velocity
      velocities.current[i3] *= 0.96;
      velocities.current[i3 + 1] *= 0.96;
      velocities.current[i3 + 2] *= 0.96;

      // Move toward target with easing
      const tx = targetPositions.current[i3];
      const ty = targetPositions.current[i3 + 1];
      const tz = targetPositions.current[i3 + 2];

      const cx = currentPositions.current[i3];
      const cy = currentPositions.current[i3 + 1];
      const cz = currentPositions.current[i3 + 2];

      // During early morph, let particles scatter; then pull to target
      let nx: number, ny: number, nz: number;
      if (progress < 0.3) {
        // Scatter phase
        nx = cx + velocities.current[i3];
        ny = cy + velocities.current[i3 + 1];
        nz = cz + velocities.current[i3 + 2];
      } else {
        // Pull phase
        const pullStrength = (ease - 0.2) / 0.8;
        nx = cx + (tx - cx) * pullStrength * 0.08 + velocities.current[i3] * (1 - pullStrength);
        ny = cy + (ty - cy) * pullStrength * 0.08 + velocities.current[i3 + 1] * (1 - pullStrength);
        nz = cz + (tz - cz) * pullStrength * 0.08 + velocities.current[i3 + 2] * (1 - pullStrength);
      }

      // Organic breathing
      const breathe = Math.sin(time * 0.8 + i * 0.01) * 0.01;
      const drift = Math.cos(time * 0.5 + i * 0.007) * 0.005;

      currentPositions.current[i3] = nx;
      currentPositions.current[i3 + 1] = ny;
      currentPositions.current[i3 + 2] = nz;

      posArray[i3] = nx + drift;
      posArray[i3 + 1] = ny + breathe;
      posArray[i3 + 2] = nz + drift * 0.5;
    }

    posAttr.needsUpdate = true;
    meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface ParticleSceneProps {
  activeShape: ShapeKey;
  className?: string;
}

export default function ParticleScene({ activeShape, className }: ParticleSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <ParticleCloud targetShape={activeShape} />
      </Canvas>
    </div>
  );
}
