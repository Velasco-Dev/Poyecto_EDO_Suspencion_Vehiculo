import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { exactAnalyticalSolution } from '../physics/suspensionPhysics';

// Curva de hélice paramétrica para el resorte helicoidal
class HelixCurve extends THREE.Curve {
  constructor(radius = 0.08, turns = 6, height = 0.45) {
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

// Unidad de Suspensión: Rueda + Resorte Helicoidal + Amortiguador Hidráulico
function SuspensionUnit({ position, isLeft, springColor = '#ef4444', springRef, pistonRef, wheelRadius = 0.36, restH = 0.45 }) {
  const springGeo = useMemo(() => new THREE.TubeGeometry(new HelixCurve(0.08, 6.5, restH), 64, 0.015, 8, false), [restH]);

  return (
    <group position={position}>
      {/* Rueda y neumático */}
      <group position={[0, wheelRadius, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[wheelRadius, wheelRadius, 0.24, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[wheelRadius * 0.6, wheelRadius * 0.6, 0.25, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[isLeft ? -0.13 : 0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 12]} />
          <meshStandardMaterial color={springColor} roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Amortiguador y Resorte (Base fija en masa de la rueda) */}
      <group position={[isLeft ? 0.08 : -0.08, wheelRadius, 0]}>
        {/* Cilindro exterior del amortiguador */}
        <mesh position={[0, restH * 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.036, 0.036, restH * 0.65, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Resorte helicoidal (escalable en Y) */}
        <mesh ref={springRef} geometry={springGeo} castShadow receiveShadow>
          <meshStandardMaterial color={springColor} metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Vástago cromado del pistón hidráulico (se desliza al comprimir) */}
        <mesh ref={pistonRef} position={[0, restH, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, restH * 0.7, 16]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
}

// Vehículo 1: Ambulancia Médica (carrocería alta, luces de emergencia, cruz roja)
function AmbulanceModel({ bodyRef, springRef, pistonRef, onClick, isHovered, onHover }) {
  const redLight = useRef();
  const blueLight = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 8.0;
    const isRed = Math.sin(t) > 0;
    if (redLight.current) redLight.current.emissiveIntensity = isRed ? 1.8 : 0.2;
    if (blueLight.current) blueLight.current.emissiveIntensity = !isRed ? 1.8 : 0.2;
  });

  return (
    <group position={[-2.4, 0, 0]} onClick={onClick} onPointerOver={() => onHover('ambulancia')} onPointerOut={() => onHover(null)}>
      <SuspensionUnit position={[-0.82, 0, -1.1]} isLeft springColor="#0284c7" wheelRadius={0.38} />
      <SuspensionUnit position={[0.82, 0, -1.1]} springColor="#0284c7" wheelRadius={0.38} />
      <SuspensionUnit position={[-0.82, 0, 1.1]} isLeft springColor="#0284c7" wheelRadius={0.38} />
      {/* Suspensión delantera derecha (punto de enfoque 45°) */}
      <SuspensionUnit position={[0.82, 0, 1.1]} springColor="#0284c7" springRef={springRef} pistonRef={pistonRef} wheelRadius={0.38} />

      {/* Carrocería oscilante x(t) */}
      <group ref={bodyRef} position={[0, 0.42, 0]}>
        {/* Cabina y caja médica */}
        <mesh position={[0, 0.58, 1.05]} castShadow receiveShadow>
          <boxGeometry args={[1.68, 0.85, 1.35]} />
          <meshStandardMaterial color={isHovered ? '#ffffff' : '#f8fafc'} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.76, 1.73]} rotation={[-Math.PI / 8, 0, 0]} castShadow>
          <boxGeometry args={[1.52, 0.46, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.86, -0.65]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 1.35, 2.35]} />
          <meshStandardMaterial color={isHovered ? '#ffffff' : '#f8fafc'} roughness={0.3} />
        </mesh>
        {/* Franja roja */}
        <mesh position={[0, 0.55, -0.65]}>
          <boxGeometry args={[1.84, 0.16, 2.36]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Cruz roja lateral derecha */}
        <group position={[0.92, 0.95, -0.65]} rotation={[0, Math.PI / 2, 0]}>
          <mesh><boxGeometry args={[0.48, 0.16, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
          <mesh><boxGeometry args={[0.16, 0.48, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
        </group>
        {/* Cruz roja lateral izquierda */}
        <group position={[-0.92, 0.95, -0.65]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh><boxGeometry args={[0.48, 0.16, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
          <mesh><boxGeometry args={[0.16, 0.48, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
        </group>
        <Text position={[0.925, 1.25, -0.65]} rotation={[0, Math.PI / 2, 0]} fontSize={0.18} color="#dc2626" fontWeight="bold">AMBULANCIA</Text>
        <Text position={[-0.925, 1.25, -0.65]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.18} color="#dc2626" fontWeight="bold">AMBULANCIA</Text>
        {/* Balizas de emergencia (esferas roja y azul) */}
        <mesh position={[0, 1.05, 1.05]} castShadow>
          <boxGeometry args={[1.3, 0.08, 0.16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-0.35, 1.13, 1.05]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial ref={redLight} color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.35, 1.13, 1.05]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial ref={blueLight} color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0, 0.22, 1.76]} castShadow>
          <boxGeometry args={[1.72, 0.16, 0.14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

// Vehículo 2: Carro de Carreras (Rayo McQueen #95, bajo, alerón, rayo amarillo)
function RacingCarModel({ bodyRef, springRef, pistonRef, onClick, isHovered, onHover }) {
  return (
    <group position={[2.4, 0, 0]} onClick={onClick} onPointerOver={() => onHover('carreras')} onPointerOut={() => onHover(null)}>
      <SuspensionUnit position={[0.84, 0, -1.05]} springColor="#eab308" wheelRadius={0.34} />
      <SuspensionUnit position={[-0.84, 0, -1.05]} isLeft springColor="#eab308" wheelRadius={0.34} />
      <SuspensionUnit position={[0.84, 0, 1.05]} springColor="#eab308" wheelRadius={0.34} />
      {/* Suspensión delantera izquierda (punto de enfoque 45°) */}
      <SuspensionUnit position={[-0.84, 0, 1.05]} isLeft springColor="#eab308" springRef={springRef} pistonRef={pistonRef} wheelRadius={0.34} />

      {/* Carrocería deportiva oscilante x(t) */}
      <group ref={bodyRef} position={[0, 0.38, 0]}>
        {/* Chasis estilizado rojo Lightning McQueen */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.66, 0.32, 3.4]} />
          <meshStandardMaterial color={isHovered ? '#ef4444' : '#dc2626'} metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.16, 1.45]} rotation={[Math.PI / 16, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.2, 0.85]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.52, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[1.26, 0.38, 1.65]} />
          <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.2} />
        </mesh>
        {/* Parabrisas con ojos */}
        <mesh position={[0, 0.56, 0.68]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
          <boxGeometry args={[1.18, 0.36, 0.04]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[-0.26, 0.56, 0.71]} rotation={[-Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.26, 0.56, 0.71]} rotation={[-Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Rayo amarillo decorativo en los costados */}
        <group position={[-0.84, 0.25, 0.15]} rotation={[0, -Math.PI / 2, 0.18]}>
          <mesh><boxGeometry args={[1.55, 0.12, 0.02]} /><meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.3} /></mesh>
          <mesh position={[0, -0.07, 0]}><boxGeometry args={[1.35, 0.04, 0.02]} /><meshStandardMaterial color="#ea580c" /></mesh>
        </group>
        <group position={[0.84, 0.25, 0.15]} rotation={[0, Math.PI / 2, -0.18]}>
          <mesh><boxGeometry args={[1.55, 0.12, 0.02]} /><meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.3} /></mesh>
          <mesh position={[0, -0.07, 0]}><boxGeometry args={[1.35, 0.04, 0.02]} /><meshStandardMaterial color="#ea580c" /></mesh>
        </group>
        {/* Número 95 en el techo y puertas */}
        <Text position={[0, 0.73, -0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.44} color="#facc15" outlineWidth={0.03} outlineColor="#991b1b" fontWeight="bold">95</Text>
        <Text position={[-0.85, 0.26, -0.35]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.3} color="#facc15" outlineWidth={0.02} outlineColor="#991b1b" fontWeight="bold">95</Text>
        <Text position={[0.85, 0.26, -0.35]} rotation={[0, Math.PI / 2, 0]} fontSize={0.3} color="#facc15" outlineWidth={0.02} outlineColor="#991b1b" fontWeight="bold">95</Text>
        {/* Alerón trasero (spoiler) */}
        <mesh position={[-0.48, 0.46, -1.48]} castShadow><boxGeometry args={[0.05, 0.32, 0.08]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0.48, 0.46, -1.48]} castShadow><boxGeometry args={[0.05, 0.32, 0.08]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 0.64, -1.52]} rotation={[Math.PI / 24, 0, 0]} castShadow>
          <boxGeometry args={[1.56, 0.04, 0.28]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[-0.78, 0.64, -1.52]}><boxGeometry args={[0.02, 0.16, 0.3]} /><meshStandardMaterial color="#facc15" /></mesh>
        <mesh position={[0.78, 0.64, -1.52]}><boxGeometry args={[0.02, 0.16, 0.3]} /><meshStandardMaterial color="#facc15" /></mesh>
      </group>
    </group>
  );
}

// Pista, marcas de carril y resalto / bache
function TrackGround() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 28]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
      </mesh>
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <mesh key={i} position={[0, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 1.6]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}
      {/* Resalto en la calzada (Z = 1.05, impacto del eje delantero) */}
      <group position={[0, 0.025, 1.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 10.5, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        <Text position={[0, 0.14, 0.35]} rotation={[-Math.PI / 3, 0, 0]} fontSize={0.2} color="#0f172a" fontWeight="bold">
          Bache de Prueba (x₀ = 5 cm)
        </Text>
      </group>
      <mesh receiveShadow position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.95} />
      </mesh>
    </group>
  );
}

// Rig de cámara con interpolación suave LERP hacia ángulo de 45°
function CameraRig({ focusedVehicle, controlsRef }) {
  const { camera } = useThree();
  const targetCam = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (focusedVehicle === 'ambulancia') {
      targetCam.set(-0.35, 1.65, 2.35); // Ángulo 45° a la suspensión
      targetLook.set(-1.58, 0.52, 1.1);
    } else if (focusedVehicle === 'carreras') {
      targetCam.set(0.35, 1.6, 2.3);    // Ángulo 45° a la suspensión
      targetLook.set(1.56, 0.48, 1.05);
    } else {
      targetCam.set(0, 4.0, 7.8);        // Vista panorámica
      targetLook.set(0, 0.8, 0.1);
    }

    const factor = Math.min(1.0, delta * 3.8);
    camera.position.lerp(targetCam, factor);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook, factor);
      controlsRef.current.update();
    }
  });

  return null;
}

// Bucle de física exacta para animación de la suspensión
function PhysicsController({ m, c, k, x0, v0, focusedVehicle, ambRefs, raceRefs, bumpTime }) {
  const restH = 0.45;

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() - bumpTime) % 3.6;

