import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Focus, X } from 'lucide-react';
import { exactAnalyticalSolution } from '../physics/suspensionPhysics';

const WHEEL_POSITIONS = [
  [-0.86, -1.28],
  [0.86, -1.28],
  [-0.86, 1.28],
  [0.86, 1.28],
];

function makeVehicleShell({ width, ambulance = false }) {
  const shape = new THREE.Shape();
  if (ambulance) {
    shape.moveTo(-1.96, -0.27);
    shape.lineTo(-1.96, 0.98);
    shape.quadraticCurveTo(-1.94, 1.1, -1.8, 1.1);
    shape.lineTo(0.42, 1.1);
    shape.quadraticCurveTo(0.65, 1.1, 0.82, 0.93);
    shape.lineTo(1.14, 0.66);
    shape.quadraticCurveTo(1.28, 0.56, 1.5, 0.5);
    shape.lineTo(1.9, 0.38);
    shape.quadraticCurveTo(2, 0.35, 2, 0.22);
    shape.lineTo(2, -0.27);
  } else {
    shape.moveTo(-1.96, -0.18);
    shape.lineTo(-1.96, 0.04);
    shape.quadraticCurveTo(-1.64, 0.13, -1.42, 0.16);
    shape.quadraticCurveTo(-1.02, 0.25, -0.72, 0.54);
    shape.quadraticCurveTo(-0.34, 0.76, 0.2, 0.61);
    shape.quadraticCurveTo(0.55, 0.52, 0.82, 0.29);
    shape.quadraticCurveTo(1.2, 0.18, 1.55, 0.12);
    shape.quadraticCurveTo(1.85, 0.04, 2, -0.12);
    shape.lineTo(2, -0.18);
  }

  // The lower edge rises around each wheel, leaving a real wheel arch.
  const edgeY = ambulance ? -0.27 : -0.18;
  const wheelCenterY = ambulance ? -0.51 : -0.30;
  const archRadius = ambulance ? 0.50 : 0.41;
  const archAngle = Math.asin((edgeY - wheelCenterY) / archRadius);
  const edgeOffset = Math.sqrt(archRadius ** 2 - (edgeY - wheelCenterY) ** 2);
  const frontCenter = 1.28;
  const rearCenter = -1.28;
  shape.lineTo(frontCenter + edgeOffset, edgeY);
  shape.absarc(frontCenter, wheelCenterY, archRadius, archAngle, Math.PI - archAngle, false);
  shape.lineTo(rearCenter + edgeOffset, edgeY);
  shape.absarc(rearCenter, wheelCenterY, archRadius, archAngle, Math.PI - archAngle, false);
  shape.lineTo(-1.96, edgeY);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.065,
    bevelThickness: 0.055,
    curveSegments: 20,
  });
  geometry.translate(0, 0, -width / 2);
  geometry.rotateY(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}
