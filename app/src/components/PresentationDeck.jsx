import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Maximize2, Minimize2, Clock, User, Award, CheckCircle2,
  Sparkles, Layers, Sliders
} from 'lucide-react';
import { SLIDES_PRESENTATION } from '../data/flashcardsData';
import SuspensionAnimation from './SuspensionAnimation';
import SimulationChart from './SimulationChart';

export default function PresentationDeck({ m, c, k, x0, v0, regimen, settlingTime, overshootPct }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 minutos en segundos (900s)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Atajos de teclado para pasar diapositivas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES_PRESENTATION.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
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
      <div className="liquid-glass p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
            <Clock className={`w-4 h-4 ${secondsRemaining < 120 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
            <span className="text-gray-400">Tiempo restante:</span>
            <span className={`font-bold text-sm ${secondsRemaining < 120 ? 'text-rose-400' : 'text-amber-300'}`}>
              {formatTimer(secondsRemaining)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-1 p-1 hover:text-white text-gray-400"
              title={isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro de 15 minutos'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={() => { setSecondsRemaining(15 * 60); setIsTimerRunning(false); }}
              className="p-1 hover:text-white text-gray-400"
              title="Reiniciar a 15:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-300">
            <span className="text-gray-400">Diapositiva:</span>
            <span className="font-bold text-white bg-[#0B3C73] px-2 py-0.5 rounded">
              {currentSlideIndex + 1} / {SLIDES_PRESENTATION.length}
            </span>
          </div>
        </div>

        {/* Indicador del Ponente en turno */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs">
          <User className="w-4 h-4 text-[#F5A800]" />
          <span className="text-gray-400 hidden sm:inline">Ponente:</span>
          <span className="font-bold text-amber-300">{currentSlide.speaker}</span>
          <span className="text-[10px] bg-black/50 px-1.5 py-0.5 rounded text-gray-400 font-mono">
            {currentSlide.time}
          </span>
        </div>

        {/* Controles de Navegación de Diapositivas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlideIndex === 0}
            className="liquid-glass-button p-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:text-white"
            title="Diapositiva anterior (Flecha Izquierda)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES_PRESENTATION.length - 1))}
            disabled={currentSlideIndex === SLIDES_PRESENTATION.length - 1}
            className="liquid-glass-button-gold px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Siguiente diapositiva (Flecha Derecha o Espacio)"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="liquid-glass-button p-2 rounded-xl text-gray-400 hover:text-white hidden sm:flex"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Área Principal de la Diapositiva Interactiva */}
      <div className="liquid-glass p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden min-h-[540px] flex flex-col justify-between shadow-2xl">
        
        {/* Glow de fondo Unimayor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado de la Diapositiva */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-[#F5A800] font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {currentSlide.category} · {currentSlide.badge}
            </span>
            <span className="text-xs font-mono text-gray-400">
              Uso de teclado: [←] Anterior | [→] o [Espacio] Siguiente
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-base sm:text-lg text-sky-200 mt-1 font-medium">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Cuerpo Dinámico de la Diapositiva */}
        <div className="my-6 flex-1">
          {/* DIAPOSITIVA 1: PORTADA */}
          {currentSlide.id === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Evaluación Oral de Ecuaciones Diferenciales — Unidad 3.  
                  Análisis analítico, numérico y simulación interactiva de una suspensión vehicular (quarter-car model).
                </p>
                <div className="liquid-glass-card p-4 rounded-xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">Integrantes Grupo 5:</h4>
                  <ul className="text-xs sm:text-sm text-gray-200 space-y-1.5 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CRUZ ANACONA ANGELA GABRIELA</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> GOMEZ HOYOS DUBAN ALEXANDER</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> TORRES ANGULO JOSE ALDAIR</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> VELASCO BURBANO RUBEN DARIO</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-white/10">
                <img src="./logotipo-actual.webp" alt="Unimayor" className="w-32 h-auto mb-3 drop-shadow-md" />
                <span className="text-xs font-bold text-white text-center">
                  Institución Universitaria Colegio Mayor del Cauca
                </span>
                <span className="text-[11px] text-gray-400 text-center mt-1">
                  Ingeniería Informática · Ingeniería Multimedia
                </span>
              </div>
            </div>
          )}

          {/* DIAPOSITIVAS 2, 3, 4, 5: CONTENIDO TÉCNICO Y PUNTOS CLAVE */}
          {(currentSlide.id === 2 || currentSlide.id === 3 || currentSlide.id === 4 || currentSlide.id === 5) && (
            <div className="space-y-4">
              <p className="text-sm text-gray-300">{currentSlide.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {currentSlide.keyPoints.map((pt, i) => (
                  <div key={i} className="liquid-glass-card p-4 rounded-xl border border-white/10 flex items-start gap-3">
                    <div className="p-1 rounded-full bg-amber-500/20 text-[#F5A800] mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIAPOSITIVA 6: GRÁFICA DE SUPERPOSICIÓN (VERIFICACIÓN EXACTA VS NUMÉRICA) */}
          {currentSlide.id === 6 && (
            <div className="h-[360px] w-full">
              <SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} />
            </div>
          )}

          {/* DIAPOSITIVA 7: ANIMACIÓN INTERACTIVA DE SUSPENSIÓN */}
          {currentSlide.id === 7 && (
            <div className="h-[380px] w-full">
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
          )}

          {/* DIAPOSITIVA 8: DECISIÓN DE INGENIERÍA: AMBULANCIA VS CARRERAS */}
          {currentSlide.id === 8 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Opción 1: Ambulancia */}
              <div className="liquid-glass-card p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block mb-3">
                    Elección Clínica: Ambulancia Médica
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Amortiguamiento Crítico (c = 6000 N·s/m, ζ = 1.0)
                  </h3>
                  <ul className="text-xs text-gray-300 space-y-2 mt-3 pl-4 list-disc">
                    <li><strong>Sobreimpulso 0.00%:</strong> La carrocería no rebota hacia abajo. Cero oscilaciones armónicas.</li>
                    <li><strong>Tiempo de Asentamiento Mínimo:</strong> Se estabiliza en solo <strong>0.58 s</strong>.</li>
                    <li><strong>Seguridad del Paciente:</strong> Evita vibraciones bruscas en pacientes con trauma de columna o cirugías en tránsito.</li>
                  </ul>
                </div>
                <div className="mt-4 p-2.5 rounded-lg bg-black/40 text-center font-mono text-xs text-amber-300">
                  Veredicto: Máximo confort y mínima aceleración vertical
                </div>
              </div>

              {/* Opción 2: Carro de Carreras */}
              <div className="liquid-glass-card p-5 rounded-2xl border border-sky-500/30 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 inline-block mb-3">
                    Elección Pista: Vehículo de Carreras
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Suspensión Rígida de Alta Tasa (k ↑, c ↑)
                  </h3>
                  <ul className="text-xs text-gray-300 space-y-2 mt-3 pl-4 list-disc">
                    <li><strong>Adherencia Máxima:</strong> La prioridad no es el confort, sino mantener el <em>contact patch</em> del neumático pegado al asfalto.</li>
                    <li><strong>Estabilidad Aerodinámica:</strong> Mantiene constante la altura del fondo plano para preservar el efecto suelo.</li>
                    <li><strong>Cero rebote:</strong> Un sobreimpulso del 37% levantaría el chasis y desestabilizaría la carga aerodinámica en curvas rápidas.</li>
                  </ul>
                </div>
                <div className="mt-4 p-2.5 rounded-lg bg-black/40 text-center font-mono text-xs text-sky-300">
                  Veredicto: Máxima tracción y rigidez angular
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra Inferior: Progreso de Diapositivas */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            {SLIDES_PRESENTATION.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-7 bg-[#F5A800]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Ir a diapositiva ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span>Usa las flechas para exponer</span>
            <span className="text-[#F5A800] font-bold">15 min exactos</span>
          </div>
        </div>

      </div>
    </div>
  );
}
