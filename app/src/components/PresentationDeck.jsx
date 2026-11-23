import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Maximize2, Minimize2, Clock, User, Award, CheckCircle2,
  Sparkles, Layers, Sliders, Box, ShieldCheck, HeartPulse, Trophy,
  Code2, Terminal
} from 'lucide-react';
import { SLIDES_PRESENTATION } from '../data/flashcardsData';
import { SLIDES_CODE_MAPPING } from '../data/slidesCodeData';
import SuspensionAnimation from './SuspensionAnimation';
import SimulationChart from './SimulationChart';
import KaTeXMath from './KaTeXMath';
import CodeCalculationModal from './CodeCalculationModal';

export default function PresentationDeck({ m, c, k, x0, v0, regimen, settlingTime, overshootPct }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 minutos en segundos (900s)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const currentSlide = SLIDES_PRESENTATION[currentSlideIndex];

  // Temporizador de 15 minutos
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  // Atajos de teclado para pasar diapositivas y abrir modal de código
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Si se está escribiendo en un input, ignorar
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES_PRESENTATION.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCodeModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full p-2 sm:p-4">
      {/* Barra Superior de Control de la Exposición */}
      <div className="liquid-glass p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-white/80 shadow-md">
        <div className="flex items-center gap-3">
          {/* Cronómetro Oficial de 15 Minutos */}
          <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono shadow-xs">
            <Clock className={`w-4 h-4 ${secondsRemaining < 120 ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
            <span className="text-slate-600 font-medium">Tiempo:</span>
            <span className={`font-bold text-sm ${secondsRemaining < 120 ? 'text-rose-600' : 'text-amber-700'}`}>
              {formatTimer(secondsRemaining)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-1 p-1 hover:text-slate-950 text-slate-600 transition-colors cursor-pointer"
              title={isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro de 15 minutos'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
            <button
              onClick={() => { setSecondsRemaining(15 * 60); setIsTimerRunning(false); }}
              className="p-1 hover:text-slate-950 text-slate-500 transition-colors cursor-pointer"
              title="Reiniciar a 15:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Diapositiva actual */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <span className="text-slate-500">Diapositiva:</span>
            <span className="font-bold text-white bg-[#0B3C73] px-2.5 py-0.5 rounded-md shadow-xs">
              {currentSlideIndex + 1} / {SLIDES_PRESENTATION.length}
            </span>
          </div>
        </div>

        {/* Indicador del Ponente en turno */}
        <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-300/80 text-xs shadow-xs">
          <User className="w-4 h-4 text-[#D97706]" />
          <span className="text-slate-500 hidden sm:inline">Ponente:</span>
          <span className="font-extrabold text-[#0B3C73]">{currentSlide.speaker}</span>
          <span className="text-[10px] bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded font-mono font-bold border border-amber-200">
            {currentSlide.time}
          </span>
        </div>

        {/* Controles de Navegación de Diapositivas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlideIndex === 0}
            className="liquid-glass-button p-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 hover:text-slate-950"
            title="Diapositiva anterior (Flecha Izquierda)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES_PRESENTATION.length - 1))}
            disabled={currentSlideIndex === SLIDES_PRESENTATION.length - 1}
            className="liquid-glass-button-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Siguiente diapositiva (Flecha Derecha o Espacio)"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="liquid-glass-button p-2 rounded-xl text-slate-600 hover:text-slate-950 hidden sm:flex"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Área Principal de la Diapositiva Interactiva (Luminous Liquid Glass con Acentos Institucionales) */}
      <div className="liquid-glass p-5 sm:p-7 md:p-8 rounded-3xl border border-white/90 relative min-h-[560px] flex flex-col justify-between shadow-xl">
        
        {/* Glow de fondo institucional Unimayor (Azul Rey y Oro Solar) */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#0B3C73]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F5A800]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado de la Diapositiva */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-[#0B3C73] font-extrabold bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200 shadow-xs">
              {currentSlide.category} · {currentSlide.badge}
            </span>
            
            {/* Botón Interactivo de Inspección de Cálculo en Código */}
            {SLIDES_CODE_MAPPING[currentSlide.id] && (
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="liquid-glass-button-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all group"
                title="Inspeccionar cómo se calculan estas operaciones matemáticas en código (JavaScript y Python). Atajo: tecla [C]"
              >
                <Code2 className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
                <span className="text-slate-950 font-black">Ver Cálculo en Código</span>
                <span className="text-[10px] font-mono bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded font-bold border border-amber-300 hidden sm:inline">
                  JS / Py [C]
                </span>
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-base sm:text-lg text-blue-900 font-semibold mt-1">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Cuerpo Dinámico de la Diapositiva */}
        <div className="my-5 flex-1 relative z-10">
          
          {/* DIAPOSITIVA 1: PORTADA */}
          {currentSlide.id === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  Evaluación Oral de Ecuaciones Diferenciales — Unidad 3.  
                  Análisis analítico riguroso, modelado de segundo orden, integración numérica RK4 y simulación interactiva con especificación de suspensión para ambulancia y vehículo de carreras.
                </p>

                {/* Banner de Fórmula Central */}
                <div className="math-formula-box overflow-x-auto text-center">
                  <div className="flex items-center justify-between px-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3C73]">
                      Ecuación Diferencial Canónica del Sistema
                    </span>
                    <button
                      onClick={() => setIsCodeModalOpen(true)}
                      className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Ver cómo se define la EDO en código"
                    >
                      <Code2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Ver en Código</span>
                    </button>
                  </div>
                  <KaTeXMath math={currentSlide.mainFormula} block={true} />
                </div>

                <div className="liquid-glass-card p-4 rounded-2xl border border-slate-200/90 space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase text-[#0B3C73] tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Integrantes Grupo 5:
                  </h4>
                  <ul className="text-xs sm:text-sm text-slate-800 space-y-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>CRUZ ANACONA ANGELA GABRIELA</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>GOMEZ HOYOS DUBAN ALEXANDER</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>TORRES ANGULO JOSE ALDAIR</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>VELASCO BURBANO RUBEN DARIO</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white/90 rounded-2xl border border-slate-200 shadow-sm text-center">
                <img
                  src="./logotipo-actual.webp"
                  alt="Unimayor"
                  className="w-36 h-auto mb-4 drop-shadow-md rounded-xl p-1 bg-white border border-slate-200"
                />
                <span className="text-sm font-black text-slate-950">
                  Institución Universitaria Colegio Mayor del Cauca
                </span>
                <span className="text-xs text-blue-800 font-bold mt-1">
                  Facultad de Ingeniería · Ingeniería Informática
                </span>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Docente: Diana Marcela Mendez Astudillo</span>
                </div>
              </div>
            </div>
          )}

          {/* DIAPOSITIVAS 2, 3, 4, 5: CONTENIDO TÉCNICO CON FÓRMULAS LATEX */}
          {(currentSlide.id === 2 || currentSlide.id === 3 || currentSlide.id === 4 || currentSlide.id === 5) && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentSlide.summary}
              </p>

              {/* Fórmula Central en KaTeX */}
              {currentSlide.mainFormula && (
                <div className="math-formula-box overflow-x-auto text-center">
                  <div className="flex items-center justify-between px-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3C73]">
                      Fórmula Central
                    </span>
                    <button
                      onClick={() => setIsCodeModalOpen(true)}
                      className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Ver deducción y cálculo en código"
                    >
                      <Code2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Ver en Código</span>
                    </button>
                  </div>
                  <KaTeXMath math={currentSlide.mainFormula} block={true} />
                </div>
              )}

              {/* Tarjetas de Fórmulas Clave */}
              {currentSlide.formulaCards && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {currentSlide.formulaCards.map((fc, i) => (
                    <div
                      key={i}
                      className="liquid-glass-card p-3.5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between gap-1.5"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#0B3C73] block mb-1">
                          {fc.label}:
                        </span>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/90 overflow-x-auto text-slate-900 shadow-inner">
                          <KaTeXMath math={fc.latex} block={true} />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {fc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Puntos de argumentación verbal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {currentSlide.keyPoints.map((pt, i) => (
                  <div key={i} className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-2 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-800 font-medium leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIAPOSITIVA 6: GRÁFICA DE SUPERPOSICIÓN (VERIFICACIÓN EXACTA VS NUMÉRICA) */}
          {currentSlide.id === 6 && (
            <div className="space-y-3">
              <div className="math-formula-box py-1.5 px-3 overflow-x-auto text-center">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B3C73]">
                    Criterio de Validación: Error Máximo Residual
                  </span>
                  <button
                    onClick={() => setIsCodeModalOpen(true)}
                    className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Ver algoritmo de error residual en código"
                  >
                    <Code2 className="w-3 h-3 text-amber-600" />
                    <span>Ver en Código</span>
                  </button>
                </div>
                <KaTeXMath math={currentSlide.mainFormula} block={true} />
              </div>
              <div className="w-full bg-slate-50/70 rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
                <SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} height="400px" />
              </div>
            </div>
          )}

          {/* DIAPOSITIVA 7: ANIMACIÓN INTERACTIVA DE SUSPENSIÓN */}
          {currentSlide.id === 7 && (
            <div className="space-y-3">
              <div className="math-formula-box overflow-x-auto text-center">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3C73]">
                    Definición Formal de Tiempo de Asentamiento al 2%
                  </span>
                  <button
                    onClick={() => setIsCodeModalOpen(true)}
                    className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Ver cálculo de métricas (ts y Mp) en código"
                  >
                    <Code2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ver en Código</span>
                  </button>
                </div>
                <KaTeXMath math={currentSlide.mainFormula} block={true} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                <div className="md:col-span-8 h-[340px] bg-white rounded-2xl border border-slate-200 p-2 shadow-inner">
                  <SuspensionAnimation
                    m={m}
                    c={c}
                    k={k}
                    x0={x0}
                    v0={v0}
                    regimen={regimen}
                    settlingTime={settlingTime}
                    overshootPct={overshootPct}
                  />
                </div>
                <div className="md:col-span-4 flex flex-col justify-between gap-2.5">
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-extrabold text-[#0B3C73] uppercase tracking-wider block">
                      Subamortiguado (c = 1800)
                    </span>
                    <KaTeXMath math="t_s = 1.12\text{ s},\; M_p = 37.23\%" block={true} />
                    <span className="text-[10px] text-slate-500 block mt-1">4 oscilaciones visibles antes del reposo</span>
                  </div>
                  <div className="bg-amber-50/90 p-3.5 rounded-xl border border-amber-300 shadow-xs">
                    <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block">
                      Crítico (c = 6000) · Óptimo
                    </span>
                    <KaTeXMath math="t_s = 0.58\text{ s},\; M_p = 0.00\%" block={true} />
                    <span className="text-[10px] text-amber-800 font-medium block mt-1">Mínimo tiempo, cero oscilaciones</span>
                  </div>
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-extrabold text-purple-900 uppercase tracking-wider block">
                      Sobreamortiguado (c = 9000)
                    </span>
                    <KaTeXMath math="t_s = 1.07\text{ s},\; M_p = 0.00\%" block={true} />
                    <span className="text-[10px] text-slate-500 block mt-1">Retorno lento por fricción viscosa excesiva</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIAPOSITIVA 8: DECISIÓN DE INGENIERÍA: AMBULANCIA VS CARRERAS */}
          {currentSlide.id === 8 && (
            <div className="space-y-4">
              <div className="math-formula-box overflow-x-auto text-center">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3C73]">
                    Comparación de Criterios de Ingeniería
                  </span>
                  <button
                    onClick={() => setIsCodeModalOpen(true)}
                    className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Ver configuración de presets en código"
                  >
                    <Code2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ver en Código</span>
                  </button>
                </div>
                <KaTeXMath math={currentSlide.mainFormula} block={true} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Opción 1: Ambulancia */}
                <div className="liquid-glass-card p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                        <HeartPulse className="w-5 h-5" />
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Elección Médica: Ambulancia
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-950 mb-2">
                      Amortiguamiento Crítico (c = 6000 N·s/m, ζ = 1.0)
                    </h3>
                    <div className="my-2 p-2 rounded-lg bg-white border border-emerald-200">
                      <KaTeXMath math="M_p = 0.00\%,\quad t_s = 0.58\text{ s}" block={true} />
                    </div>
                    <ul className="text-xs text-slate-700 space-y-2 mt-3 pl-4 list-disc font-medium leading-relaxed">
                      <li><strong>Sobreimpulso 0.00%:</strong> La carrocería no rebota hacia abajo. Cero oscilaciones armónicas.</li>
                      <li><strong>Tiempo de Asentamiento Mínimo:</strong> Se estabiliza en solo <strong>0.58 s</strong>.</li>
                      <li><strong>Seguridad del Paciente:</strong> Evita vibraciones bruscas en pacientes con trauma de columna o cirugías en tránsito.</li>
                    </ul>
                  </div>
                  <div className="mt-4 p-2.5 rounded-xl bg-white border border-emerald-200 text-center font-mono text-xs text-emerald-900 font-bold shadow-xs">
                    Veredicto: Máximo confort y mínima aceleración vertical
                  </div>
                </div>

                {/* Opción 2: Carro de Carreras */}
                <div className="liquid-glass-card p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/40 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                        <Trophy className="w-5 h-5" />
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                        Elección Deportiva: Carro de Carreras
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-950 mb-2">
                      Suspensión Rígida de Alta Tasa (k ↑, c ↑)
                    </h3>
                    <div className="my-2 p-2 rounded-lg bg-white border border-rose-200">
                      <KaTeXMath math="k = 45\text{ kN/m},\quad c = 8500\text{ N}\cdot\text{s/m}" block={true} />
                    </div>
                    <ul className="text-xs text-slate-700 space-y-2 mt-3 pl-4 list-disc font-medium leading-relaxed">
                      <li><strong>Adherencia Máxima:</strong> La prioridad no es el confort, sino mantener el <em>contact patch</em> del neumático pegado al asfalto.</li>
                      <li><strong>Estabilidad Aerodinámica:</strong> Mantiene constante la altura del fondo plano para preservar el efecto suelo.</li>
                      <li><strong>Cero rebote desestabilizador:</strong> Un sobreimpulso del 37% levantaría el difusor y haría perder el control en curvas rápidas.</li>
                    </ul>
                  </div>
                  <div className="mt-4 p-2.5 rounded-xl bg-white border border-rose-200 text-center font-mono text-xs text-rose-900 font-bold shadow-xs">
                    Veredicto: Máxima tracción y rigidez angular
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior: Progreso de Diapositivas */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/90 text-xs text-slate-600 relative z-10">
          <div className="flex items-center gap-1.5">
            {SLIDES_PRESENTATION.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-8 bg-[#F5A800] shadow-xs'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Ir a diapositiva ${idx + 1}`}
              />
            ))}
          </div>

          {/* <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Usa las flechas para exponer</span>
            <span className="text-[#0B3C73] font-bold bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              15 min exactos
            </span>
          </div> */}
        </div>

        {/* Modal Interactivo de Cálculo en Código */}
        <CodeCalculationModal
          isOpen={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
          slideId={currentSlide.id}
          m={m}
          c={c}
          k={k}
          x0={x0}
          v0={v0}
          regimen={regimen}
          settlingTime={settlingTime}
          overshootPct={overshootPct}
        />

      </div>
    </div>
  );
}