class HelixCurve extends THREE.Curve {
  constructor(radius, turns, height) {
    super();
    this.radius = radius;
    this.turns = turns;
    this.height = height;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const angle = t * this.turns * Math.PI * 2;
    return target.set(Math.cos(angle) * this.radius, t * this.height, Math.sin(angle) * this.radius);
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function Wheel({ position, radius, width = 0.32, accent = '#d8dee8', brake = '#7f1d1d', inspection = false }) {
  const side = position[0] > 0 ? 1 : -1;
  return (
    <group position={[position[0], radius, position[1]]}>
      <group visible={!inspection}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 48, 1]} />
        <meshStandardMaterial color="#11151b" roughness={0.9} metalness={0.02} transparent={inspection} opacity={inspection ? 0.045 : 1} depthWrite={!inspection} />
      </mesh>
      <mesh position={[side * (width / 2 + 0.012), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius * 0.73, 0.012, 10, 56]} />
        <meshStandardMaterial color="#333942" metalness={0.08} roughness={0.52} transparent={inspection} opacity={inspection ? 0.08 : 1} depthWrite={!inspection} />
      </mesh>
      <mesh position={[side * (width / 2 + 0.019), 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius * 0.61, radius * 0.61, 0.026, 48]} />
        <meshStandardMaterial color="#27303b" metalness={0.72} roughness={0.28} transparent={inspection} opacity={inspection ? 0.18 : 1} depthWrite={!inspection} />
      </mesh>
      <mesh position={[side * (width / 2 + 0.038), 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius * 0.48, radius * 0.48, 0.018, 48]} />
        <meshStandardMaterial color={brake} metalness={0.7} roughness={0.36} transparent={inspection} opacity={inspection ? 0.24 : 1} depthWrite={!inspection} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={i} position={[side * (width / 2 + 0.052), Math.cos(a) * radius * 0.37, Math.sin(a) * radius * 0.37]} rotation={[a, 0, 0]} castShadow>
            <boxGeometry args={[0.025, 0.028, radius * 0.28]} />
            <meshStandardMaterial color={accent} metalness={0.9} roughness={0.2} transparent={inspection} opacity={inspection ? 0.28 : 1} depthWrite={!inspection} />
          </mesh>
        );
      })}
      <mesh position={[side * (width / 2 + 0.061), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.13, radius * 0.13, 0.026, 32]} />
        <meshStandardMaterial color={accent} metalness={0.92} roughness={0.18} transparent={inspection} opacity={inspection ? 0.28 : 1} depthWrite={!inspection} />
      </mesh>
      </group>
      {inspection && (
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[radius * 0.92, 0.014, 8, 56]} />
          <meshBasicMaterial color="#cbd5e1" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function SuspensionUnit({ position, wheelX, radius, restHeight, springColor = '#60a5fa', refs, visible = true }) {
  const controlArmLength = Math.abs(wheelX - position[0]);
  const controlArmDirection = Math.sign(wheelX - position[0]);
  const springGeometry = useMemo(() => {
    const curve = new HelixCurve(0.052, 6.5, restHeight);
    return new THREE.TubeGeometry(curve, 80, 0.011, 10, false);
  }, [restHeight]);

  return (
    <group visible={visible} position={[position[0], radius, position[1]]}>
      <mesh position={[0, 0.03, 0]} ref={refs.spring} geometry={springGeometry} castShadow>
        <meshStandardMaterial color={springColor} emissive={springColor} emissiveIntensity={0.08} metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, restHeight * 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.048, restHeight * 0.62, 24]} />
        <meshStandardMaterial color="#202833" metalness={0.84} roughness={0.26} />
      </mesh>
      <mesh ref={refs.rod} position={[0, restHeight - 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.17, 20]} />
        <meshStandardMaterial color="#d9e0e8" metalness={0.98} roughness={0.12} />
      </mesh>
      {controlArmLength > 0.02 && (
        <>
          <mesh position={[controlArmDirection * controlArmLength * 0.5, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.024, 0.032, controlArmLength, 18]} />
            <meshStandardMaterial color="#334155" metalness={0.82} roughness={0.3} />
          </mesh>
          <mesh position={[controlArmDirection * controlArmLength, 0.04, 0]} castShadow>
            <sphereGeometry args={[0.055, 18, 14]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.24} />
          </mesh>
        </>
      )}
      <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 24]} />
        <meshStandardMaterial color="#46515f" metalness={0.78} roughness={0.26} />
      </mesh>
      <mesh position={[0, restHeight + 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 24]} />
        <meshStandardMaterial color="#46515f" metalness={0.78} roughness={0.26} />
      </mesh>
    </group>
  );
}

function makeSuspRefs() {
  return WHEEL_POSITIONS.map(() => ({ spring: React.createRef(), rod: React.createRef() }));
}

