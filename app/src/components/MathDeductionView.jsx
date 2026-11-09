import React, { useState } from 'react';
import { BookOpen, Calculator, PenTool } from 'lucide-react';
import KaTeXMath from './KaTeXMath';

export default function MathDeductionView() {
  const [activeTab, setActiveTab] = useState('planteamiento');

  return (
    <div className="flex flex-col gap-6 p-2 sm:p-4 max-w-5xl mx-auto">
      {/* Cabecera de la sección */}
      <div className="liquid-glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-[#F5A800]" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Deducción Matemática Completa a Mano (Puntaje Rúbrica: 1.0)
          </h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
          Procedimiento analítico paso a paso para la evaluación oral y escrita de la Unidad 3 (Ecuaciones Diferenciales de Orden Superior).
          Cumple estrictamente con la <strong>Regla de Oro</strong>: <em>"Primero la matemática, después el programa"</em>.
        </p>

        {/* Barra de pestañas */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10 text-xs sm:text-sm">
          {[
            { id: 'planteamiento', label: '1. Planteamiento Físico y EDO' },
            { id: 'subamortiguado', label: '2. Caso Subamortiguado (c = 1800)' },
            { id: 'critico', label: '3. Caso Crítico (c = 6000)' },
            { id: 'sobreamortiguado', label: '4. Caso Sobreamortiguado (c = 9000)' },
            { id: 'sistema1orden', label: '5. Reducción a Sistema de 1° Orden' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer font-medium ${
                activeTab === tab.id
                  ? 'bg-[#0B3C73] text-white border border-[#F5A800]/50 shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según pestaña */}
      <div className="liquid-glass p-6 rounded-2xl border border-white/10">
        {/* PESTAÑA 1: PLANTEAMIENTO */}
        {activeTab === 'planteamiento' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              1. Modelo de Cuarto de Carro y EDO Canónica
            </h3>

            <div className="space-y-3 text-sm text-gray-200">
              <p>
                Consideramos la cuarta parte de un automóvil (un cuarto de carro), compuesta por una masa suspendida de{' '}
                <span className="font-mono text-amber-300 font-bold">m = 300 kg</span> que reposa sobre un conjunto
                resorte-amortiguador con constante de rigidez{' '}
                <span className="font-mono text-amber-300 font-bold">k = 30 000 N/m</span> y constante de amortiguamiento viscoso{' '}
                <span className="font-mono text-amber-300 font-bold">c</span>.
              </p>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-white/10 text-center">
                <KaTeXMath math="m x''(t) + c x'(t) + k x(t) = 0" block={true} />
              </div>

              <p>
                Al pasar por un bache de <strong className="text-amber-300">5 cm</strong>, la posición inicial de la carrocería
                es <KaTeXMath math="x(0) = 0.05\text{ m}" block={false} />, y se suelta desde el reposo con velocidad nula{' '}
                <KaTeXMath math="x'(0) = 0\text{ m/s}" block={false} />.
              </p>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-white/10 text-center">
                <KaTeXMath math="300 x''(t) + c x'(t) + 30\,000 x(t) = 0 \implies x''(t) + \frac{c}{300} x'(t) + 100 x(t) = 0" block={true} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="liquid-glass-card p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-2 text-amber-400">Frecuencia Natural no Amortiguada (ωn)</h4>
                <p className="text-xs text-gray-300 mb-2">Frecuencia intrínseca de oscilación libre del sistema sin fricción:</p>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="\omega_n = \sqrt{\frac{k}{m}} = \sqrt{\frac{30\,000}{300}} = \sqrt{100} = 10\text{ rad/s}" block={true} />
                </div>
              </div>

              <div className="liquid-glass-card p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-2 text-amber-400">Coeficiente Crítico de Amortiguamiento (ccr)</h4>
                <p className="text-xs text-gray-300 mb-2">Valor frontera que separa el régimen oscilatorio del aperiódico:</p>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="c_{cr} = 2\sqrt{m k} = 2\sqrt{300 \times 30\,000} = 2 \times 3000 = 6000\text{ N}\cdot\text{s/m}" block={true} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: SUBAMORTIGUADO */}
        {activeTab === 'subamortiguado' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-sky-400 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                2. Régimen Subamortiguado: c = 0.3 ccr = 1800 N·s/m (ζ = 0.3)
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Produce Oscilación y Rebote
              </span>
            </div>

            <div className="space-y-4 text-sm text-gray-200">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 1: Ecuación Característica</h4>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="r^2 + \frac{1800}{300}r + 100 = 0 \implies r^2 + 6r + 100 = 0" block={true} />
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 2: Cálculo de Raíces Complejas</h4>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="r = \frac{-6 \pm \sqrt{36 - 400}}{2} = -3 \pm \sqrt{-91} = -3 \pm i\sqrt{91} \approx -3 \pm 9.5394 i" block={true} />
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Parte real disipativa: α = -3 &nbsp;|&nbsp; Frecuencia amortiguada: ωd = √91 rad/s
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 3: Solución General y Constantes</h4>
                <div className="bg-black/50 p-3 rounded text-center mb-3">
                  <KaTeXMath math="x(t) = e^{-3t} \left[ A \cos(\sqrt{91} t) + B \sin(\sqrt{91} t) \right]" block={true} />
                </div>
                <ul className="text-xs space-y-2 text-gray-300 pl-4 list-disc">
                  <li>
                    <strong>Condición inicial de posición x(0) = 0.05 m:</strong><br />
                    <KaTeXMath math="x(0) = e^0 [A \cos(0) + B \sin(0)] = A \implies A = 0.05" block={false} />
                  </li>
                  <li>
                    <strong>Condición inicial de velocidad x'(0) = 0 m/s:</strong><br />
                    <KaTeXMath math="x'(0) = -3A + B\sqrt{91} = 0 \implies B = \frac{3(0.05)}{\sqrt{91}} = \frac{0.15}{\sqrt{91}} \approx 0.01572" block={false} />
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/70 to-blue-950/70 border border-sky-400/30">
                <h4 className="font-bold text-white text-sm mb-1 text-sky-300">Solución Particular Exacta:</h4>
                <div className="bg-black/60 p-3 rounded-lg text-center my-2">
                  <KaTeXMath math="x(t) = e^{-3t} \left[ 0.05 \cos(\sqrt{91} t) + \frac{0.15}{\sqrt{91}} \sin(\sqrt{91} t) \right]" block={true} />
                </div>
                <div className="text-xs text-gray-300 mt-2 space-y-1">
                  <p>• <strong>Factor e^(-3t):</strong> Término que produce el <em>decaimiento exponencial</em> de la oscilación.</p>
                  <p>• <strong>Factores cos(√91 t) y sin(√91 t):</strong> Términos que producen la <em>oscilación armónica</em> con frecuencia ωd = 9.54 rad/s.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: CRÍTICO */}
        {activeTab === 'critico' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                3. Régimen Críticamente Amortiguado: c = ccr = 6000 N·s/m (ζ = 1.0)
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Retorno Óptimo sin Rebote
              </span>
            </div>

            <div className="space-y-4 text-sm text-gray-200">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 1: Ecuación Característica y Raíz Repetida</h4>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="r^2 + \frac{6000}{300}r + 100 = 0 \implies r^2 + 20r + 100 = (r + 10)^2 = 0" block={true} />
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Raíz real doble repetida: <strong>r₁ = r₂ = -10</strong></p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 2: Solución General por Reducción de Orden</h4>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="x(t) = (C_1 + C_2 t) e^{-10t}" block={true} />
                </div>
                <p className="text-xs text-gray-300 mt-2">
                  El término lineal en <em>t</em> asegura la existencia de dos soluciones linealmente independientes en el espacio vectorial.
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 3: Condiciones Iniciales</h4>
                <ul className="text-xs space-y-2 text-gray-300 pl-4 list-disc">
                  <li><KaTeXMath math="x(0) = C_1 = 0.05" block={false} /></li>
                  <li><KaTeXMath math="x'(t) = C_2 e^{-10t} - 10(C_1 + C_2 t) e^{-10t}" block={false} /></li>
                  <li><KaTeXMath math="x'(0) = C_2 - 10C_1 = 0 \implies C_2 = 10(0.05) = 0.5" block={false} /></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/70 to-orange-950/70 border border-amber-400/40">
                <h4 className="font-bold text-white text-sm mb-1 text-amber-300">Solución Particular Exacta:</h4>
                <div className="bg-black/60 p-3 rounded-lg text-center my-2">
                  <KaTeXMath math="x(t) = (0.05 + 0.5 t) e^{-10t}" block={true} />
                </div>
                <p className="text-xs text-gray-300 mt-2">
                  • <strong>Comportamiento físico:</strong> No posee términos senoidales (cero oscilación). Es la tasa de disipación de energía
                  más rápida posible, alcanzando el equilibrio en solo <strong>0.58 segundos</strong> sin pasar nunca al otro lado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: SOBREAMORTIGUADO */}
        {activeTab === 'sobreamortiguado' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                4. Régimen Sobreamortiguado: c = 1.5 ccr = 9000 N·s/m (ζ = 1.5)
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Retorno Lento / Fricción Elevada
              </span>
            </div>

            <div className="space-y-4 text-sm text-gray-200">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 1: Ecuación Característica y Raíces Reales</h4>
                <div className="bg-black/50 p-3 rounded text-center">
                  <KaTeXMath math="r^2 + 30r + 100 = 0 \implies r = \frac{-30 \pm \sqrt{900 - 400}}{2} = -15 \pm 5\sqrt{5}" block={true} />
                </div>
                <p className="text-xs text-purple-300 text-center mt-2">
                  r₁ = -15 + 5√5 ≈ -3.8197 (modo lento) &nbsp;|&nbsp; r₂ = -15 - 5√5 ≈ -26.1803 (modo rápido)
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2">Paso 2: Solución General y Constantes</h4>
                <div className="bg-black/50 p-3 rounded text-center mb-2">
                  <KaTeXMath math="x(t) = C_1 e^{r_1 t} + C_2 e^{r_2 t}" block={true} />
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>• C₁ + C₂ = 0.05</p>
                  <p>• r₁ C₁ + r₂ C₂ = 0 &implies; <KaTeXMath math="C_1 = 0.025 + 0.015\sqrt{5} \approx 0.05854" block={false} /></p>
                  <p>• <KaTeXMath math="C_2 = 0.025 - 0.015\sqrt{5} \approx -0.00854" block={false} /></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-400/40">
                <h4 className="font-bold text-white text-sm mb-1 text-purple-300">Solución Particular Exacta:</h4>
                <div className="bg-black/60 p-3 rounded-lg text-center my-2">
                  <KaTeXMath math="x(t) = 0.05854 e^{-3.8197 t} - 0.00854 e^{-26.1803 t}" block={true} />
                </div>
                <p className="text-xs text-gray-300 mt-2">
                  • <strong>Explicación física:</strong> El amortiguador genera tanta fuerza viscosa que el modo rápido r₂ se extingue casi de inmediato,
                  y el sistema queda gobernado por el decaimiento lento e^(-3.82t), tardando <strong>1.07 s</strong> en asentarse.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: SISTEMA DE PRIMER ORDEN */}
        {activeTab === 'sistema1orden' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              5. Conversión a Sistema de Primer Orden para Algoritmos Numéricos (RK4)
            </h3>

            <div className="space-y-4 text-sm text-gray-200">
              <p>
                Tal como instruye el documento de la Unidad 3, ningún integrador numérico computacional (Euler, Heun, RK4)
                puede resolver de forma directa una ecuación diferencial de segundo orden. Debe convertirse previamente en un sistema
                de dos ecuaciones acopladas de primer orden.
              </p>

              <div className="bg-slate-950/90 p-5 rounded-xl border border-white/10 space-y-3">
                <p className="text-amber-300 font-bold text-xs uppercase tracking-wider">// 1. Cambio de variables de estado:</p>
                <div className="text-sm text-white space-y-1">
                  <p>• <KaTeXMath math="u(t) = x(t)" block={false} /> : Posición vertical de la masa</p>
                  <p>• <KaTeXMath math="v(t) = x'(t)" block={false} /> : Velocidad vertical de la masa</p>
                </div>
                
                <p className="text-amber-300 font-bold text-xs uppercase tracking-wider pt-2">// 2. Sistema acoplado de primer orden:</p>
                <div className="bg-black/60 p-4 rounded-lg text-center">
                  <KaTeXMath math="\begin{cases} u' = v \\ v' = \dfrac{-c v - k u}{m} \end{cases}" block={true} />
                </div>
              </div>

              <div className="liquid-glass-card p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-2 text-emerald-300">Formulación del Algoritmo Runge-Kutta 4 (RK4)</h4>
                <div className="text-xs text-gray-300 space-y-2">
                  <KaTeXMath math="k_1 = f(t_i, y_i),\quad k_2 = f\left(t_i + \frac{h}{2}, y_i + \frac{h}{2}k_1\right)" block={true} />
                  <KaTeXMath math="k_3 = f\left(t_i + \frac{h}{2}, y_i + \frac{h}{2}k_2\right),\quad k_4 = f(t_i + h, y_i + h k_3)" block={true} />
                  <KaTeXMath math="Y_{i+1} = Y_i + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)" block={true} />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Error de orden local O(h⁵) y global O(h⁴). Con h = 0.0001 s, el error numérico frente a la solución exacta es inferior a 10⁻⁸ metros.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
