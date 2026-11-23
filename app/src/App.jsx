import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SuspensionAnimation from './components/SuspensionAnimation';
import SimulationChart from './components/SimulationChart';
import MathDeductionView from './components/MathDeductionView';
import PresentationDeck from './components/PresentationDeck';
import FlashcardsModal from './components/FlashcardsModal';
import Vehicle3DScene from './components/Vehicle3DScene';
import SuspensionCalculator from './components/SuspensionCalculator';
import ClassComparisonView from './components/ClassComparisonView';
import {
  PRESETS,
  calculateOscillatorProperties, 
  calculateEngineeringMetrics, 
  rk4Integrate 
} from './physics/suspensionPhysics';
import {
  Sliders, Gauge, ShieldCheck, ChevronRight, Activity, HeartPulse, Trophy, Box, Eye,
  Calculator, X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'chart' | 'math' | 'calculator' | 'deck'
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [simViewMode, setSimViewMode] = useState('3d'); // '3d' | '2d'

  // Parámetros reactivos del sistema físico
  const [m, setM] = useState(300.0);
  const [k, setK] = useState(30000.0);
  const [c, setC] = useState(6000.0); // Inicia en crítico
  const [x0, setX0] = useState(0.05);
  const v0 = 0.0;

  // Disparador reactivo de perturbación (bache) para el modelo 3D
  const [bumpTrigger, setBumpTrigger] = useState(0);

  // Estado del vehículo enfocado para el visor 3D ('ambulancia' | 'carreras' | null)
  const [focusedVehicle, setFocusedVehicle] = useState(null);

  // Estados para enlazar deducción analítica directamente con diapositiva y modal en Exposición
  const [deckTargetSlide, setDeckTargetSlide] = useState(null);
  const [deckAutoOpenModal, setDeckAutoOpenModal] = useState(false);

  const handleNavigateToDeckSlide = (slideId) => {
    setDeckTargetSlide(slideId);
    setDeckAutoOpenModal(true);
    setActiveTab('deck');
  };

  // Propiedades analíticas y métricas computadas en vivo
  const { omega_n, c_cr, zeta, regimen } = useMemo(() => {
    return calculateOscillatorProperties(m, k, c);
  }, [m, k, c]);

  const { settlingTime, overshootPct } = useMemo(() => {
    const { t, x } = rk4Integrate(m, c, k, x0, v0, 3.0, 0.001);
    return calculateEngineeringMetrics(t, x, m, c, k, x0, v0);
  }, [m, c, k, x0, v0]);

  const applyPreset = (preset, vehicle = null) => {
    setM(preset.m);
    setK(preset.k);
    setC(preset.c);
    if (vehicle) {
      setFocusedVehicle(vehicle);
    } else if (preset.id === 'amb') {
      setFocusedVehicle('ambulancia');
    } else if (preset.id === 'race') {
      setFocusedVehicle('carreras');
    }
    // Provocar perturbación inmediata para ver el comportamiento en la simulación 3D
    setBumpTrigger((prev) => prev + 1);
  };

  const focusVehicle = (vehicle) => {
    if (vehicle && vehicle !== focusedVehicle) {
      const preset = vehicle === 'ambulancia' ? PRESETS.AMBULANCIA : PRESETS.CARRERAS;
      setM(preset.m);
      setK(preset.k);
      setC(preset.c);
      setBumpTrigger((prev) => prev + 1);
    }
    setFocusedVehicle(vehicle);
  };

  // Manejar tecla ESC para cerrar modal de la calculadora
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCalculatorModalOpen) {
        setIsCalculatorModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCalculatorModalOpen]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f1f4f8] text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      {/* Barra de Navegación Superior */}
      <div className="no-print">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        />
      </div>

      {/* Contenedor Principal */}
      <main className="flex-1 w-full max-w-[1480px] mx-auto p-3 sm:p-6 space-y-6 no-print">
        
        {/* ========================================================
            VISTA 1: LABORATORIO INTERACTIVO (SIMULADOR 3D + GRÁFICA)
            ======================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">

            {/* Portada editorial para presentar el objetivo y los resultados clave */}
            <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white/95 via-sky-50/50 to-amber-50/40 px-5 py-6 text-slate-900 shadow-[0_20px_50px_-20px_rgba(11,60,115,0.12)] backdrop-blur-xl sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute -right-24 -top-36 -z-10 h-96 w-96 rounded-full bg-[#0B3C73]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-44 left-[38%] -z-10 h-80 w-80 rounded-full bg-[#F5A800]/15 blur-3xl" />
              <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#0B3C73] sm:text-xs shadow-xs">
                    <Activity className="h-3.5 w-3.5 text-blue-700" /> Laboratorio de ecuaciones diferenciales
                  </div>
                  <h2 className="text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-[3.2rem]">
                    La física del movimiento,
                    <span className="mt-1 block text-[#0B3C73]">
                      a la vista con <span className="text-[#D97706]">dinamismo real.</span>
                    </span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base font-medium">
                    Comparamos la suspensión de una ambulancia y un auto deportivo. Ajusta masa, rigidez y amortiguamiento; observa cómo responde la carrocería ante un bache mediante solución analítica exacta e integración numérica RK4.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:w-[520px] lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 backdrop-blur shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Régimen actual</span>
                    <strong className="mt-1 block text-sm font-black text-slate-950 sm:text-base">{regimen}</strong>
                  </div>
                  <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 backdrop-blur shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Amortiguamiento</span>
                    <strong className="mt-1 block font-mono text-sm font-black text-amber-700 sm:text-base">ζ = {zeta.toFixed(2)}</strong>
                  </div>
                  <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 backdrop-blur shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Asentamiento (2%)</span>
                    <strong className="mt-1 block font-mono text-sm font-black text-[#0B3C73] sm:text-base">{settlingTime.toFixed(2)} s</strong>
                  </div>
                  <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 backdrop-blur shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Frecuencia natural</span>
                    <strong className="mt-1 block font-mono text-sm font-black text-slate-950 sm:text-base">ωₙ = {omega_n.toFixed(2)} rad/s</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* 1. Casos de estudio */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-[0_8px_24px_-18px_rgba(15,23,42,.35)] flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-800 xl:min-w-[205px]">
                <Sliders className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <span className="block">Prueba un caso</span>
                  <span className="block mt-0.5 text-[11px] font-medium leading-relaxed text-slate-600">Configuraciones para la exposición</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs xl:justify-end">
                <button
                  onClick={() => applyPreset(PRESETS.SUBAMORTIGUADO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 1800) < 50 && Math.abs(k - 30000) < 500
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title="Configurar régimen subamortiguado (c = 1800 N·s/m, ζ = 0.3) y probar rebote"
                >
                  1. Subamortiguado (0.3 ccr)
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.CRITICO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 6000) < 50 && Math.abs(k - 30000) < 500
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title="Configurar régimen críticamente amortiguado (c = 6000 N·s/m, ζ = 1.0) y probar retorno óptimo"
                >
                  2. Crítico (ccr = 6000)
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.SOBREAMORTIGUADO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 9000) < 50 && Math.abs(k - 30000) < 500
                      ? 'bg-purple-600 text-white border-purple-500 shadow-sm font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title="Configurar régimen sobreamortiguado (c = 9000 N·s/m, ζ = 1.5) y probar retorno lento"
                >
                  3. Sobreamortiguado (1.5 ccr)
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                <button
                  onClick={() => applyPreset(PRESETS.AMBULANCIA, 'ambulancia')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center gap-1.5 font-medium ${
                    focusedVehicle === 'ambulancia'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                      : 'bg-slate-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                  title="Enfocar Ambulancia Tipo III con amortiguamiento crítico (c = 6000 N·s/m)"
                >
                  <HeartPulse className={`w-3.5 h-3.5 ${focusedVehicle === 'ambulancia' ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Ambulancia</span>
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.CARRERAS, 'carreras')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center gap-1.5 font-medium ${
                    focusedVehicle === 'carreras'
                      ? 'bg-rose-600 text-white border-rose-500 shadow-sm font-bold'
                      : 'bg-slate-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                  }`}
                  title="Enfocar Koenigsegg Jesko con suspensión rígida deportiva (k = 50 kN/m, c = 8500 N·s/m)"
                >
                  <Trophy className={`w-3.5 h-3.5 ${focusedVehicle === 'carreras' ? 'text-white' : 'text-rose-600'}`} />
                  <span>Koenigsegg Jesko</span>
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* Nuevo Botón: Calculadora EDO Completa en Modal */}
                <button
                  onClick={() => setIsCalculatorModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-blue-400 bg-blue-50/90 hover:bg-blue-100 text-blue-900 font-bold transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
                  title="Abrir la Calculadora Analítica Paso a Paso (11 Pasos Matemáticos)"
                >
                  <Calculator className="w-3.5 h-3.5 text-blue-700" />
                  <span>Calculadora EDO</span>
                </button>
              </div>
            </div>

            {/* 2. Escenario 3D protagonista y controles de alto contraste */}
            <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
              <section className="flex flex-col rounded-[1.8rem] border border-slate-200 bg-white p-3.5 shadow-[0_12px_36px_-24px_rgba(15,23,42,.45)] sm:p-4 lg:col-span-7">
                <div className="mb-2 flex items-center justify-between gap-2 border-b border-slate-200 px-1 pb-3">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-700" />
                    <div>
                      <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-950">Visualización física</span>
                      <span className="mt-0.5 hidden text-[10px] font-medium text-slate-700 sm:block">Modelos a escala real y respuesta en carretera</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {simViewMode === '3d' && (
                      <button
                        onClick={() => setIsTechnicalModalOpen(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all cursor-pointer"
                        title="Lanzar Vista Técnica 3D en pantalla completa"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Vista Técnica</span>
                      </button>
                    )}
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-[11px] font-semibold">
                      <button onClick={() => setSimViewMode('3d')} className={`rounded-lg px-2.5 py-1.5 transition ${simViewMode === '3d' ? 'bg-white font-extrabold text-blue-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-700 hover:text-slate-950'}`}>Modelo 3D</button>
                      <button onClick={() => setSimViewMode('2d')} className={`rounded-lg px-2.5 py-1.5 transition ${simViewMode === '2d' ? 'bg-white font-extrabold text-blue-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-700 hover:text-slate-950'}`}>Diagrama 2D</button>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  {simViewMode === '3d' ? (
                    <Vehicle3DScene
                      m={m}
                      c={c}
                      k={k}
                      x0={x0}
                      v0={v0}
                      regimen={regimen}
                      zeta={zeta}
                      settlingTime={settlingTime}
                      overshootPct={overshootPct}
                      bumpTrigger={bumpTrigger}
                      focusedVehicle={focusedVehicle}
                      setFocusedVehicle={focusVehicle}
                      isTechnicalOpen={isTechnicalModalOpen}
                      setIsTechnicalOpen={setIsTechnicalModalOpen}
                    />
                  ) : (
                    <SuspensionAnimation m={m} c={c} k={k} x0={x0} v0={v0} regimen={regimen} settlingTime={settlingTime} overshootPct={overshootPct} />
                  )}
                </div>
              </section>

              <div className="flex flex-col gap-4 lg:col-span-5">
                <section className="space-y-4 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_-24px_rgba(15,23,42,.45)] sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><Sliders className="h-4 w-4" /></span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950">Ajusta el modelo</span>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-[11px] font-bold text-slate-800">ζ = {zeta.toFixed(2)} · {regimen}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-800">Amortiguamiento c</span>
                      <span className="font-mono text-sm font-extrabold text-amber-700">{c.toFixed(0)} N·s/m <span className="text-xs">({((c / c_cr) * 100).toFixed(0)}% ccr)</span></span>
                    </div>
                    <input type="range" min="0" max="12000" step="50" value={c} onChange={(e) => setC(parseFloat(e.target.value))} aria-label="Coeficiente de amortiguamiento c" className="h-2 w-full cursor-pointer rounded-lg bg-slate-200 accent-amber-500" />
                    <div className="grid grid-cols-3 gap-x-2 gap-y-1 font-mono text-[10px] font-semibold text-slate-700 sm:flex sm:justify-between">
                      <span>0 · libre</span><span className="text-blue-700">1800 · 0.3 ccr</span><span className="text-amber-700">6000 · crítico</span><span className="text-purple-700">9000 · 1.5 ccr</span><span>12000 N·s/m</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-3 sm:grid-cols-3">
                    <label className="space-y-1">
                      <span className="flex justify-between gap-1 text-[11px] font-semibold text-slate-800"><span>Masa m</span><strong className="font-mono text-blue-800">{m} kg</strong></span>
                      <input type="range" min="100" max="800" step="10" value={m} onChange={(e) => setM(parseFloat(e.target.value))} aria-label="Masa m" className="h-1.5 w-full cursor-pointer rounded bg-slate-200 accent-blue-700" />
                    </label>
                    <label className="space-y-1">
                      <span className="flex justify-between gap-1 text-[11px] font-semibold text-slate-800"><span>Rigidez k</span><strong className="font-mono text-amber-800">{(k / 1000).toFixed(0)} kN/m</strong></span>
                      <input type="range" min="10000" max="60000" step="1000" value={k} onChange={(e) => setK(parseFloat(e.target.value))} aria-label="Rigidez k" className="h-1.5 w-full cursor-pointer rounded bg-slate-200 accent-amber-600" />
                    </label>
                    <label className="space-y-1">
                      <span className="flex justify-between gap-1 text-[11px] font-semibold text-slate-800"><span>Bache x(0)</span><strong className="font-mono text-emerald-800">{(x0 * 100).toFixed(0)} cm</strong></span>
                      <input type="range" min="0.01" max="0.15" step="0.01" value={x0} onChange={(e) => setX0(parseFloat(e.target.value))} aria-label="Altura inicial del bache" className="h-1.5 w-full cursor-pointer rounded bg-slate-200 accent-emerald-600" />
                    </label>
                  </div>
                  <p className="border-t border-slate-200 pt-3 text-[11px] leading-relaxed text-slate-700">{focusedVehicle === null ? 'Ambos reciben el mismo bache; el Koenigsegg responde con una suspensión más firme. Los deslizadores ajustan ambos sistemas conservando esa diferencia.' : 'Los cambios se aplican al vehículo seleccionado. El otro conserva su configuración de referencia.'}</p>
                </section>

                <section className="relative isolate overflow-hidden rounded-[1.6rem] border border-blue-200/70 bg-gradient-to-br from-white/95 via-blue-50/40 to-amber-50/30 p-4 text-slate-900 shadow-sm sm:p-5">
                  <div className="pointer-events-none absolute -right-8 -top-10 -z-10 h-32 w-32 rounded-full bg-[#0B3C73]/10 blur-2xl" />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0B3C73]">Lectura rápida</span>
                      <h3 className="mt-1 text-base font-black text-slate-950">¿Qué nos dicen los valores?</h3>
                    </div>
                    <Gauge className="h-7 w-7 shrink-0 text-amber-600" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-2xs">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Masa</span>
                      <strong className="mt-1 block text-sm font-black text-slate-950">{m} <small className="text-[10px] text-slate-500 font-normal">kg</small></strong>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-2xs">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Rigidez</span>
                      <strong className="mt-1 block text-sm font-black text-slate-950">{(k / 1000).toFixed(0)} <small className="text-[10px] text-slate-500 font-normal">kN/m</small></strong>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 shadow-2xs">
                      <span className="block text-[10px] font-bold text-amber-800 uppercase">Sobreimpulso</span>
                      <strong className="mt-1 block text-sm font-black text-amber-700">{overshootPct.toFixed(1)}%</strong>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-700 font-medium">
                    {zeta < 1 ? 'El auto rebota varias veces antes de estabilizarse (amortiguamiento subcrítico).' : zeta > 1 ? 'La carrocería vuelve sin oscilar y tarda más en asentarse (modo dominante lento).' : 'El sistema vuelve al equilibrio con la máxima rapidez física y sin ningún rebote (óptimo para ambulancia).'}
                  </p>
                </section>
              </div>
            </div>

            {/* Verificación numérica a todo el ancho para facilitar su lectura 
            <section className="rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_-24px_rgba(15,23,42,.45)] sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-blue-800"><Activity className="h-3.5 w-3.5" /> Respuesta dinámica</div>
                  <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">Solución exacta y simulación RK4</h3>
                </div>
                <p className="max-w-xl text-xs leading-relaxed text-slate-700">Compara el movimiento calculado con el modelo analítico y el método numérico de cuarto orden.</p>
              </div>
              <div className="min-h-[450px]"><SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} /></div>
            </section>*/}

            {/* 3. Banner Informativo de Conclusión de Ingeniería 
            <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/80 p-5 rounded-2xl border border-amber-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 mt-0.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                    Conclusión de Ingeniería: ¿Qué amortiguador elegir y por qué?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Para la <strong>Ambulancia</strong> elegimos amortiguamiento crítico (<strong>c = 6000 N·s/m</strong>): sobreimpulso del <strong>0.00%</strong> y retorno en <strong>0.58 s</strong> para no generar rebotes al paciente.  
                    Para el <strong>Koenigsegg Jesko</strong> se usa amortiguamiento firme para reducir el balanceo de carrocería y mantener la adherencia de los neumáticos.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('deck')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Ver Exposición 15 Min</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>*/}

          </div>
        )}

        {/* ========================================================
            VISTA 2: GRÁFICA DE SUPERPOSICIÓN (PROFUNDIDAD TÉCNICA)
            ======================================================== */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#0f172a]">
                  Verificación Computacional: Solución Exacta vs. Algoritmo Numérico RK4
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Demostración del cumplimiento de la regla de oro: la simulación numérica de cuarto orden valida milimétricamente la solución analítica deducida a mano.
                </p>
              </div>
              <div className="min-h-[480px]">
                <SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VISTA 3: DEDUCCIÓN MATEMÁTICA A MANO (RÚBRICA 1.0)
            ======================================================== */}
        {activeTab === 'math' && (
          <MathDeductionView onNavigateToSlide={handleNavigateToDeckSlide} />
        )}

        {/* ========================================================
            VISTA 4: CALCULADORA ANALÍTICA DE SUSPENSIÓN (NUEVA)
            ======================================================== */}
        {activeTab === 'calculator' && (
          <SuspensionCalculator
            m={m}
            setM={setM}
            c={c}
            setC={setC}
            k={k}
            setK={setK}
            x0={x0}
            setX0={setX0}
          />
        )}

        {/* ========================================================
            VISTA 5: COMPARATIVA DIDÁCTICA (CLASE VS WEB)
            ======================================================== */}
        {activeTab === 'comparison' && (
          <ClassComparisonView />
        )}

        {/* ========================================================
            VISTA 6: MODO EXPOSICIÓN (SLIDE DECK 15 MINUTOS)
            ======================================================== */}
        {activeTab === 'deck' && (
          <PresentationDeck
            m={m}
            c={c}
            k={k}
            x0={x0}
            v0={v0}
            regimen={regimen}
            settlingTime={settlingTime}
            overshootPct={overshootPct}
            targetSlideId={deckTargetSlide}
            autoOpenModal={deckAutoOpenModal}
          />
        )}

      </main>

      {/* Modal de Flashcards de Estudio 5.0 */}
      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
      />

      {/* Modal Interactivo de la Calculadora EDO (Activado desde Laboratorio) */}
      {isCalculatorModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsCalculatorModalOpen(false)}
        >
          <div
            className="liquid-glass bg-white text-slate-900 border border-white/90 shadow-2xl rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del modal */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-gradient-to-r from-blue-50/90 to-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#0B3C73] text-white shadow-md">
                  <Calculator className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0B3C73] border border-blue-200">
                      Laboratorio · Análisis Paso a Paso
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                      m = {m} kg · k = {(k / 1000).toFixed(0)} kN/m · c = {c.toFixed(0)} N·s/m
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight mt-0.5">
                    Calculadora Analítica Completa (11 Pasos Matemáticos)
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsCalculatorModalOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Cerrar calculadora (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido de la Calculadora con Scroll */}
            <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
              <SuspensionCalculator
                m={m}
                setM={setM}
                c={c}
                setC={setC}
                k={k}
                setK={setK}
                x0={x0}
                setX0={setX0}
              />
            </div>

            {/* Pie del modal */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600">
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                Sincronizado en tiempo real con los deslizadores del laboratorio y la simulación 3D.
              </span>
              <button
                onClick={() => setIsCalculatorModalOpen(false)}
                className="liquid-glass-button-gold px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ml-auto"
              >
                Cerrar Calculadora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pie de Página Formal Unimayor */}
      <footer className="w-full border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 px-4 sm:px-6 text-xs text-slate-600 mt-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0f172a]">Institución Universitaria Colegio Mayor del Cauca</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="text-slate-600">Ecuaciones Diferenciales (Unidad 3)</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Grupo 5: Angela Cruz · Duban Gómez · José Torres · Rubén Velasco
          </div>

          <div className="text-[10px] text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Declaración IA: Desarrollado con asistencia de Antigravity AI
          </div>
        </div>
      </footer>
    </div>
  );
}