function LightningBolt({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = '#facc15' }) {
  const boltGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.30, 0.08);
    shape.lineTo(-0.02, 0.08);
    shape.lineTo(-0.10, 0.24);
    shape.lineTo(0.30, -0.01);
    shape.lineTo(0.04, -0.01);
    shape.lineTo(0.13, -0.22);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.012, bevelThickness: 0.01 });
  }, []);
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh geometry={boltGeometry}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} metalness={0.2} roughness={0.34} />
      </mesh>
    </group>
  );
}

function Number95({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff7ed';
    ctx.beginPath();
    ctx.roundRect(14, 18, 484, 220, 38);
    ctx.fill();
    ctx.lineJoin = 'round';
    ctx.font = '900 190px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 22;
    ctx.strokeStyle = '#7f1d1d';
    ctx.strokeText('95', 256, 128);
    ctx.fillStyle = '#facc15';
    ctx.fillText('95', 256, 128);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh>
        <planeGeometry args={[0.48, 0.24]} />
        <meshStandardMaterial map={texture} roughness={0.48} metalness={0.08} />
      </mesh>
    </group>
  );
}

function AmbulanceModel({ visible, position, bodyRef, suspRefs, selected, inspection, onSelect, onHover }) {
  const sirenRef = useRef();
  const restHeight = 0.28;
  const wheelRadius = 0.39;
  const shell = useMemo(() => makeVehicleShell({ width: 1.82, ambulance: true }), []);
  useFrame((state) => {
    if (sirenRef.current) {
      const t = state.clock.elapsedTime;
      const pulse = (Math.sin(t * 8) + 1) / 2;
      sirenRef.current.material.emissiveIntensity = 0.8 + pulse * 2.2;
      sirenRef.current.material.color.setHSL(0.58 + pulse * 0.02, 0.9, 0.55);
    }
  });
  return (
    <group visible={visible} position={[position, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect('ambulancia'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('ambulancia'); }}
      onPointerOut={() => onHover(null)}>
      {WHEEL_POSITIONS.map((w, i) => (
        <React.Fragment key={i}>
          <Wheel position={w} radius={wheelRadius} width={0.3} accent="#d1d5db" brake="#64748b" inspection={inspection && i === 3} />
          <SuspensionUnit visible={!inspection || i === 3} position={[w[0], w[1]]} wheelX={w[0]} radius={wheelRadius} restHeight={restHeight} springColor="#38bdf8" refs={suspRefs[i]} />
        </React.Fragment>
      ))}
      <group ref={bodyRef} position={[0, 0.9, 0]}>
        <mesh geometry={shell} castShadow receiveShadow>
          <meshStandardMaterial color="#f2f5f8" metalness={0.34} roughness={0.3} transparent={inspection} opacity={inspection ? 0.24 : 1} depthWrite={!inspection} side={THREE.DoubleSide} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={`ambulance-stripe-${side}`} position={[side * 0.914, 0.18, -0.45]} castShadow>
            <boxGeometry args={[0.025, 0.12, 2.58]} />
            <meshStandardMaterial color="#dc2626" roughness={0.42} />
          </mesh>
        ))}
        <mesh position={[0, -0.08, 1.94]}>
          <boxGeometry args={[1.34, 0.12, 0.045]} />
          <meshStandardMaterial color="#dc2626" roughness={0.42} />
        </mesh>
        <RoundedBox args={[1.46, 0.5, 0.05]} radius={0.05} smoothness={4} position={[0, 0.42, 2.0]} rotation={[-0.18, 0, 0]}>
          <meshPhysicalMaterial color="#93c5fd" metalness={0.1} roughness={0.05} transmission={0.55} thickness={0.2} transparent opacity={0.95} />
        </RoundedBox>
        {[1, -1].map((s) => (
          <group key={s}>
            <RoundedBox args={[0.04, 0.62, 1.8]} radius={0.02} smoothness={3} position={[s * 0.92, 0.46, -0.58]}>
              <meshPhysicalMaterial color="#60a5fa" metalness={0.05} roughness={0.08} transmission={0.45} transparent opacity={0.9} />
            </RoundedBox>
            <RoundedBox args={[0.04, 0.48, 0.42]} radius={0.02} smoothness={3} position={[s * 0.87, 0.42, 1.28]}>
              <meshPhysicalMaterial color="#60a5fa" metalness={0.05} roughness={0.08} transmission={0.45} transparent opacity={0.9} />
            </RoundedBox>
            <group position={[s * 0.93, 0.5, -0.58]} rotation={[0, s * Math.PI / 2, 0]}>
              <mesh position={[0, 0, 0.01]}><boxGeometry args={[0.38, 0.11, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
              <mesh position={[0, 0, 0.01]}><boxGeometry args={[0.11, 0.38, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
              <mesh position={[0, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.015]} /><meshStandardMaterial color="#f8fafc" /></mesh>
            </group>
          </group>
        ))}
        <mesh position={[0, 1.0, 1.25]}>
          <boxGeometry args={[1.08, 0.08, 0.22]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh ref={sirenRef} position={[0, 1.08, 1.25]}>
          <boxGeometry args={[0.5, 0.1, 0.14]} />
          <meshStandardMaterial color="#3b82f6" emissive="#60a5fa" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.06, 2.05]}>
            <boxGeometry args={[0.26, 0.13, 0.05]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={0.7} />
          </mesh>
        ))}
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, -0.02, -1.82]}>
            <boxGeometry args={[0.22, 0.1, 0.04]} />
            <meshStandardMaterial color="#fecaca" emissive="#ef4444" emissiveIntensity={0.4} />
          </mesh>
        ))}
        <mesh position={[0, -0.17, 2.0]}>
          <boxGeometry args={[1.62, 0.1, 0.14]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.02, -0.6]}>
          <boxGeometry args={[0.5, 0.06, 0.35]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
      {selected && <pointLight position={[0, 1.3, 1.3]} color="#7dd3fc" intensity={0.7} distance={4.5} />}
    </group>
  );
}

