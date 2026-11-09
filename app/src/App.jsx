import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SuspensionAnimation from './components/SuspensionAnimation';
import SimulationChart from './components/SimulationChart';
import MathDeductionView from './components/MathDeductionView';
import PresentationDeck from './components/PresentationDeck';
import FlashcardsModal from './components/FlashcardsModal';
import { 
  DEFAULT_PARAMS, 
  PRESETS, 
  calculateOscillatorProperties, 
  calculateEngineeringMetrics, 
  rk4Integrate 
} from './physics/suspensionPhysics';
import { 
  Sliders, Gauge, ShieldCheck, Sparkles, Award, 
  HelpCircle, ChevronRight, Activity, Car, HeartPulse, Trophy 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'chart' | 'math' | 'deck'
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);

  // Parámetros reactivos del sistema físico
  const [m, setM] = useState(DEFAULT_PARAMS.m);
  const [k, setK] = useState(DEFAULT_PARAMS.k);
  const [c, setC] = useState(6000.0); // Inicia en crítico
  const [x0, setX0] = useState(DEFAULT_PARAMS.x0);
  const v0 = 0.0;

  // Propiedades analíticas y métricas computadas en vivo
  const { omega_n, c_cr, zeta, regimen, omega_d } = useMemo(() => {
    return calculateOscillatorProperties(m, k, c);
  }, [m, k, c]);

  const { settlingTime, overshootPct } = useMemo(() => {
    const { t, x } = rk4Integrate(m, c, k, x0, v0, 3.0, 0.001);
    return calculateEngineeringMetrics(t, x, m, c, k, x0, v0);
  }, [m, c, k, x0, v0]);

  const applyPreset = (preset) => {
    setM(preset.m);
    setK(preset.k);
    setC(preset.c);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-gray-100 selection:bg-amber-500 selection:text-black">
      {/* Barra de Navegación Superior */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
        
        {/* ========================================================
            VISTA 1: LABORATORIO INTERACTIVO (SANDBOX + ANIMACIÓN)
            ======================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            
            {/* Banner de Presets Rápidos */}
            <div className="liquid-glass p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <Sliders className="w-4 h-4 text-[#F5A800]" />
                <span>Casos de Estudio Oficiales:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => applyPreset(PRESETS.SUBAMORTIGUADO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 1800) < 5
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                      : 'bg-slate-900/60 text-blue-300 border-blue-500/30 hover:bg-blue-900/30'
                  }`}
                >
                  1. Subamortiguado (0.3 ccr)
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.CRITICO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 6000) < 5
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow-md'
                      : 'bg-slate-900/60 text-amber-300 border-amber-500/30 hover:bg-amber-900/30'
                  }`}
                >
                  2. Crítico (ccr = 6000)
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.SOBREAMORTIGUADO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 9000) < 5
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-900/60 text-purple-300 border-purple-500/30 hover:bg-purple-900/30'
                  }`}
                >
                  3. Sobreamortiguado (1.5 ccr)
                </button>

                <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

                <button
                  onClick={() => applyPreset(PRESETS.AMBULANCIA)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/40 transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ambulancia</span>
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.CARRERAS)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 text-rose-300 border border-rose-500/30 hover:bg-rose-950/40 transition-all text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-rose-400" />
                  <span>Carro de Carreras</span>
                </button>
              </div>
            </div>

            {/* Grid Principal: Animación 2D SVG a la izquierda, Gráfica y Sliders a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Columna Izquierda: Animación Física (5 columnas en LG) */}
              <div className="lg:col-span-5 liquid-glass p-4 rounded-3xl border border-white/10 flex flex-col justify-between shadow-xl">
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

              {/* Columna Derecha: Gráfica y Panel de Control Háptico (7 columnas en LG) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Gráfica de Superposición */}
                <div className="liquid-glass p-4 rounded-3xl border border-white/10 flex-1 min-h-[360px] flex flex-col justify-between shadow-xl">
                  <SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} />
                </div>

                {/* Controles Deslizantes de Precisión */}
                <div className="liquid-glass p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      Controles de Parámetros Físicos
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ζ = {zeta.toFixed(2)} ({regimen})
                    </span>
                  </div>

                  {/* Slider c: Coeficiente de Amortiguamiento */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 font-medium">
                        Amortiguamiento c:
                      </span>
                      <span className="font-mono font-bold text-amber-300 text-sm">
                        {c.toFixed(0)} N·s/m ({((c / c_cr) * 100).toFixed(0)}% ccr)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12000"
                      step="50"
                      value={c}
                      onChange={(e) => setC(parseFloat(e.target.value))}
                      className="w-full accent-[#F5A800] cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>0 (Sin fricción)</span>
                      <span className="text-blue-300">1800 (0.3 ccr)</span>
                      <span className="text-amber-300 font-bold">6000 (Crítico ccr)</span>
                      <span className="text-purple-300">9000 (1.5 ccr)</span>
                      <span>12000 N·s/m</span>
                    </div>
                  </div>

                  {/* Grid de Controles Secundarios: m, k, x0 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                    {/* Masa m */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-300">
                        <span>Masa m:</span>
                        <span className="font-mono font-bold text-white">{m} kg</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="800"
                        step="10"
                        value={m}
                        onChange={(e) => setM(parseFloat(e.target.value))}
                        className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                      />
                    </div>

                    {/* Rigidez k */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-300">
                        <span>Rigidez k:</span>
                        <span className="font-mono font-bold text-white">{k.toLocaleString()} N/m</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="60000"
                        step="1000"
                        value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                      />
                    </div>

                    {/* Bache x0 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-300">
                        <span>Bache x(0):</span>
                        <span className="font-mono font-bold text-white">{(x0 * 100).toFixed(0)} cm</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="0.15"
                        step="0.01"
                        value={x0}
                        onChange={(e) => setX0(parseFloat(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Banner Informativo de Conclusión de Ingeniería */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-[#F5A800] border border-amber-500/30 mt-0.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Conclusión de Ingeniería: ¿Qué amortiguador elegir y por qué?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-3xl leading-relaxed">
                    Para la <strong>Ambulancia</strong> elegimos amortiguamiento crítico (<strong>c = 6000 N·s/m</strong>): sobreimpulso del <strong>0.00%</strong> y retorno en <strong>0.58 s</strong> para no generar rebotes al paciente.  
                    Para el <strong>Carro de carreras</strong> se usa amortiguamiento rígido para evitar oscilaciones de carrocería y maximizar la adherencia de neumáticos a altas velocidades.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('deck')}
                className="liquid-glass-button-gold px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <span>Ver Exposición 15 Min</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================
            VISTA 2: GRÁFICA DE SUPERPOSICIÓN (PROFUNDIDAD TÉCNICA)
            ======================================================== */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <div className="liquid-glass p-5 rounded-3xl border border-white/10 min-h-[500px]">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">
                  Verificación Computacional: Solución Exacta vs. Algoritmo Numérico RK4
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Demostración del cumplimiento de la regla de oro: la simulación numérica de cuarto orden valida milimétricamente la solución analítica deducida a mano.
                </p>
              </div>
              <div className="h-[440px]">
                <SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VISTA 3: DEDUCCIÓN MATEMÁTICA A MANO (RÚBRICA 1.0)
            ======================================================== */}
        {activeTab === 'math' && (
          <MathDeductionView />
        )}

        {/* ========================================================
            VISTA 4: MODO EXPOSICIÓN (SLIDE DECK 15 MINUTOS)
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
          />
        )}

      </main>

      {/* Modal de Flashcards de Estudio 5.0 */}
      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
      />

      {/* Pie de Página Formal Unimayor */}
      <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-4 px-4 sm:px-6 text-xs text-gray-400 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Institución Universitaria Colegio Mayor del Cauca</span>
            <span className="hidden sm:inline">·</span>
            <span>Ecuaciones Diferenciales (Unidad 3)</span>
          </div>

          <div className="text-[11px] text-gray-500">
            Grupo 5: Angela Cruz · Duban Gómez · José Torres · Rubén Velasco
          </div>

          <div className="text-[10px] text-gray-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
            Declaración IA (Pág. 10): Desarrollado con asistencia de Antigravity AI
          </div>
        </div>
      </footer>
    </div>
  );
}