    // Física Ambulancia: usa los sliders si está enfocada, o c_critico = 6000 (confort clínico)
    const mAmb = focusedVehicle === 'ambulancia' ? m : 300;
    const cAmb = focusedVehicle === 'ambulancia' ? c : 6000;
    const kAmb = focusedVehicle === 'ambulancia' ? k : 30000;
    const yAmb = exactAnalyticalSolution(t, mAmb, cAmb, kAmb, x0, v0) * 3.8;

    if (ambRefs.body.current) ambRefs.body.current.position.y = 0.42 + yAmb;
    if (ambRefs.spring.current) {
      ambRefs.spring.current.scale.set(1, Math.max(0.35, Math.min(1.75, (restH + yAmb) / restH)), 1);
    }
    if (ambRefs.piston.current) ambRefs.piston.current.position.y = restH + yAmb;

    // Física Carreras: usa los sliders si está enfocado, o rigidez de pista deportiva
    const mRace = focusedVehicle === 'carreras' ? m : 280;
    const cRace = focusedVehicle === 'carreras' ? c : 8500;
    const kRace = focusedVehicle === 'carreras' ? k : 55000;
    const yRace = exactAnalyticalSolution(t, mRace, cRace, kRace, x0, v0) * 2.8;

    if (raceRefs.body.current) raceRefs.body.current.position.y = 0.38 + yRace;
    if (raceRefs.spring.current) {
      raceRefs.spring.current.scale.set(1, Math.max(0.4, Math.min(1.6, (restH + yRace) / restH)), 1);
    }
    if (raceRefs.piston.current) raceRefs.piston.current.position.y = restH + yRace;
  });

  return null;
}