function RaceCarModel({ visible, position, bodyRef, suspRefs, selected, inspection, onSelect, onHover }) {
  const restHeight = 0.22;
  const wheelRadius = 0.33;
  const shell = useMemo(() => makeVehicleShell({ width: 1.72 }), []);
  return (
    <group visible={visible} position={[position, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect('carreras'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('carreras'); }}
      onPointerOut={() => onHover(null)}>
      {WHEEL_POSITIONS.map((w, i) => (
        <React.Fragment key={i}>
          <Wheel position={w} radius={wheelRadius} width={0.34} accent="#d1d5db" brake="#991b1b" inspection={inspection && i === 3} />
          <SuspensionUnit visible={!inspection || i === 3} position={[w[0], w[1]]} wheelX={w[0]} radius={wheelRadius} restHeight={restHeight} springColor="#f59e0b" refs={suspRefs[i]} />
        </React.Fragment>
      ))}
      <group ref={bodyRef} position={[0, 0.63, 0]}>
        <mesh geometry={shell} castShadow receiveShadow>
          <meshStandardMaterial color="#d71920" metalness={0.5} roughness={0.23} transparent={inspection} opacity={inspection ? 0.24 : 1} depthWrite={!inspection} side={THREE.DoubleSide} />
        </mesh>
        <RoundedBox args={[1.25, 0.05, 0.95]} radius={0.05} smoothness={3} position={[0, 0.42, 0.72]} rotation={[-0.2, 0, 0]}>
          <meshPhysicalMaterial color="#60a5fa" metalness={0.1} roughness={0.05} transmission={0.4} transparent opacity={0.85} />
        </RoundedBox>
        {[-1, 1].map((side) => (
          <RoundedBox key={`race-side-glass-${side}`} args={[0.024, 0.19, 0.48]} radius={0.025} smoothness={4} position={[side * 0.83, 0.42, -0.23]} rotation={[0, side * 0.08, 0]}>
            <meshPhysicalMaterial color="#163c63" metalness={0.34} roughness={0.12} transmission={0.14} transparent opacity={0.94} />
          </RoundedBox>
        ))}
        <mesh position={[0, 0.18, 1.72]} rotation={[0.22, 0, 0]}>
          <boxGeometry args={[1.68, 0.06, 0.45]} />
          <meshStandardMaterial color="#991b1b" metalness={0.45} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, -1.72]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[1.62, 0.06, 0.35]} />
          <meshStandardMaterial color="#991b1b" metalness={0.45} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.56, -1.55]} castShadow>
          <boxGeometry args={[1.7, 0.07, 0.18]} />
          <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.38, -1.45]} castShadow>
            <boxGeometry args={[0.06, 0.36, 0.12]} />
            <meshStandardMaterial color="#111827" metalness={0.55} roughness={0.35} />
          </mesh>
        ))}
        {/* Rayo McQueen-inspired details */}
        <LightningBolt position={[0.55, 0.28, 0.35]} rotation={[0, Math.PI / 2, 0]} scale={1.15} />
        <LightningBolt position={[-0.55, 0.28, 0.35]} rotation={[0, -Math.PI / 2, 0]} scale={1.15} />
        <Number95 position={[0.87, 0.25, 0.1]} rotation={[0, Math.PI / 2, 0]} scale={1.1} />
        <Number95 position={[-0.87, 0.25, 0.1]} rotation={[0, -Math.PI / 2, 0]} scale={1.1} />
        <mesh position={[0, 0.3, 1.05]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.55, 0.015, 0.35]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.25, -0.95]}>
          <boxGeometry args={[0.65, 0.012, 0.28]} />
          <meshStandardMaterial color="#fde047" />
        </mesh>
        {/* Eyes on the windshield make the red racer recognizable as Rayo McQueen. */}
        {[-0.28, 0.28].map((x) => (
          <group key={x} position={[x, 0.5, 1.22]} rotation={[-0.2, 0, 0]}>
            <mesh scale={[1.15, 0.82, 0.35]}>
              <sphereGeometry args={[0.13, 24, 18]} />
              <meshStandardMaterial color="#ffffff" roughness={0.22} />
            </mesh>
            <mesh position={[x > 0 ? -0.025 : 0.025, -0.004, 0.037]} scale={[0.48, 0.54, 0.24]}>
              <sphereGeometry args={[0.1, 20, 16]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.2} />
            </mesh>
            <mesh position={[x > 0 ? -0.025 : 0.025, -0.004, 0.053]} scale={[0.25, 0.32, 0.18]}>
              <sphereGeometry args={[0.1, 16, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.18} />
            </mesh>
          </group>
        ))}
        {/* headlights */}
        {[-0.52, 0.52].map((x) => (
          <mesh key={x} position={[x, 0.17, 1.82]} rotation={[0.25, x > 0 ? -0.2 : 0.2, 0]}>
            <boxGeometry args={[0.28, 0.1, 0.05]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.18, -1.78]}>
            <boxGeometry args={[0.22, 0.09, 0.04]} />
            <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.45} />
          </mesh>
        ))}
        {/* exhaust hints */}
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.02, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>
      {selected && <pointLight position={[0, 1.1, 1.3]} color="#fbbf24" intensity={0.55} distance={4} />}
    </group>
  );
}

