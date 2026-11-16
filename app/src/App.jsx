import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SuspensionAnimation from './components/SuspensionAnimation';
import SimulationChart from './components/SimulationChart';
import MathDeductionView from './components/MathDeductionView';
import PresentationDeck from './components/PresentationDeck';
import FlashcardsModal from './components/FlashcardsModal';
import Vehicle3DScene from './components/Vehicle3DScene';
import SuspensionCalculator from './components/SuspensionCalculator';
import { 
  DEFAULT_PARAMS, 
  PRESETS, 
  calculateOscillatorProperties, 
  calculateEngineeringMetrics, 
  rk4Integrate 
} from './physics/suspensionPhysics';
import { 
  Sliders, Gauge, ShieldCheck, Sparkles, Award, 
  HelpCircle, ChevronRight, Activity, Car, HeartPulse, Trophy, Calculator, Box 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'chart' | 'math' | 'calculator' | 'deck'
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [simViewMode, setSimViewMode] = useState('3d'); // '3d' | '2d'

  // Parámetros reactivos del sistema físico
  const [m, setM] = useState(300.0);
  const [k, setK] = useState(30000.0);
  const [c, setC] = useState(6000.0); // Inicia en crítico
  const [x0, setX0] = useState(0.05);
  const v0 = 0.0;

  // Estado del vehículo enfocado para el visor 3D ('ambulancia' | 'carreras' | null)
  const [focusedVehicle, setFocusedVehicle] = useState('ambulancia');

  // Propiedades analíticas y métricas computadas en vivo
  const { omega_n, c_cr, zeta, regimen, omega_d } = useMemo(() => {
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
    } else {
      setFocusedVehicle(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Barra de Navegación Superior */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
        
        {/* ========================================================
            VISTA 1: LABORATORIO INTERACTIVO (SIMULADOR 3D + GRÁFICA)
            ======================================================== */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            
            {/* 1. Banner de Presets Rápidos */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Casos de Estudio Oficiales:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => applyPreset(PRESETS.SUBAMORTIGUADO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 1800) < 5 && k === 30000 && !focusedVehicle
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  1. Subamortiguado (0.3 ccr)
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.CRITICO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 6000) < 5 && k === 30000 && focusedVehicle !== 'ambulancia'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  2. Crítico (ccr = 6000)
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.SOBREAMORTIGUADO)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    Math.abs(c - 9000) < 5 && k === 30000 && !focusedVehicle
                      ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  3. Sobreamortiguado (1.5 ccr)
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                <button
                  onClick={() => applyPreset(PRESETS.AMBULANCIA, 'ambulancia')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center gap-1.5 font-medium ${
                    focusedVehicle === 'ambulancia' && Math.abs(c - 6000) < 5
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <HeartPulse className={`w-3.5 h-3.5 ${focusedVehicle === 'ambulancia' ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Ambulancia</span>
                </button>

                <button
                  onClick={() => applyPreset(PRESETS.CARRERAS, 'carreras')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center gap-1.5 font-medium ${
                    focusedVehicle === 'carreras' && Math.abs(c - 8500) < 5
                      ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <Trophy className={`w-3.5 h-3.5 ${focusedVehicle === 'carreras' ? 'text-white' : 'text-rose-600'}`} />
                  <span>Carro de Carreras</span>
                </button>
              </div>
            </div>

            {/* 2. Grid Principal: 3D Vehicle Scene (5 cols) + Gráfica y Sliders (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Columna Izquierda (5 cols): 3D Vehicle Scene (Vehicle3DScene) */}
              <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[500px]">
                {/* Selector de Modo de Visualización (3D vs 2D) */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Visualización Física
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-medium">
                    <button
                      onClick={() => setSimViewMode('3d')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        simViewMode === '3d'
                          ? 'bg-white text-blue-600 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      3D Vehicular
                    </button>
                    <button
                      onClick={() => setSimViewMode('2d')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        simViewMode === '2d'
                          ? 'bg-white text-blue-600 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Diagrama 2D
                    </button>
                  </div>
                </div>

                {/* Renderizado de 3D Scene o 2D Animation */}
                <div className="flex-1 flex flex-col justify-center">
                  {simViewMode === '3d' ? (
                    <Vehicle3DScene
                      m={m}
                      c={c}
                      k={k}
                      x0={x0}
                      v0={v0}
                      regimen={regimen}
                      settlingTime={settlingTime}
                      overshootPct={overshootPct}
                      focusedVehicle={focusedVehicle}
                      setFocusedVehicle={setFocusedVehicle}
                    />
                  ) : (
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
                  )}
                </div>
              </div>

              {/* Columna Derecha (7 cols): SimulationChart + Parameter Sliders Panel */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                
                {/* Gráfica de Superposición */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex-1 min-h-[350px] flex flex-col justify-between">
                  <SimulationChart m={m} c={c} k={k} x0={x0} v0={v0} />
                </div>

                {/* Panel de Controles Deslizantes de Precisión */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-amber-500" />
                      Controles de Parámetros Físicos
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-semibold">
                      ζ = {zeta.toFixed(2)} ({regimen})
                    </span>
                  </div>

                  {/* Slider c: Coeficiente de Amortiguamiento */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">
                        Amortiguamiento c:
                      </span>
                      <span className="font-mono font-bold text-amber-600 text-sm">
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
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>0 (Sin fricción)</span>
                      <span className="text-blue-600 font-semibold">1800 (0.3 ccr)</span>
                      <span className="text-amber-600 font-bold">6000 (Crítico ccr)</span>
                      <span className="text-purple-600 font-semibold">9000 (1.5 ccr)</span>
                      <span>12000 N·s/m</span>
                    </div>
                  </div>

                  {/* Grid de Controles Secundarios: m, k, x0 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                    {/* Masa m */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-700">
                        <span>Masa m:</span>
                        <span className="font-mono font-bold text-blue-600">{m} kg</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="800"
                        step="10"
                        value={m}
                        onChange={(e) => setM(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded"
                      />
                    </div>

                    {/* Rigidez k */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-700">
                        <span>Rigidez k:</span>
                        <span className="font-mono font-bold text-amber-600">{k.toLocaleString()} N/m</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="60000"
                        step="1000"
                        value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded"
                      />
                    </div>

                    {/* Bache x0 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-700">
                        <span>Bache x(0):</span>
                        <span className="font-mono font-bold text-emerald-600">{(x0 * 100).toFixed(0)} cm</span>
                      </div>
                      <input
                        type="range"
                        min="0.01"
                        max="0.15"
                        step="0.01"
                        value={x0}
                        onChange={(e) => setX0(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-100 rounded"
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* 3. Banner Informativo de Conclusión de Ingeniería */}
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
                    Para el <strong>Carro de carreras</strong> se usa amortiguamiento rígido para evitar oscilaciones de carrocería y maximizar la adherencia de neumáticos a altas velocidades.
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
            </div>

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
            VISTA 5: MODO EXPOSICIÓN (SLIDE DECK 15 MINUTOS)
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
      <footer className="w-full border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 px-4 sm:px-6 text-xs text-slate-600 mt-8">
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