import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Gauge, Sparkles } from 'lucide-react';
import { exactAnalyticalSolution } from '../physics/suspensionPhysics';

export default function SuspensionAnimation({
  m,
  c,
  k,
  x0,
  v0 = 0,
  regimen,
  settlingTime,
  overshootPct
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 1.0x o 0.5x
  const requestRef = useRef(null);
  const lastTimestampRef = useRef(null);

  // Desplazamiento actual evaluado con la solución física exacta
  const currentDisplacement = exactAnalyticalSolution(currentTime, m, c, k, x0, v0);

  // Velocidad aproximada evaluada con derivada numérica rápida
  const dtVel = 0.001;
  const nextDisp = exactAnalyticalSolution(currentTime + dtVel, m, c, k, x0, v0);
  const currentVelocity = (nextDisp - currentDisplacement) / dtVel;

  // Bucle de animación suave a 60/120 FPS
  useEffect(() => {
    const animate = (timestamp) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + deltaSec * playbackSpeed;
          if (nextTime >= 3.0) {
            return 3.0; // Se queda en reposo al final de los 3s
          }
          return nextTime;
        });
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, playbackSpeed]);

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastTimestampRef.current = null;
  };

  const handleTriggerBump = () => {
    handleReset();
  };

  // Factores de escalado para visualización SVG
  // x0 = 0.05 m (5 cm) equivale a una deflexión visual de ~65 píxeles
  const visualScale = 1300; // px por metro (0.05m * 1300 = 65px)
  const chassisOffsetY = -currentDisplacement * visualScale; // Subir o bajar

  // Coordenadas base del SVG
  const width = 420;
  const height = 480;
  const centerX = width / 2;
  const groundY = 410;
  const wheelRadius = 38;
  const wheelCenterY = groundY - wheelRadius;
  const axleY = wheelCenterY;

  // Posición de la masa (carrocería)
  const baseChassisY = 140;
  const chassisY = baseChassisY + chassisOffsetY;

  // Generador dinámico de espiras de resorte SVG
  const springTopY = chassisY + 45;
  const springBottomY = axleY - 15;
  const springHeight = springBottomY - springTopY;
  const springX = centerX - 42;
  const coils = 7;
  const coilHeight = springHeight / coils;
  const coilWidth = 16;

  let springPath = `M ${springX} ${springTopY}`;
  for (let i = 0; i < coils; i++) {
    const y1 = springTopY + i * coilHeight + coilHeight * 0.25;
    const y2 = springTopY + i * coilHeight + coilHeight * 0.75;
    const y3 = springTopY + (i + 1) * coilHeight;
    springPath += ` Q ${springX - coilWidth} ${y1}, ${springX} ${y1 + coilHeight * 0.25}`;
    springPath += ` Q ${springX + coilWidth} ${y2}, ${springX} ${y3}`;
  }

  // Dimensiones del amortiguador (Damper)
  const damperX = centerX + 42;
  const pistonRodTopY = chassisY + 45;
  const cylinderBottomY = axleY - 15;
  const cylinderHeight = 85;
  const cylinderTopY = cylinderBottomY - cylinderHeight;
  const pistonHeadY = Math.min(Math.max(pistonRodTopY + 35, cylinderTopY + 10), cylinderBottomY - 10);

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Cabecera del visualizador */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#F5A800] animate-pulse" />
          <span className="text-sm font-semibold tracking-wide text-slate-800">
            Animación en Tiempo Real (Cuarto de Carro)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            t = {currentTime.toFixed(2)} s / 3.00 s
          </span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            regimen.includes('Crítico')
              ? 'bg-amber-50 text-amber-800 border border-amber-300'
              : regimen.includes('Sub')
              ? 'bg-blue-50 text-blue-800 border border-blue-300'
              : 'bg-purple-50 text-purple-800 border border-purple-300'
          }`}>
            {regimen}
          </span>
        </div>
      </div>

      {/* Contenedor SVG con fondo claro y acabado limpio */}
      <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-b from-white to-[#fbfaf8] rounded-xl border border-slate-200/90 overflow-hidden shadow-inner">
        {/* Fondo con rejilla técnica sutil de puntos grises claros */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b838_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none" />

        {/* Línea de Equilibrio Estático (x = 0) */}
        <div 
          className="absolute left-4 right-4 border-b border-dashed border-slate-400/60 pointer-events-none flex justify-between text-[10px] text-slate-500"
          style={{ top: `${(baseChassisY / height) * 100}%` }}
        >
          <span className="bg-white/95 border border-slate-200/80 px-1.5 py-0.5 rounded shadow-xs text-slate-600 font-medium -translate-y-1/2">
            Equilibrio x = 0
          </span>
          <span className="bg-white/95 border border-slate-200/80 px-1.5 py-0.5 rounded shadow-xs text-slate-600 font-medium -translate-y-1/2">
            Línea Neutra
          </span>
        </div>

        {/* Línea de Bache Inicial (+5 cm) */}
        <div 
          className="absolute left-4 right-4 border-b border-dotted border-amber-500/60 pointer-events-none flex justify-between text-[10px] text-amber-700"
          style={{ top: `${((baseChassisY - 0.05 * visualScale) / height) * 100}%` }}
        >
          <span className="bg-amber-50/95 border border-amber-200/90 px-1.5 py-0.5 rounded shadow-xs text-amber-800 font-semibold -translate-y-1/2">
            +5 cm (Bache)
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[380px]">
          <defs>
            {/* Gradiente Chasis Azul Vibrante Institucional */}
            <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0B3C73" stopOpacity="0.98" />
            </linearGradient>

            {/* Gradiente Cilindro Amortiguador Metálico Oscuro */}
            <linearGradient id="damperCylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Gradiente Vástago Pistón Metálico Oscuro */}
            <linearGradient id="damperRodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Sombra de caída suave para fondo claro */}
            <filter id="liquidShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* ========================================================
              1. PISO / CARRETERA Y PERFIL DE BACHE
              ======================================================== */}
          <line x1="20" y1={groundY} x2={width - 20} y2={groundY} stroke="#334155" strokeWidth="4" />
          <path d={`M 20 ${groundY} L 120 ${groundY} Q 140 ${groundY - 14} 160 ${groundY} L ${width - 20} ${groundY}`} 
                fill="none" stroke="#F5A800" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.85" />
          <text x="140" y={groundY + 18} fill="#475569" fontSize="10" fontWeight="500" textAnchor="middle">
            Perfil Asfáltico (Bache 5 cm)
          </text>

          {/* ========================================================
              2. RUEDA / NEUMÁTICO (EJE FIJO EN CONTACTO CON EL PISO)
              ======================================================== */}
          {/* Neumático exterior de goma */}
          <circle cx={centerX} cy={wheelCenterY} r={wheelRadius} fill="#111827" stroke="#374151" strokeWidth="6" />
          {/* Rin central Unimayor con borde dorado */}
          <circle cx={centerX} cy={wheelCenterY} r={wheelRadius - 12} fill="#1f2937" stroke="#F5A800" strokeWidth="2.5" />
          {/* Eje de la rueda */}
          <circle cx={centerX} cy={wheelCenterY} r="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <text x={centerX} y={wheelCenterY + 4} fill="#111827" fontSize="8" fontWeight="bold" textAnchor="middle">
            U
          </text>

          {/* Barra inferior que une el eje a la suspensión */}
          <path d={`M ${springX} ${axleY - 15} L ${damperX} ${axleY - 15} M ${centerX} ${axleY - 15} L ${centerX} ${wheelCenterY}`}
                stroke="#475569" strokeWidth="4" strokeLinecap="round" />

          {/* ========================================================
              3. RESORTE ELÁSTICO PARAMÉTRICO (k = 30 000 N/m)
              ======================================================== */}
          <path d={springPath} fill="none" stroke="#F5A800" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
                filter="url(#liquidShadow)" />
          {/* Placas de montaje del resorte */}
          <rect x={springX - 16} y={springTopY - 4} width="32" height="6" rx="2" fill="#F5A800" />
          <rect x={springX - 16} y={springBottomY - 2} width="32" height="6" rx="2" fill="#F5A800" />

          {/* Etiqueta Resorte k */}
          <text x={springX - 22} y={springTopY + springHeight / 2} fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="end">
            k = {k.toLocaleString()} N/m
          </text>

          {/* ========================================================
              4. AMORTIGUADOR HIDRÁULICO (c)
              ======================================================== */}
          {/* Cilindro exterior metálico oscuro */}
          <rect x={damperX - 12} y={cylinderTopY} width="24" height={cylinderHeight} rx="3" 
                fill="url(#damperCylinderGrad)" stroke="#1e293b" strokeWidth="1.5" />
          {/* Fluido interno reflectante */}
          <rect x={damperX - 9} y={cylinderTopY + 4} width="18" height={cylinderHeight - 8} rx="2" 
                fill="#0284c7" opacity="0.35" />

          {/* Vástago del pistón que entra y sale */}
          <line x1={damperX} y1={pistonRodTopY} x2={damperX} y2={pistonHeadY} 
                stroke="url(#damperRodGrad)" strokeWidth="6" strokeLinecap="round" />
          {/* Cabeza del pistón dentro del fluido */}
          <rect x={damperX - 10} y={pistonHeadY - 4} width="20" height="8" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="1" />

          {/* Placas de montaje del amortiguador metálicas oscuras */}
          <rect x={damperX - 16} y={pistonRodTopY - 4} width="32" height="6" rx="2" fill="#334155" />
          <rect x={damperX - 16} y={cylinderBottomY - 2} width="32" height="6" rx="2" fill="#334155" />

          {/* Etiqueta Amortiguador c */}
          <text x={damperX + 22} y={cylinderTopY + cylinderHeight / 2} fill="#0369a1" fontSize="11" fontWeight="bold" textAnchor="start">
            c = {c.toFixed(0)} N·s/m
          </text>

          {/* ========================================================
              5. CARROCERÍA / MASA SUSPENDIDA (m = 300 kg)
              ======================================================== */}
          <g transform={`translate(0, ${chassisOffsetY})`} filter="url(#liquidShadow)">
            {/* Bloque de masa con estilo azul profundo */}
            <rect x={centerX - 110} y={baseChassisY - 60} width="220" height="75" rx="14" 
                  fill="url(#chassisGrad)" stroke="#072242" strokeWidth="1.5" />
            
            {/* Brillo especular superior */}
            <path d={`M ${centerX - 100} ${baseChassisY - 56} L ${centerX + 100} ${baseChassisY - 56}`} 
                  stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Texto de Masa y Carrocería */}
            <text x={centerX} y={baseChassisY - 32} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
              MASA SUSPENDIDA: m = {m} kg
            </text>
            <text x={centerX} y={baseChassisY - 14} fill="#F5A800" fontSize="11" fontWeight="600" textAnchor="middle">
              1/4 de la Carrocería del Vehículo
            </text>

            {/* Flecha indicadora de desplazamiento en vivo */}
            <circle cx={centerX} cy={baseChassisY + 12} r="4" fill="#0284c7" />
            <line x1={centerX} y1={baseChassisY + 15} x2={centerX} y2={baseChassisY + 38} stroke="#0284c7" strokeWidth="2" strokeDasharray="3,2" />
          </g>
        </svg>

        {/* HUD en vivo de Desplazamiento y Velocidad (White Card con sombra sutil) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-xs flex flex-col gap-1.5 shadow-md shadow-slate-200/50">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Gauge className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium">Desplazamiento x(t):</span>
            <span className="font-mono font-bold text-amber-700">
              {(currentDisplacement * 100).toFixed(2)} cm ({currentDisplacement.toFixed(4)} m)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">Velocidad x'(t):</span>
            <span className="font-mono font-bold text-blue-700">
              {currentVelocity.toFixed(3)} m/s
            </span>
          </div>
        </div>
      </div>

      {/* Controles de Reproducción y Experimento */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg flex items-center justify-center bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 backdrop-blur-md shadow-xs transition-all active:translate-y-0.5"
            title={isPlaying ? 'Pausar' : 'Reanudar'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-slate-700" /> : <Play className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg flex items-center justify-center bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 backdrop-blur-md shadow-xs transition-all active:translate-y-0.5"
            title="Reiniciar a t=0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setPlaybackSpeed(0.5)}
              className={`px-2 py-1 rounded transition-colors ${playbackSpeed === 0.5 ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              0.5x
            </button>
            <button
              onClick={() => setPlaybackSpeed(1.0)}
              className={`px-2 py-1 rounded transition-colors ${playbackSpeed === 1.0 ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              1.0x
            </button>
          </div>
        </div>

        <button
          onClick={handleTriggerBump}
          className="liquid-glass-button-gold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer text-slate-900 font-semibold shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          ¡Pasar por el Bache (5 cm)!
        </button>
      </div>
    </div>
  );
}