function TrackGround({ focus }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 26]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      <RoundedBox args={[7, 0.05, 0.38]} radius={0.035} smoothness={5} position={[0, 0.025, 1.28]} castShadow receiveShadow>
        <meshStandardMaterial color="#334155" roughness={0.78} />
      </RoundedBox>
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={`bump-mark-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-3.25 + i * 0.5, 0.052, 1.28]}>
          <planeGeometry args={[0.28, 0.34]} />
          <meshBasicMaterial color={i % 2 ? '#f8fafc' : '#fbbf24'} />
        </mesh>
      ))}
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.003, 0]}>
          <planeGeometry args={[0.06, 26]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -10 + i * 1.2]}>
          <planeGeometry args={[0.6, 0.08]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={20} blur={2.2} far={4.5} />
      {focus && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[focus === 'ambulancia' ? -1.75 : 1.75, 0.006, 1.1]}>
          <ringGeometry args={[0.55, 0.78, 48]} />
          <meshBasicMaterial color={focus === 'ambulancia' ? '#0ea5e9' : '#f59e0b'} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function CameraRig({ mode, focusTarget }) {
  const { camera } = useThree();
  const controls = useThree((s) => s.controls);
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    if (mode === 'focus' && focusTarget) {
      const baseX = focusTarget.vehicle === 'ambulancia' ? -1.75 : 1.75;
      // focus on front-right suspension area for a clear view
      desiredTarget.current.set(baseX + 0.86, 0.5, 1.28);
      desiredPos.current.set(baseX + 2.4, 1.8, 4.2);
    } else if (mode === 'single' && focusTarget) {
      const baseX = focusTarget.vehicle === 'ambulancia' ? -1.75 : 1.75;
      desiredTarget.current.set(baseX, 0.75, 0.2);
      desiredPos.current.set(baseX + 4.2, 2.4, 4.6);
    } else {
      desiredTarget.current.set(0, 0.7, 0);
      desiredPos.current.set(5.6, 5.0, 10.8);
    }
  }, [mode, focusTarget]);

  useFrame((_, delta) => {
    const a = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desiredPos.current, a);
    if (controls?.target) {
      controls.target.lerp(desiredTarget.current, a);
      controls.update();
    }
  });
  return null;
}

function PhysicsController({ m, c, k, x0, v0, focusedVehicle, amb, race, bumpTime, simClock, onTelemetry }) {
  const lastTelemetry = useRef(0);
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    simClock.current = elapsed;
    const phase = ((elapsed - bumpTime) % 4.6 + 4.6) % 4.6;
    const t = Math.min(phase, 3.5);

    const animate = (refs, bodyRef, baseY, restHeight, params) => {
      const disp = exactAnalyticalSolution(t, params.m, params.c, params.k, x0, v0);
      if (bodyRef.current) bodyRef.current.position.y = baseY + disp;
      refs.forEach(({ spring, rod }) => {
        if (spring.current) {
          spring.current.scale.y = THREE.MathUtils.clamp((restHeight + disp) / restHeight, 0.55, 1.55);
        }
        if (rod.current) rod.current.position.y = restHeight - 0.02 + disp;
      });
    };

    const ambParams = focusedVehicle === null
      ? { m, c, k }
      : focusedVehicle === 'ambulancia' ? { m, c, k } : { m: 300, c: 6000, k: 30000 };
    const raceParams = focusedVehicle === null
      ? { m, c: c * (8500 / 6000), k: k * (50000 / 30000) }
      : focusedVehicle === 'carreras' ? { m, c, k } : { m: 300, c: 8500, k: 50000 };
    const ambDisp = exactAnalyticalSolution(t, ambParams.m, ambParams.c, ambParams.k, x0, v0);
    const raceDisp = exactAnalyticalSolution(t, raceParams.m, raceParams.c, raceParams.k, x0, v0);
    animate(amb.susp, amb.body, 0.9, 0.28, ambParams);
    animate(race.susp, race.body, 0.63, 0.22, raceParams);
    if (onTelemetry && elapsed - lastTelemetry.current > 0.1) {
      lastTelemetry.current = elapsed;
      onTelemetry({ time: t, ambulance: ambDisp, race: raceDisp });
    }
  });
  return null;
}

function FocusOverlay({ open, vehicle, onClose, onBump, m, c, k, zeta, regimen }) {
  if (!open) return null;
  const isAmb = vehicle === 'ambulancia';
  return (
    <div className="pointer-events-none absolute left-3 top-[7rem] z-30 w-[min(19rem,calc(100%-1.5rem))] sm:left-4 sm:top-[7.2rem]">
      <div className="pointer-events-auto overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-xl backdrop-blur">
        <div className={`flex items-center justify-between gap-3 px-3.5 py-3 text-white ${isAmb ? 'bg-gradient-to-r from-sky-800 to-cyan-700' : 'bg-gradient-to-r from-red-800 to-amber-600'}`}>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[.16em] text-white/80">Zoom técnico · vista real</div>
            <h4 className="text-sm font-extrabold">{isAmb ? 'Amortiguador de ambulancia' : 'Amortiguador de Rayo McQueen'}</h4>
          </div>
          <button onClick={onClose} className="rounded-lg bg-white/15 p-2 hover:bg-white/25" aria-label="Cerrar enfoque">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3.5 text-[11px] leading-relaxed text-slate-700">
          <p><strong className="text-slate-950">Corte técnico:</strong> el contorno de la rueda marca su posición; el conjunto de resorte y amortiguador aparece dentro del paso de rueda, unido al brazo de suspensión.</p>
          <p className="mt-1.5">El modelo muestra la respuesta al mismo bache de <strong>5 cm</strong>; régimen actual: <strong>{regimen}</strong>.</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono font-bold text-slate-800">m {m} kg · k {(k / 1000).toFixed(0)} kN/m · c {c.toFixed(0)}</span>
            <button onClick={onBump} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-400 px-2.5 py-2 text-[11px] font-extrabold text-slate-950 hover:bg-amber-300">
              <Activity className="h-3.5 w-3.5" /> Repetir bache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vehicle3DScene({
  m = 300,
  c = 6000,
  k = 30000,
  x0 = 0.05,
  v0 = 0,
  focusedVehicle = 'ambulancia',
  setFocusedVehicle = () => {},
}) {
  const [hovered, setHovered] = useState(null);
  const [bumpTime, setBumpTime] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [readings, setReadings] = useState({ time: 0, ambulance: 0.05, race: 0.05 });
  const ambRefs = useMemo(() => ({ body: React.createRef(), susp: makeSuspRefs() }), []);
  const raceRefs = useMemo(() => ({ body: React.createRef(), susp: makeSuspRefs() }), []);
  const simClock = useRef(0);

  const zeta = c / (2 * Math.sqrt(m * k));
  const regimen = Math.abs(zeta - 1) < 1e-3 ? 'críticamente amortiguado' : zeta < 1 ? 'subamortiguado' : 'sobreamortiguado';

  const triggerBump = () => setBumpTime(simClock.current || 0);
  const openFocus = (vehicle) => {
    setFocusedVehicle(vehicle);
    setFocusMode(true);
    setShowModal(true);
  };

  const cameraMode = focusMode && focusedVehicle ? 'focus' : focusedVehicle === null ? 'compare' : 'single';
  const focusTarget = focusedVehicle ? { vehicle: focusedVehicle } : null;

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-sky-100 via-slate-100 to-slate-200 shadow-inner sm:h-[520px] lg:h-[580px]">
      <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-center justify-between gap-2 sm:left-4 sm:right-4 sm:top-4">
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-lg backdrop-blur">
          <button onClick={() => { setFocusedVehicle('ambulancia'); setFocusMode(false); }} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${focusedVehicle === 'ambulancia' ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>🚑 Ambulancia</button>
          <button onClick={() => { setFocusedVehicle('carreras'); setFocusMode(false); }} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${focusedVehicle === 'carreras' ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>🏎️ Rayo McQueen</button>
          <button onClick={() => { setFocusedVehicle(null); setFocusMode(false); }} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${focusedVehicle === null ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>Comparar</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => focusedVehicle && openFocus(focusedVehicle)} disabled={!focusedVehicle} className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white/90 px-3 py-2 text-xs font-extrabold text-sky-800 shadow hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50">
            <Focus className="h-4 w-4" /> Enfocar suspensión
          </button>
          <button onClick={triggerBump} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-slate-950 shadow hover:bg-amber-400">
            <Activity className="h-4 w-4" /> Simular bache
          </button>
        </div>
      </div>

      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#dbeafe']} />
        <fog attach="fog" args={['#dbeafe', 12, 28]} />
        <PerspectiveCamera makeDefault position={[0, 4.8, 10.5]} fov={42} />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#ffffff', '#94a3b8', 0.7]} />
        <directionalLight position={[6, 9, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-near={0.5} shadow-camera-far={30} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.00025} />
        <directionalLight position={[-5, 4, -3]} intensity={0.5} color="#bfdbfe" />
        <spotLight position={[0, 8, 2]} intensity={0.7} angle={0.5} penumbra={0.8} />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <CameraRig mode={cameraMode} focusTarget={focusTarget} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} enablePan={false} minDistance={3.8} maxDistance={18} minPolarAngle={0.2} maxPolarAngle={Math.PI / 2 - 0.05} />

        <AmbulanceModel visible={focusedVehicle !== 'carreras'} position={-1.75} bodyRef={ambRefs.body} suspRefs={ambRefs.susp} selected={focusedVehicle === 'ambulancia'} inspection={focusMode && focusedVehicle === 'ambulancia'} onSelect={(v) => { setFocusedVehicle(v); setFocusMode(false); }} onHover={setHovered} />
        <RaceCarModel visible={focusedVehicle !== 'ambulancia'} position={1.75} bodyRef={raceRefs.body} suspRefs={raceRefs.susp} selected={focusedVehicle === 'carreras'} inspection={focusMode && focusedVehicle === 'carreras'} onSelect={(v) => { setFocusedVehicle(v); setFocusMode(false); }} onHover={setHovered} />

        <TrackGround focus={focusMode ? focusedVehicle : null} />
        <PhysicsController m={m} c={c} k={k} x0={x0} v0={v0} focusedVehicle={focusedVehicle} amb={ambRefs} race={raceRefs} bumpTime={bumpTime} simClock={simClock} onTelemetry={setReadings} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[20rem] rounded-xl border border-slate-200/80 bg-white/92 px-3.5 py-2.5 text-xs text-slate-700 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <span className={`h-2.5 w-2.5 rounded-full ${hovered ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
            <span>{focusedVehicle === 'ambulancia' ? 'Ambulancia · prioridad: confort y estabilidad clínica' : focusedVehicle === 'carreras' ? 'Rayo McQueen · prioridad: rigidez y agarre en pista' : 'Comparativa en tiempo real bajo las mismas condiciones'}</span>
          </div>
          <p className="mt-1 leading-relaxed">Mismo bache de 5 cm. Selecciona un auto y enfoca su suspensión interna.</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:w-[17rem]">
          <div className="rounded-lg border border-sky-200 bg-white/95 px-2.5 py-1.5 text-[10px] shadow backdrop-blur">
            <span className="block font-bold uppercase tracking-wide text-sky-800">Ambulancia · t={readings.time.toFixed(2)} s</span>
            <strong className="font-mono text-slate-900">x = {(readings.ambulance * 100).toFixed(2)} cm</strong>
          </div>
          <div className="rounded-lg border border-amber-200 bg-white/95 px-2.5 py-1.5 text-[10px] shadow backdrop-blur">
            <span className="block font-bold uppercase tracking-wide text-amber-800">Rayo McQueen</span>
            <strong className="font-mono text-slate-900">x = {(readings.race * 100).toFixed(2)} cm</strong>
          </div>
        </div>
      </div>

      <FocusOverlay open={showModal && !!focusedVehicle} vehicle={focusedVehicle} onClose={() => { setShowModal(false); setFocusMode(false); }} onBump={triggerBump} m={m} c={c} k={k} zeta={zeta} regimen={regimen} />
    </div>
  );
}
