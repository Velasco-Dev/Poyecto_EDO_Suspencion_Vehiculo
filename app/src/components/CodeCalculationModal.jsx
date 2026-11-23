import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Code2, Copy, Check, Terminal, BookOpen, Layers, 
  Sparkles, ArrowRight, Laptop, Cpu, Activity, Play, 
  RotateCcw, Sliders, CheckCircle2, ChevronRight, Gauge,
  Split, Flame, Compass
} from 'lucide-react';
import KaTeXMath from './KaTeXMath';
import { SLIDES_CODE_MAPPING } from '../data/slidesCodeData';
import { exactAnalyticalSolution, calculateOscillatorProperties } from '../physics/suspensionPhysics';

export default function CodeCalculationModal({ 
  isOpen, 
  onClose, 
  slideId = 1, 
  m = 300, 
  c = 6000, 
  k = 30000, 
  x0 = 0.05, 
  v0 = 0.0, 
  regimen = 'Críticamente amortiguado', 
  settlingTime = 0.58, 
  overshootPct = 0.0 
}) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [activeViewTab, setActiveViewTab] = useState('comparativa'); // 'deduccion' | 'codigo' | 'aplicacion' | 'comparativa'
  const [codeLang, setCodeLang] = useState('js'); // 'js' | 'python'
  const [copied, setCopied] = useState(false);

  // Estado del mini-simulador interactivo en vivo
  const [simTime, setSimTime] = useState(0.0);
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  const slideData = SLIDES_CODE_MAPPING[slideId] || SLIDES_CODE_MAPPING[1];

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Resetear al cambiar diapositiva o abrir modal
  useEffect(() => {
    setActiveItemIndex(0);
    setCopied(false);
    setSimTime(0.0);
    setIsSimPlaying(false);
  }, [slideId, isOpen]);

  // Loop de simulación temporal del mini-simulador
  useEffect(() => {
    if (!isSimPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setSimTime((prev) => {
        const next = prev + delta;
        if (next >= 3.0) {
          setIsSimPlaying(false);
          return 3.0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSimPlaying]);

  if (!isOpen || !slideData) return null;

  const currentItem = slideData.items[activeItemIndex] || slideData.items[0];
  const activeCodeObj = codeLang === 'js' ? currentItem.js : currentItem.python;

  const liveParams = {
    m: m || 300,
    c: c || 6000,
    k: k || 30000,
    x0: x0 !== undefined ? x0 : 0.05,
    v0: v0 !== undefined ? v0 : 0.0,
    regimen: regimen || 'Críticamente amortiguado',
    settlingTime: settlingTime || 0.58,
    overshootPct: overshootPct !== undefined ? overshootPct : 0.0
  };

  const { omega_n, zeta } = calculateOscillatorProperties(liveParams.m, liveParams.k, liveParams.c);

  // Evaluación en tiempo actual del simulador
  const currentDisplacement = exactAnalyticalSolution(
    simTime,
    liveParams.m,
    liveParams.c,
    liveParams.k,
    liveParams.x0,
    liveParams.v0
  );

  const handleCopyCode = () => {
    if (activeCodeObj?.snippet) {
      navigator.clipboard.writeText(activeCodeObj.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTriggerBump = () => {
    setSimTime(0.0);
    setIsSimPlaying(true);
  };

  // Generador de puntos SVG para la mini-gráfica analítica
  const generateSvgPath = () => {
    const width = 460;
    const height = 150;
    const paddingX = 35;
    const paddingY = 20;
    const plotW = width - paddingX * 2;
    const plotH = height - paddingY * 2;
    const midY = paddingY + plotH / 2;

    const maxAbs = Math.max(0.06, Math.abs(liveParams.x0) * 1.25);
    const scaleY = (plotH / 2) / maxAbs;

    const steps = 120;
    let pathD = '';

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 3.0;
      const xVal = exactAnalyticalSolution(t, liveParams.m, liveParams.c, liveParams.k, liveParams.x0, liveParams.v0);
      const px = paddingX + (t / 3.0) * plotW;
      const py = midY - xVal * scaleY;

      if (i === 0) {
        pathD += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
      } else {
        pathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
    }

    const currentPx = paddingX + (simTime / 3.0) * plotW;
    const currentPy = midY - currentDisplacement * scaleY;

    return { pathD, currentPx, currentPy, width, height, midY, paddingX, plotW, plotH, scaleY };
  };

  const svgData = generateSvgPath();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      {/* Contenedor Principal del Modal con Diseño Liquid Glass */}
      <div 
        className="liquid-glass bg-white/95 text-slate-900 border border-white/90 shadow-2xl rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glows de fondo institucionales */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#0B3C73]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#F5A800]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado del Modal */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 relative z-10 bg-gradient-to-r from-slate-50/95 via-blue-50/50 to-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0B3C73] text-white shadow-md">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0B3C73] border border-blue-200">
                  Diapositiva {slideId} · {slideData.speaker.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
                  Deducción Analítica & Código en Vivo
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight mt-0.5">
                {slideData.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de Pestañas de Vista */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold border border-slate-300">
              <button
                onClick={() => setActiveViewTab('comparativa')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeViewTab === 'comparativa'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Ver las 3 secciones integradas (Deducción + Código + App)"
              >
                <Split className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Comparativa Total</span>
                <span className="md:hidden">Total</span>
              </button>

              <button
                onClick={() => setActiveViewTab('deduccion')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeViewTab === 'deduccion'
                    ? 'bg-[#0B3C73] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Ver deducción matemática analítica paso a paso"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Deducción</span>
              </button>

              <button
                onClick={() => setActiveViewTab('codigo')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeViewTab === 'codigo'
                    ? 'bg-[#0B3C73] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Ver implementación en código (JS / Python)"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Código</span>
              </button>

              <button
                onClick={() => setActiveViewTab('aplicacion')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeViewTab === 'aplicacion'
                    ? 'bg-[#0B3C73] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Ver cómo se refleja en la aplicación en tiempo real"
              >
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulador</span>
              </button>
            </div>

            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Cerrar modal (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Sub-Operaciones si la diapositiva tiene varios cálculos */}
        {slideData.items.length > 1 && (
          <div className="px-4 sm:px-5 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center gap-2 overflow-x-auto relative z-10 shrink-0">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#0B3C73]" />
              Sección:
            </span>
            {slideData.items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItemIndex(idx);
                  setCopied(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeItemIndex === idx
                    ? 'bg-[#0B3C73] text-white shadow-sm'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                <span>{item.title}</span>
                {activeItemIndex === idx && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        )}

        {/* Contenido Desplazable del Modal */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1 relative z-10 text-xs sm:text-sm">
          
          {/* =========================================================================
              VISTA 1: DEDUCCIÓN MATEMÁTICA FORMAL (Cuando está en 'deduccion' o 'comparativa')
              ========================================================================= */}
          {(activeViewTab === 'deduccion' || activeViewTab === 'comparativa') && (
            <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/70 to-white p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-700 text-white shadow-2xs">
                    <BookOpen className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-900 block">
                      Rúbrica 1.0 · Deducción Analítica a Mano
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-950">
                      {currentItem.title}
                    </h4>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                  Fundamento Matemático Riguroso
                </span>
              </div>

              {/* Fundamento Teórico Físico */}
              {currentItem.theory && (
                <div className="p-3 rounded-xl bg-white/90 border border-blue-100/90 shadow-2xs text-slate-800 leading-relaxed">
                  <span className="text-[11px] font-black text-[#0B3C73] uppercase tracking-wide block mb-1">
                    📖 Principio Teórico:
                  </span>
                  <p className="text-xs sm:text-[13px]">{currentItem.theory}</p>
                </div>
              )}

              {/* Fórmula Maestra */}
              <div className="p-3.5 bg-white rounded-xl border border-blue-200/90 shadow-inner overflow-x-auto text-center my-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Ecuación o Expresión Matemática Cerrada
                </span>
                <KaTeXMath math={currentItem.mathFormula} block={true} />
              </div>

              {/* Pasos Analíticos Detallados */}
              {currentItem.deductionSteps && currentItem.deductionSteps.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider block">
                    📐 Desarrollo Algebraico Paso a Paso:
                  </span>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentItem.deductionSteps.map((s, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 transition-all hover:border-blue-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-black text-[11px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-[13px]">
                            {s.step}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 overflow-x-auto text-center">
                          <KaTeXMath math={s.math} block={true} />
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium pl-7">
                          {s.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-slate-700 font-medium leading-relaxed text-xs sm:text-[13px] bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                💡 <strong className="text-slate-950">Interpretación Física:</strong> {currentItem.explanation}
              </p>
            </div>
          )}

          {/* =========================================================================
              VISTA 2: CÓDIGO FUENTE IMPLEMENTADO (Cuando está en 'codigo' o 'comparativa')
              ========================================================================= */}
          {(activeViewTab === 'codigo' || activeViewTab === 'comparativa') && (
            <div className="rounded-2xl border border-slate-800 bg-[#06101E] text-slate-100 p-4 sm:p-5 shadow-lg space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shadow-2xs font-bold">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                      Implementación en Software
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      Mapeo a Código: {activeCodeObj.file}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Selector JS / Python */}
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-xl text-xs font-bold border border-slate-700">
                    <button
                      onClick={() => setCodeLang('js')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        codeLang === 'js'
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>JS (React)</span>
                    </button>
                    <button
                      onClick={() => setCodeLang('python')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        codeLang === 'python'
                          ? 'bg-[#0B3C73] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      <span>Python</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer border border-slate-700"
                    title="Copiar código al portapapeles"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mapeo de Variables Matemáticas <-> Código */}
              <div className="bg-[#0B1A2F] p-3 rounded-xl border border-slate-700/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold block mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Correspondencia Exacta de Variables (Fórmula ↔ Código):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentItem.variables.map((v, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[#050D18] border border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono text-[11px] font-bold text-amber-300">
                          <KaTeXMath math={v.symbol} block={false} />
                        </span>
                        <span className="font-mono text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-800/60">
                          {v.name}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-200 mt-1">
                        {typeof v.value === 'function' ? v.value(liveParams) : v.value}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                        {v.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloque de Código con Syntax Highlighting */}
              <div className="rounded-xl border border-slate-800 bg-[#030811] p-3.5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-emerald-300 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-850 pb-1.5 mb-2 font-mono">
                  <span>{activeCodeObj.file}</span>
                  <span>{activeCodeObj.lines}</span>
                </div>
                <pre className="m-0 whitespace-pre">
                  <code>{activeCodeObj.snippet}</code>
                </pre>
              </div>

              {/* Evaluación Aritmética Paso a Paso con Parámetros Activos */}
              {currentItem.liveEvaluation && (
                <div className="bg-[#091B33] p-3 rounded-xl border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Evaluación Aritmética con Parámetros Actuales del Slider:
                    </span>
                    <span className="text-[9px] font-mono text-amber-200 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/50">
                      m={liveParams.m}kg · k={liveParams.k}N/m · c={liveParams.c}N·s/m
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentItem.liveEvaluation(liveParams).map((step, i) => (
                      <div key={i} className="p-2.5 bg-[#050D18] rounded-lg border border-slate-700 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-slate-300 mb-0.5">
                          {step.label}:
                        </span>
                        <div className="my-0.5 text-amber-200 overflow-x-auto py-0.5">
                          <KaTeXMath math={step.formula} block={false} />
                        </div>
                        <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">Valor:</span>
                          <span className="font-mono font-bold text-amber-400">
                            {step.result}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VISTA 3: REFLEJO EN LA APLICACIÓN & SIMULADOR EN VIVO (Cuando está en 'aplicacion' o 'comparativa')
              ========================================================================= */}
          {(activeViewTab === 'aplicacion' || activeViewTab === 'comparativa') && (
            <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shadow-2xs font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                      Demostración Dinámica en Tiempo Real
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-950">
                      Lo que se muestra en la Aplicación: {currentItem.appReflection?.uiLocation || 'Gráfica & 3D'}
                    </h4>
                  </div>
                </div>

                {/* Botón de Bache de Prueba en Vivo */}
                <button
                  onClick={handleTriggerBump}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  title="Generar perturbación vertical instantánea de 5 cm"
                >
                  <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span>💥 Simular Bache (5 cm)</span>
                </button>
              </div>

              {/* Explicación del Reflejo en la App */}
              {currentItem.appReflection && (
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Elemento en la UI: {currentItem.appReflection.uiLocation}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                    {currentItem.appReflection.whatItShows}
                  </p>
                  <p className="text-[11px] text-amber-900 font-bold">
                    🚗 Comportamiento del vehículo: {currentItem.appReflection.effectOnCar}
                  </p>
                </div>
              )}

              {/* Mini-Simulador Interactivo con Gráfica SVG y Animación de Pistón */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                {/* Mini Gráfica SVG en Vivo */}
                <div className="md:col-span-2 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-blue-600" />
                      Trayectoria Analítica Exacta x(t) [0 a 3.0 s]
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      t = {simTime.toFixed(2)} s · x(t) = {(currentDisplacement * 100).toFixed(2)} cm
                    </span>
                  </div>

                  {/* Canvas SVG */}
                  <div className="w-full h-36 bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center p-1">
                    <svg viewBox={`0 0 ${svgData.width} ${svgData.height}`} className="w-full h-full">
                      {/* Ejes y líneas de referencia */}
                      <line 
                        x1={svgData.paddingX} 
                        y1={svgData.midY} 
                        x2={svgData.width - svgData.paddingX} 
                        y2={svgData.midY} 
                        stroke="#475569" 
                        strokeWidth="1" 
                        strokeDasharray="3 3" 
                      />
                      {/* Banda del 2% (+1 mm y -1 mm) */}
                      <line 
                        x1={svgData.paddingX} 
                        y1={svgData.midY - 0.001 * svgData.scaleY} 
                        x2={svgData.width - svgData.paddingX} 
                        y2={svgData.midY - 0.001 * svgData.scaleY} 
                        stroke="#059669" 
                        strokeWidth="0.8" 
                        strokeDasharray="2 2" 
                      />
                      <line 
                        x1={svgData.paddingX} 
                        y1={svgData.midY + 0.001 * svgData.scaleY} 
                        x2={svgData.width - svgData.paddingX} 
                        y2={svgData.midY + 0.001 * svgData.scaleY} 
                        stroke="#059669" 
                        strokeWidth="0.8" 
                        strokeDasharray="2 2" 
                      />

                      {/* Curva matemática trazada */}
                      <path 
                        d={svgData.pathD} 
                        fill="none" 
                        stroke={zeta < 0.99 ? '#38bdf8' : (zeta > 1.01 ? '#c084fc' : '#fbbf24')} 
                        strokeWidth="2.5" 
                      />

                      {/* Cursor del instante actual */}
                      <circle 
                        cx={svgData.currentPx} 
                        cy={svgData.currentPy} 
                        r="5" 
                        fill="#ef4444" 
                        stroke="#ffffff" 
                        strokeWidth="1.5" 
                      />
                      <line 
                        x1={svgData.currentPx} 
                        y1={10} 
                        x2={svgData.currentPx} 
                        y2={svgData.height - 10} 
                        stroke="#ef4444" 
                        strokeWidth="1" 
                        strokeDasharray="2 2" 
                      />
                    </svg>

                    {/* Leyenda flotante */}
                    <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      Banda 2%: ±1 mm (Verde)
                    </div>
                  </div>
                </div>

                {/* Simulador Físico Visual de Resorte & Pistón */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between items-center text-center">
                  <span className="text-[11px] font-extrabold text-slate-800">
                    Chasis & Resorte en Vivo
                  </span>

                  {/* Animación del Muelle y la Masa */}
                  <div className="w-full flex-1 flex flex-col items-center justify-center my-1 relative py-2">
                    {/* Chasis Superior (Masa m) */}
                    <div 
                      className="w-20 py-1.5 rounded-lg bg-[#0B3C73] text-white font-mono text-[10px] font-bold shadow-md transition-transform duration-75 border border-blue-400"
                      style={{
                        transform: `translateY(${(-currentDisplacement * 500).toFixed(1)}px)`
                      }}
                    >
                      <span>{liveParams.m} kg</span>
                    </div>

                    {/* Resorte SVG estirable */}
                    <svg 
                      className="w-10 h-16 my-0.5 transition-all duration-75"
                      viewBox="0 0 40 100"
                      preserveAspectRatio="none"
                      style={{
                        height: `${Math.max(20, Math.min(80, 50 - currentDisplacement * 400))}px`
                      }}
                    >
                      <path 
                        d="M 20 0 L 10 10 L 30 25 L 10 40 L 30 55 L 10 70 L 30 85 L 20 100" 
                        fill="none" 
                        stroke="#D97706" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Rueda / Base sobre Asfalto */}
                    <div className="w-24 h-2.5 rounded-full bg-slate-800 shadow-xs border border-slate-700" />
                  </div>

                  <div className="w-full pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">x(t):</span>
                    <strong className="text-[#0B3C73] font-bold">
                      {(currentDisplacement * 100).toFixed(2)} cm
                    </strong>
                  </div>
                </div>
              </div>

              {/* Indicadores de Telemetría Dinámica */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Régimen</span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">{liveParams.regimen}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Factor Zeta (ζ)</span>
                  <span className="font-mono text-xs font-black text-amber-700 block mt-0.5">ζ = {zeta.toFixed(2)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Asentamiento (2%)</span>
                  <span className="font-mono text-xs font-black text-[#0B3C73] block mt-0.5">{liveParams.settlingTime.toFixed(2)} s</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sobreimpulso (Mp)</span>
                  <span className="font-mono text-xs font-black text-rose-700 block mt-0.5">{liveParams.overshootPct.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal: Navegación Rápida y Teclas */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-bold shadow-2xs">ESC</kbd> para volver a la presentación
            </span>
          </div>

          <div className="flex items-center gap-2">
            {slideData.items.length > 1 && (
              <button
                onClick={() => {
                  setActiveItemIndex((prev) => (prev + 1) % slideData.items.length);
                  setCopied(false);
                }}
                className="liquid-glass-button px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Siguiente cálculo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="liquid-glass-button-gold px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cerrar y Volver
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
