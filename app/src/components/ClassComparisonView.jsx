import React, { useState } from 'react';
import {
  BookCheck, CheckCircle2, AlertCircle, Sparkles, Scale,
  Layers, Activity, HelpCircle, ArrowRight, FileText, ChevronRight
} from 'lucide-react';
import KaTeXMath from './KaTeXMath';

export default function ClassComparisonView() {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: '1. Resumen y Veredicto' },
    { id: 'fuerzas', label: '2. Planteamiento y Fuerzas (Foto 1)' },
    { id: 'libre', label: '3. Movimiento Libre ω (Foto 2)' },
    { id: 'regimenes', label: '4. Discriminante y 3 Regímenes (Foto 3)' },
    { id: 'matriz', label: '5. Matriz Comparativa Detallada' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-1 sm:p-2">
      
      {/* Portada Heroica con Estilo Liquid Glass */}
      <section className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-br from-white/95 via-sky-50/50 to-amber-50/40 p-6 sm:p-8 shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#0B3C73]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#F5A800]/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0B3C73] shadow-xs">
            <BookCheck className="h-4 w-4 text-blue-700" />
            Auditoría Académica · Cuaderno de Clase vs. Proyecto Web
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
            Comparativa: Solución de Clase vs. Simulador Web
          </h2>
          <p className="mt-3 max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
            Revisión paso a paso de los apuntes explicados por la profesora en el salón (Segunda Ley de Newton, las 3 fuerzas, el discriminante maestro <KaTeXMath math="\Delta = c^2 - 4mk" block={false} /> y la respuesta cualitativa) frente a nuestro simulador interactivo y código computacional.
          </p>

          {/* Navegador de Pestañas de la Comparativa */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  activeTab === tab.id
                    ? 'bg-[#0B3C73] text-white border border-blue-800 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PESTAÑA 1: RESUMEN Y VEREDICTO GENERAL
          ======================================================== */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          {/* Banner de Veredicto Principal */}
          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50/50 p-5 sm:p-7 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block">
                  Veredicto Académico General
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-950">
                  Nuestra web refleja con 100% de fidelidad la teoría explicada en clase
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-1">
                  Los apuntes de la profesora en las fotos 1, 2 y 3 confirman que el método deductivo aplicado en nuestro proyecto es el correcto: se parte de la Segunda Ley de Newton, se identifican las 3 fuerzas componentes, se obtiene la ecuación característica cuadrática, y se demuestra que el signo del discriminante <KaTeXMath math="\Delta = c^2 - 4mk" block={false} /> determina por completo los 3 regímenes.
                </p>
              </div>
            </div>
          </div>

          {/* Grid de 4 Puntos Clave de la Clase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="liquid-glass-card p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3C73] uppercase tracking-wider">Foto 1: Balance de Fuerzas</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  100% Coincidente
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-950">Segunda Ley de Newton y EDO</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                La profesora desglosó: fuerza del resorte <KaTeXMath math="-kx" block={false} />, amortiguador <KaTeXMath math="-cx'" block={false} />, fuerza externa <KaTeXMath math="F(t)" block={false} />. Al superar el bache, el movimiento es libre (<KaTeXMath math="F(t)=0" block={false} />), resultando <KaTeXMath math="m x'' + c x' + k x = 0" block={false} />.
              </p>
            </div>

            <div className="liquid-glass-card p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3C73] uppercase tracking-wider">Foto 2: Movimiento Libre</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  100% Coincidente
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-950">Frecuencia Natural y Solución Armónica</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Con <KaTeXMath math="c=0" block={false} />, se propone <KaTeXMath math="x(t)=e^{rt}" block={false} />, obteniendo <KaTeXMath math="r = \pm \omega i" block={false} /> con <KaTeXMath math="\omega = \sqrt{k/m}" block={false} />. En nuestra suspensión: <KaTeXMath math="\omega_n = \sqrt{30000/300} = 10\text{ rad/s}" block={false} />.
              </p>
            </div>

            <div className="liquid-glass-card p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3C73] uppercase tracking-wider">Foto 3: El Discriminante</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  100% Coincidente
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-950">“El signo define todo”</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                La profesora dictó textualmente: <KaTeXMath math="c^2 - 4mk" block={false} /> define todo: <KaTeXMath math=">0" block={false} /> sobreamortiguado, <KaTeXMath math="=0" block={false} /> crítico, <KaTeXMath math="<0" block={false} /> subamortiguado. Nuestro simulador implementa esta misma clasificación analítica.
              </p>
            </div>

            <div className="liquid-glass-card p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3C73] uppercase tracking-wider">Foto 3: Gráfica Comparativa</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  100% Coincidente
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-950">Bosquejo del Cuaderno vs Simulación RK4</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                El dibujo de la profesora muestra el crítico llegando más rápido al equilibrio, el sobreamortiguado cayendo lentamente sin oscilar, y el subamortiguado cruzando cero con oscilación. Nuestra gráfica interactiva reproduce exactamente este comportamiento físico.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PESTAÑA 2: FOTO 1 - PLANTEAMIENTO Y FUERZAS
          ======================================================== */}
      {activeTab === 'fuerzas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Tarjeta Lo visto en el Cuaderno */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C73] block mb-2">
                  1. En el Cuaderno de Clase (Foto 1)
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mb-3">
                  Segunda Ley de Newton y las 3 Fuerzas del Modelo
                </h3>
                <div className="p-3 rounded-xl bg-white border border-slate-200 mb-3 text-center">
                  <KaTeXMath math="m\frac{d^2 x}{dt^2} + c\frac{dx}{dt} + k x = F(t)" block={true} />
                </div>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p><strong>Fuerzas identificadas por la profesora:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>El resorte tira con: <KaTeXMath math="-k x" block={false} /> (Fuerza elástica restitutiva).</li>
                    <li>El amortiguador frena con: <KaTeXMath math="-c x'" block={false} /> (Fuerza disipativa viscosa opuesta a la velocidad).</li>
                    <li>Fuerza externa: <KaTeXMath math="F(t)" block={false} />.</li>
                  </ul>
                  <p className="mt-2">
                    Ecuación resultante: <KaTeXMath math="m x'' = -k x - c x' + F(t) \iff m x'' + c x' + k x = F(t)" block={false} />.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-2.5 rounded-lg bg-blue-100/70 text-center text-xs font-bold text-blue-900">
                Principio Físico Universal del Oscilador
              </div>
            </div>

            {/* Tarjeta Cómo se aplica en nuestro Proyecto */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                  2. En Nuestro Proyecto Web (Cuarto de Carro)
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mb-3">
                  Modelo de Suspensión Tras el Impacto del Bache
                </h3>
                <div className="p-3 rounded-xl bg-white border border-slate-200 mb-3 text-center">
                  <KaTeXMath math="300 x'' + c x' + 30000 x = 0 \iff x'' + \frac{c}{300}x' + 100 x = 0" block={true} />
                </div>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p><strong>Parámetros específicos asignados por la guía:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Masa suspendida: <KaTeXMath math="m = 300\text{ kg}" block={false} /> (25% de la masa del vehículo).</li>
                    <li>Rigidez del resorte: <KaTeXMath math="k = 30\,000\text{ N/m}" block={false} />.</li>
                    <li>Movimiento libre tras el bache: <KaTeXMath math="F(t) = 0" block={false} />.</li>
                    <li>Condición inicial por bache: <KaTeXMath math="x(0) = 0.05\text{ m}" block={false} /> (5 cm) y reposo <KaTeXMath math="x'(0) = 0" block={false} />.</li>
                  </ul>
                  <p className="mt-2">
                    Dividiendo la ecuación entre <KaTeXMath math="m=300" block={false} /> se obtiene la forma canónica exacta utilizada en el integrador RK4 y en la deducción analítica.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-2.5 rounded-lg bg-emerald-100/80 text-center text-xs font-bold text-emerald-900">
                Totalmente Conforme con la Rúbrica de EDO
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PESTAÑA 3: FOTO 2 - MOVIMIENTO LIBRE NO AMORTIGUADO
          ======================================================== */}
      {activeTab === 'libre' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Cuaderno */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C73] block mb-2">
                  En el Cuaderno de Clase (Foto 2)
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mb-3">
                  Movimiento Libre no Amortiguado (<KaTeXMath math="c=0, F=0" block={false} />)
                </h3>
                <div className="p-3 rounded-xl bg-white border border-slate-200 mb-3 text-center">
                  <KaTeXMath math="m x'' + k x = 0 \implies m r^2 + k = 0 \implies r = \pm \sqrt{-k/m} = \pm \omega i" block={true} />
                </div>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p>La profesora dedujo que la solución homogénea es armónica simple pura:</p>
                  <p className="font-mono bg-white p-2 rounded border border-slate-200 text-center">
                    <KaTeXMath math="x_h(t) = C_1 \cos(\omega t) + C_2 \sin(\omega t)" block={false} />
                  </p>
                  <p><strong>Ejemplo resuelto en clase:</strong></p>
                  <p>
                    Para <KaTeXMath math="m = 1\text{ kg}" block={false} />, <KaTeXMath math="k = 16\text{ N/m}" block={false} />, <KaTeXMath math="x(0)=1" block={false} />, <KaTeXMath math="x'(0)=0" block={false} />:
                    obtuvo <KaTeXMath math="\omega = \sqrt{16/1} = 4\text{ rad/s}" block={false} /> y solución <KaTeXMath math="x(t) = \cos(4t)" block={false} />.
                  </p>
                </div>
              </div>
            </div>

            {/* Proyecto */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-2">
                  En Nuestro Proyecto (Frecuencia Natural)
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mb-3">
                  Cálculo de la Frecuencia Natural del Vehículo
                </h3>
                <div className="p-3 rounded-xl bg-white border border-slate-200 mb-3 text-center">
                  <KaTeXMath math="\omega_n = \sqrt{\frac{k}{m}} = \sqrt{\frac{30000}{300}} = \sqrt{100} = 10\text{ rad/s}" block={true} />
                </div>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p>
                    Siguiendo exactamente la misma fórmula del cuaderno, la frecuencia natural de oscilación de la masa suspendida es <KaTeXMath math="\omega_n = 10\text{ rad/s}" block={false} /> (o <KaTeXMath math="f = \frac{10}{2\pi} \approx 1.59\text{ Hz}" block={false} />).
                  </p>
                  <p>
                    Si no hubiera amortiguador (<KaTeXMath math="c=0" block={false} />), la carrocería oscilaría indefinidamente según:
                  </p>
                  <p className="font-mono bg-white p-2 rounded border border-slate-200 text-center">
                    <KaTeXMath math="x(t) = 0.05 \cos(10 t)\,\text{m}" block={false} />
                  </p>
                  <p>
                    Por esta razón, la amortiguación viscosa <KaTeXMath math="c" block={false} /> es obligatoria en ingeniería automotriz para disipar la energía cinética del resorte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PESTAÑA 4: FOTO 3 - DISCRIMINANTE Y LOS 3 REGÍMENES
          ======================================================== */}
      {activeTab === 'regimenes' && (
        <div className="space-y-6">
          {/* Cita Textual de la Profesora */}
          <div className="p-4 sm:p-5 rounded-2xl border border-amber-300 bg-amber-50/70 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-1">
              Regla de Oro Enfatizada en Clase por la Profesora (Foto 3)
            </span>
            <p className="text-sm font-bold text-slate-900 italic">
              “La ecuación característica <KaTeXMath math="m r^2 + c r + k = 0" block={false} /> tiene discriminante <KaTeXMath math="c^2 - 4mk" block={false} /> y el signo nos define todo.”
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Caso 1: Subamortiguado */}
            <div className="liquid-glass-card p-4 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold block w-fit mb-2">
                  <KaTeXMath math="c^2 - 4mk < 0" block={false} />
                </span>
                <h4 className="text-sm font-extrabold text-slate-950 mb-1">Subamortiguado</h4>
                <p className="text-[11px] text-slate-600 mb-2 italic">
                  “Raíz en los complejos con parte real negativa, la masa oscila con amplitud y decae.”
                </p>
                <div className="p-2 rounded bg-white border border-slate-200 text-xs mb-2">
                  <KaTeXMath math="c = 1800 \implies \Delta = -364 < 0" block={true} />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Produce raíces <KaTeXMath math="r = -3 \pm i\sqrt{91}" block={false} />. La carrocería oscila a <KaTeXMath math="\omega_d = 9.54\text{ rad/s}" block={false} /> y rebota con un sobreimpulso del <strong>37.23%</strong>.
                </p>
              </div>
            </div>

            {/* Caso 2: Críticamente amortiguado */}
            <div className="liquid-glass-card p-4 rounded-2xl border border-amber-300 bg-amber-50/40 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold block w-fit mb-2">
                  <KaTeXMath math="c^2 - 4mk = 0" block={false} />
                </span>
                <h4 className="text-sm font-extrabold text-slate-950 mb-1">Críticamente Amortiguado</h4>
                <p className="text-[11px] text-slate-600 mb-2 italic">
                  “Una raíz real negativa, es el regreso más rápido sin posible oscilación.”
                </p>
                <div className="p-2 rounded bg-white border border-slate-200 text-xs mb-2">
                  <KaTeXMath math="c = 6000 \implies \Delta = 0" block={true} />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Raíz real repetida <KaTeXMath math="r = -10" block={false} />. Se asienta en solo <strong>0.58 s</strong> y el sobreimpulso es estrictamente <strong>0.00%</strong> (óptimo para ambulancias).
                </p>
              </div>
            </div>

            {/* Caso 3: Sobreamortiguado */}
            <div className="liquid-glass-card p-4 rounded-2xl border border-purple-200 bg-purple-50/30 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold block w-fit mb-2">
                  <KaTeXMath math="c^2 - 4mk > 0" block={false} />
                </span>
                <h4 className="text-sm font-extrabold text-slate-950 mb-1">Sobreamortiguado</h4>
                <p className="text-[11px] text-slate-600 mb-2 italic">
                  “Dos raíces reales negativas distintas, la masa al equilibrio sin oscilar.”
                </p>
                <div className="p-2 rounded bg-white border border-slate-200 text-xs mb-2">
                  <KaTeXMath math="c = 9000 \implies \Delta = 500 > 0" block={true} />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Raíces <KaTeXMath math="r_1 = -3.82, r_2 = -26.18" block={false} />. No rebota, pero el fluido viscoso frena el retorno haciéndolo 84% más tardío (<KaTeXMath math="t_s = 1.07\text{ s}" block={false} />).
                </p>
              </div>
            </div>
          </div>

          {/* Comparación del dibujo del cuaderno vs Simulación */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
            <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0B3C73]" />
              Verificación del Gráfico Dibujado a Mano en Clase (Foto 3)
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              En la Foto 3, la profesora dibujó el plano cartesiano con las 3 curvas:
            </p>
            <ul className="text-xs text-slate-700 list-disc pl-5 space-y-1">
              <li><strong>Curva Crítica:</strong> desciende de forma asintótica rápida y toca el equilibrio en el menor tiempo sin cruzar el eje horizontal.</li>
              <li><strong>Curva Sobreamortiguada:</strong> desciende por encima de la crítica, tardando mucho más tiempo en acercarse a cero.</li>
              <li><strong>Curva Subamortiguada:</strong> cruza con rapidez el eje cero, produce un rebote inferior negativo (sobreimpulso) y oscila amortiguándose.</li>
            </ul>
            <p className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              ✓ Nuestra pestaña "RK4" y el modo Exposición reproducen exactamente este mismo plano cartesiano, validado punto a punto con integración numérica de Runge-Kutta de 4to orden.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          PESTAÑA 5: MATRIZ COMPARATIVA DETALLADA
          ======================================================== */}
      {activeTab === 'matriz' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Aspecto Analizado</th>
                  <th className="p-3.5">En el Cuaderno de Clase (Fotos 1, 2, 3)</th>
                  <th className="p-3.5">En Nuestro Proyecto Web</th>
                  <th className="p-3.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-bold text-slate-950">1. Ecuación FÍsica</td>
                  <td className="p-3.5">Segunda Ley Newton: <KaTeXMath math="m x'' + c x' + k x = F(t)" block={false} /></td>
                  <td className="p-3.5">Masa-resorte-amortiguador con <KaTeXMath math="F(t)=0" block={false} /> tras el bache</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                      100% OK
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-950">2. Tres Fuerzas del Sistema</td>
                  <td className="p-3.5">Resorte (<KaTeXMath math="-kx" block={false} />), Amortiguador (<KaTeXMath math="-cx'" block={false} />), Externa (<KaTeXMath math="F(t)" block={false} />)</td>
                  <td className="p-3.5">Idéntico desglose en la deducción analítica y flashcards</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                      100% OK
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-950">3. Frecuencia Natural</td>
                  <td className="p-3.5"><KaTeXMath math="\omega = \sqrt{k/m}" block={false} /> (ejemplo con <KaTeXMath math="m=1, k=16 \implies \omega=4" block={false} />)</td>
                  <td className="p-3.5"><KaTeXMath math="\omega_n = \sqrt{30000/300} = 10\text{ rad/s}" block={false} /> para el cuarto de carro</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                      100% OK
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-950">4. Discriminante Maestro</td>
                  <td className="p-3.5">“<KaTeXMath math="\Delta = c^2 - 4mk" block={false} /> y el signo nos define todo”</td>
                  <td className="p-3.5">Evaluado analíticamente en <KaTeXMath math="c = 1800, 6000, 9000" block={false} /></td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                      100% OK
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-950">5. Curvas Gráficas</td>
                  <td className="p-3.5">Bosquejo cualitativo de las 3 curvas en el cuaderno</td>
                  <td className="p-3.5">Superposición cuantitativa 1:1 con RK4 y solución analítica</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                      100% OK
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-950">6. Analogía RLC (Foto 4)</td>
                  <td className="p-3.5">Equivalencia formal Masa-Resorte vs Circuito RLC (<KaTeXMath math="m \leftrightarrow L, c \leftrightarrow R, k \leftrightarrow 1/C" block={false} />)</td>
                  <td className="p-3.5">Mantenido como referencia conceptual secundaria sin desviar el enfoque mecánico</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                      Alineado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-slate-700 leading-relaxed font-medium">
            <strong className="text-amber-900 block mb-1 font-bold">Conclusión para la Sustentación Oral (Grupo 5):</strong>
            La sustentación está completamente blindada. Ante cualquier pregunta de la docente, el equipo puede citar directamente sus notas de clase: el balance de las 3 fuerzas, el signo del discriminante <KaTeXMath math="c^2 - 4mk" block={false} /> y la comparación cualitativa de las 3 curvas, demostrando que nuestro programa valida computacionalmente con RK4 lo que ella enseñó en el tablero.
          </div>
        </div>
      )}

    </div>
  );
}