// Componente Exportado Principal
export default function Vehicle3DScene({
  m = 300,
  c = 6000,
  k = 30000,
  x0 = 0.05,
  v0 = 0,
  focusedVehicle = null,
  onFocusChange = () => {}
}) {
  const [activeFocus, setActiveFocus] = useState(focusedVehicle);
  const [hovered, setHovered] = useState(null);
  const [bumpTime, setBumpTime] = useState(0);

  useEffect(() => {
    setActiveFocus(focusedVehicle);
  }, [focusedVehicle]);

  const handleSelect = (veh) => {
    setActiveFocus(veh);
    if (onFocusChange) onFocusChange(veh);
  };

  const ambRefs = { body: useRef(), spring: useRef(), piston: useRef() };
  const raceRefs = { body: useRef(), spring: useRef(), piston: useRef() };
  const controlsRef = useRef();

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-2xl select-none">
      {/* Botones de control y foco interactivo */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="p-1.5 rounded-2xl flex items-center gap-1.5 pointer-events-auto shadow-lg backdrop-blur-md bg-slate-900/85 border border-white/10 text-white text-xs font-semibold">
          <button
            onClick={() => handleSelect('ambulancia')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFocus === 'ambulancia' ? 'bg-blue-600 text-white shadow-md font-bold' : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            🚑 Ambulancia
          </button>
          <button
            onClick={() => handleSelect('carreras')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFocus === 'carreras' ? 'bg-rose-600 text-white shadow-md font-bold' : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            ⚡ Carro de Carreras (#95)
          </button>
          <button
            onClick={() => handleSelect(null)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFocus === null ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            🌐 Vista General
          </button>
        </div>

        <button
          onClick={() => setBumpTime((t) => t + 0.001)}
          className="pointer-events-auto px-3.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
        >
          💥 Impacto de Bache (5 cm)
        </button>
      </div>

      {/* Indicador de ayuda */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="backdrop-blur-md bg-slate-900/80 border border-white/10 text-slate-200 text-xs px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {activeFocus === 'ambulancia' && 'Enfocado: Suspensión Ambulancia (45° Zoom - Confort Clínico)'}
            {activeFocus === 'carreras' && 'Enfocado: Suspensión Rayo McQueen (45° Zoom - Rígido Deportivo)'}
            {activeFocus === null && 'Haz clic en un vehículo o botón para enfocar su suspensión a 45°'}
          </span>
        </div>
      </div>

      {/* Lienzo 3D Three.js */}
      <Canvas
        shadows
        style={{ width: '100%', height: '100%', cursor: hovered ? 'pointer' : 'grab' }}
      >
        <PerspectiveCamera makeDefault position={[0, 4.0, 7.8]} fov={48} />
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[8, 14, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={32}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-6, 8, -4]} intensity={0.4} color="#bfdbfe" />
        <Environment preset="city" />

        <CameraRig focusedVehicle={activeFocus} controlsRef={controlsRef} />
        <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.06} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={1.2} maxDistance={18} />

        <AmbulanceModel
          bodyRef={ambRefs.body}
          springRef={ambRefs.spring}
          pistonRef={ambRefs.piston}
          onClick={() => handleSelect('ambulancia')}
          isHovered={hovered === 'ambulancia'}
          onHover={setHovered}
        />

        <RacingCarModel
          bodyRef={raceRefs.body}
          springRef={raceRefs.spring}
          pistonRef={raceRefs.piston}
          onClick={() => handleSelect('carreras')}
          isHovered={hovered === 'carreras'}
          onHover={setHovered}
        />

        <TrackGround />

        <PhysicsController
          m={m}
          c={c}
          k={k}
          x0={x0}
          v0={v0}
          focusedVehicle={activeFocus}
          ambRefs={ambRefs}
          raceRefs={raceRefs}
          bumpTime={bumpTime}
        />
      </Canvas>
    </div>
  );
}
