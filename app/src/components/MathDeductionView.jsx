import React, { useState } from 'react';
import { BookOpen, Calculator, Sigma, Presentation, Terminal, Activity, ArrowRight, Sparkles } from 'lucide-react';
import KaTeXMath from './KaTeXMath';

export default function MathDeductionView({ onNavigateToSlide }) {
  const [activeTab, setActiveTab] = useState('planteamiento');

  const tabs = [
    { id: 'planteamiento', label: '1. Planteamiento físico y EDO', slideId: 2, speaker: 'Cruz Anacona Angela' },
    { id: 'subamortiguado', label: '2. Subamortiguado (c = 1800)', slideId: 3, speaker: 'Gómez Hoyos Duban' },
    { id: 'critico', label: '3. Crítico (c = 6000)', slideId: 3, speaker: 'Gómez Hoyos Duban' },
    { id: 'sobreamortiguado', label: '4. Sobreamortiguado (c = 9000)', slideId: 4, speaker: 'Gómez Hoyos Duban' },
    { id: 'sistema1orden', label: '5. Sistema de 1er orden y RK4', slideId: 5, speaker: 'Torres Angulo Jose' },
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  const Card = ({ title, icon: Icon = Calculator, children, tone = 'blue' }) => {
    const tones = {
      blue: 'border-blue-200 bg-blue-50/60',
      amber: 'border-amber-200 bg-amber-50/70',
      purple: 'border-purple-200 bg-purple-50/70',
      emerald: 'border-emerald-200 bg-emerald-50/70',
      sky: 'border-sky-200 bg-sky-50/70',
    };
    return (
      <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${tones[tone] || tones.blue}`}>
        <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900 sm:text-base">
          <Icon className="h-4.5 w-4.5 text-blue-700" />
          {title}
        </h4>
        <div className="space-y-3 text-sm leading-relaxed text-slate-800">{children}</div>
      </div>
    );
  };

  const Formula = ({ math }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 text-center shadow-inner">
      <KaTeXMath math={math} block={true} />
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-1 sm:p-2">
      {/* Banner de Integración Total en Exposición */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,.45)]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-blue-800">
              <BookOpen className="h-4 w-4" /> Rúbrica 1.0 · Deducción matemática completa
            </div>

            {onNavigateToSlide && (
              <button
                onClick={() => onNavigateToSlide(currentTabObj.slideId)}
                className="liquid-glass-button-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 transition-all"
                title="Abrir esta deducción directamente dentro de la diapositiva de la exposición con código y simulación interactiva"
              >
                <Presentation className="w-4 h-4 text-[#0B3C73]" />
                <span>Ver en Modo Exposición (Diapositiva {currentTabObj.slideId})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-900" />
              </button>
            )}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Deducción analítica completa del modelo de suspensión
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700 sm:text-base font-medium">
            Desarrollo paso a paso de la ecuación diferencial <KaTeXMath math={"m\\,x''(t)+c\\,x'(t)+k\\,x(t)=0"} block={false} /> para un modelo de cuarto de vehículo.
            Partiendo de <KaTeXMath math={"m=300\\,\\text{kg}"} block={false} />, <KaTeXMath math={"k=30000\\,\\text{N/m}"} block={false} />, <KaTeXMath math={"x(0)=0.05\\,\\text{m}"} block={false} /> y <KaTeXMath math={"x'(0)=0"} block={false} /> (bache de 5 cm).
          </p>

          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 via-amber-50/70 to-blue-50 rounded-2xl border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Apartado Integrado:</strong> Toda esta deducción se encuentra enlazada dentro del <strong>Modo Exposición</strong> con el botón <em>"Deducción, Código & App en Vivo"</em> para comparar teoría, código (JS/Py) y física 3D en un solo lugar.
              </span>
            </div>
            {onNavigateToSlide && (
              <button
                onClick={() => onNavigateToSlide(currentTabObj.slideId)}
                className="px-3 py-1 rounded-lg bg-[#0B3C73] text-white font-bold hover:bg-blue-900 transition-colors cursor-pointer shrink-0"
              >
                Abrir Diapositiva {currentTabObj.slideId}
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition sm:text-sm cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {activeTab === 'planteamiento' && (
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-xl font-extrabold text-slate-950">
              <Sigma className="h-5 w-5 text-blue-700" /> 1. Modelo físico y ecuación diferencial canónica
            </h3>
            <p className="text-sm leading-7 text-slate-700 sm:text-base">
              Consideramos un modelo de <strong>cuarto de carro</strong>: una masa suspendida <KaTeXMath math={"m=300\\,\\text{kg}"} block={false} /> apoyada sobre un resorte de rigidez <KaTeXMath math={"k=30000\\,\\text{N/m}"} block={false} /> y un amortiguador viscoso de coeficiente <KaTeXMath math={"c"} block={false} />. Al pasar por un bache de <strong>5 cm</strong>, el desplazamiento inicial es <KaTeXMath math={"x(0)=0.05\\,\\text{m}"} block={false} /> con velocidad inicial nula <KaTeXMath math={"x'(0)=0"} block={false} />.
            </p>
            <Card title="Balance de fuerzas (Segunda Ley de Newton)" tone="blue">
              <Formula math={"\\sum F = m\\,x''(t) = -k\\,x(t) - c\\,x'(t)"} />
              <Formula math={"m\\,x''(t) + c\\,x'(t) + k\\,x(t) = 0"} />
              <Formula math={"300\\,x''(t) + c\\,x'(t) + 30000\\,x(t) = 0 \\;\\Longleftrightarrow\\; x''(t) + \\frac{c}{300}x'(t) + 100\\,x(t)=0"} />
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Frecuencia natural no amortiguada" tone="amber">
                <Formula math={"\\omega_n = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{30000}{300}} = \\sqrt{100} = 10\\,\\text{rad/s}"} />
                <p>Representa la frecuencia a la que oscilaría el sistema si no existiera disipación viscosa (<KaTeXMath math={"c=0"} block={false} />).</p>
              </Card>
              <Card title="Amortiguamiento crítico" tone="amber">
                <Formula math={"c_{cr} = 2\\sqrt{m\\,k} = 2\\sqrt{300\\times 30000} = 2\\times 3000 = 6000\\,\\text{N}\\cdot\\text{s/m}"} />
                <p>Es el valor frontera que separa la respuesta oscilatoria de la respuesta aperiódica.</p>
              </Card>
            </div>
            <Card title="Factor de amortiguamiento adimensional" tone="sky">
              <Formula math={"\\zeta = \\frac{c}{c_{cr}} = \\frac{c}{2\\sqrt{m\\,k}}"} />
              <ul className="ml-5 list-disc space-y-1">
                <li><KaTeXMath math={"\\zeta < 1"} block={false} />: subamortiguado (oscila con decaimiento).</li>
                <li><KaTeXMath math={"\\zeta = 1"} block={false} />: críticamente amortiguado (retorno más rápido sin oscilación).</li>
                <li><KaTeXMath math={"\\zeta > 1"} block={false} />: sobreamortiguado (retorno lento sin oscilación).</li>
              </ul>
            </Card>
          </div>
        )}

        {activeTab === 'subamortiguado' && (
          <div className="space-y-5">
            <h3 className="text-xl font-extrabold text-slate-950">2. Régimen subamortiguado: <KaTeXMath math={"c = 0.3\\,c_{cr} = 1800\\,\\text{N}\\cdot\\text{s/m}"} block={false} />, <KaTeXMath math={"\\zeta=0.3"} block={false} /></h3>
            <Card title="Paso 1: Ecuación característica" tone="sky">
              <Formula math={"r^2 + \\frac{1800}{300}r + 100 = 0 \\;\\Longrightarrow\\; r^2 + 6r + 100 = 0"} />
              <Formula math={"\\Delta = 6^2 - 4(1)(100) = 36 - 400 = -364 < 0"} />
            </Card>
            <Card title="Paso 2: Raíces complejas conjugadas" tone="sky">
              <Formula math={"r_{1,2} = \\frac{-6 \\pm \\sqrt{-364}}{2} = -3 \\pm i\\sqrt{91} \\approx -3 \\pm 9.5394\\,i"} />
              <p>Parte real disipativa <KaTeXMath math={"\\alpha=3\\,\\text{s}^{-1}"} block={false} /> y frecuencia amortiguada <KaTeXMath math={"\\omega_d=\\sqrt{91}\\,\\text{rad/s}"} block={false} />.</p>
            </Card>
            <Card title="Paso 3: Solución general y constantes" tone="blue">
              <Formula math={"x(t)=e^{-3t}\\left[A\\cos(\\sqrt{91}\\,t)+B\\sin(\\sqrt{91}\\,t)\\right]"} />
              <Formula math={"x(0)=A=0.05\\,\\text{m}"} />
              <Formula math={"x'(0)=-3A + B\\sqrt{91}=0 \\;\\Rightarrow\\; B=\\frac{3(0.05)}{\\sqrt{91}}=\\frac{0.15}{\\sqrt{91}}\\approx 0.01572\\,\\text{m}"} />
            </Card>
            <Card title="Solución particular exacta" tone="amber">
              <Formula math={"x(t)=e^{-3t}\\left[0.05\\cos(\\sqrt{91}\\,t)+\\frac{0.15}{\\sqrt{91}}\\sin(\\sqrt{91}\\,t)\\right]\\,\\text{m}"} />
              <p><strong>Interpretación:</strong> <KaTeXMath math={"e^{-3t}"} block={false} /> produce el decaimiento exponencial y los términos trigonométricos generan la oscilación. Para este caso se obtiene aproximadamente <KaTeXMath math={"M_p\\approx 37.23\\%"} block={false} /> y <KaTeXMath math={"t_s(2\\%)\\approx 1.12\\,\\text{s}"} block={false} />.</p>
            </Card>
          </div>
        )}

        {activeTab === 'critico' && (
          <div className="space-y-5">
            <h3 className="text-xl font-extrabold text-slate-950">3. Régimen críticamente amortiguado: <KaTeXMath math={"c=c_{cr}=6000\\,\\text{N}\\cdot\\text{s/m}"} block={false} />, <KaTeXMath math={"\\zeta=1"} block={false} /></h3>
            <Card title="Paso 1: Ecuación característica y raíz doble" tone="amber">
              <Formula math={"r^2 + \\frac{6000}{300}r + 100 = 0 \\;\\Longrightarrow\\; r^2 + 20r + 100 = (r+10)^2 = 0"} />
              <Formula math={"r_1 = r_2 = -10\\,\\text{s}^{-1}"} />
            </Card>
            <Card title="Paso 2: Solución general por reducción de orden" tone="amber">
              <Formula math={"x(t)=(C_1 + C_2 t)\\,e^{-10t}"} />
              <p>La raíz repetida obliga a introducir el factor lineal <KaTeXMath math={"t"} block={false} /> para obtener dos soluciones linealmente independientes.</p>
            </Card>
            <Card title="Paso 3: Condiciones iniciales" tone="blue">
              <Formula math={"x(0)=C_1=0.05"} />
              <Formula math={"x'(t)=C_2 e^{-10t} - 10(C_1 + C_2 t)e^{-10t} \\;\\Rightarrow\\; x'(0)=C_2 - 10C_1 = 0"} />
              <Formula math={"C_2 = 10\\,C_1 = 0.5\\,\\text{m/s}"} />
            </Card>
            <Card title="Solución particular exacta" tone="emerald">
              <Formula math={"x(t)=(0.05 + 0.5\\,t)\\,e^{-10t}\\,\\text{m}"} />
              <p><strong>Interpretación:</strong> no hay términos senoidales, por lo que no existe sobreimpulso (<KaTeXMath math={"M_p=0\\%"} block={false} />). Es el retorno más rápido al equilibrio, con asentamiento aproximado <KaTeXMath math={"t_s\\approx 0.58\\,\\text{s}"} block={false} />.</p>
            </Card>
          </div>
        )}

        {activeTab === 'sobreamortiguado' && (
          <div className="space-y-5">
            <h3 className="text-xl font-extrabold text-slate-950">4. Régimen sobreamortiguado: <KaTeXMath math={"c = 1.5\\,c_{cr} = 9000\\,\\text{N}\\cdot\\text{s/m}"} block={false} />, <KaTeXMath math={"\\zeta=1.5"} block={false} /></h3>
            <Card title="Paso 1: Ecuación característica y raíces reales" tone="purple">
              <Formula math={"r^2 + \\frac{9000}{300}r + 100 = 0 \\;\\Longrightarrow\\; r^2 + 30r + 100 = 0"} />
              <Formula math={"r_{1,2} = \\frac{-30 \\pm \\sqrt{900-400}}{2} = -15 \\pm 5\\sqrt{5}"} />
              <Formula math={"r_1 \\approx -3.8197\\,\\text{s}^{-1}, \\qquad r_2 \\approx -26.1803\\,\\text{s}^{-1}"} />
            </Card>
            <Card title="Paso 2: Solución general y constantes" tone="purple">
              <Formula math={"x(t)=C_1 e^{r_1 t} + C_2 e^{r_2 t}"} />
              <Formula math={"C_1 + C_2 = 0.05, \\qquad r_1 C_1 + r_2 C_2 = 0"} />
              <Formula math={"C_1 = \\frac{-r_2 x_0}{r_1-r_2} \\approx 0.05854, \\qquad C_2 = \\frac{r_1 x_0}{r_1-r_2} \\approx -0.00854"} />
            </Card>
            <Card title="Solución particular exacta" tone="blue">
              <Formula math={"x(t)=0.05854\\,e^{-3.8197t} - 0.00854\\,e^{-26.1803t}\\,\\text{m}"} />
              <p><strong>Interpretación:</strong> el término rápido <KaTeXMath math={"e^{-26.18t}"} block={false} /> desaparece pronto y el modo lento <KaTeXMath math={"e^{-3.82t}"} block={false} /> domina el retorno. No hay rebote (<KaTeXMath math={"M_p=0\\%"} block={false} />), pero el asentamiento es más lento que en el caso crítico (<KaTeXMath math={"t_s\\approx 1.07\\,\\text{s}"} block={false} />).</p>
            </Card>
          </div>
        )}

        {activeTab === 'sistema1orden' && (
          <div className="space-y-5">
            <h3 className="text-xl font-extrabold text-slate-950">5. Conversión a sistema de primer orden y método RK4</h3>
            <Card title="Cambio de variables de estado" tone="emerald">
              <Formula math={"u(t)=x(t), \\qquad v(t)=x'(t)"} />
              <Formula math={"\\begin{cases} u' = v \\\\[4pt] v' = \\dfrac{-c\\,v - k\\,u}{m} \\end{cases}, \\qquad u(0)=0.05,\\; v(0)=0"} />
              <p>Esta forma es necesaria porque los integradores numéricos estándar (Euler, Heun, RK4) trabajan sobre sistemas de primer orden.</p>
            </Card>
            <Card title="Algoritmo Runge-Kutta de cuarto orden (RK4)" tone="blue">
              <Formula math={"k_1 = f(t_i, y_i),\\quad k_2 = f\\!\\left(t_i+\\frac{h}{2},\\, y_i+\\frac{h}{2}k_1\\right)"} />
              <Formula math={"k_3 = f\\!\\left(t_i+\\frac{h}{2},\\, y_i+\\frac{h}{2}k_2\\right),\\quad k_4 = f(t_i+h,\\, y_i+h\\,k_3)"} />
              <Formula math={"y_{i+1} = y_i + \\frac{h}{6}\\left(k_1 + 2k_2 + 2k_3 + k_4\\right)"} />
              <p>Error local <KaTeXMath math={"O(h^5)"} block={false} /> y error global <KaTeXMath math={"O(h^4)"} block={false} />. Con pasos pequeños (por ejemplo <KaTeXMath math={"h=10^{-4}\\,\\text{s}"} block={false} />) la curva numérica se superpone con la solución analítica.</p>
            </Card>
            <Card title="Métricas de ingeniería utilizadas" tone="amber">
              <Formula math={"|x(t)| \\le 0.02\\,x_0 = 0.001\\,\\text{m} \\quad \\forall\\, t \\ge t_s \\quad (\\text{criterio del }2\\%)"} />
              <Formula math={"M_p = \\frac{|x_{min}|}{x_0}\\times 100\\% = e^{-\\frac{\\pi\\zeta}{\\sqrt{1-\\zeta^2}}}\\times 100\\% \\quad (\\zeta < 1)"} />
              <p>Estas métricas permiten comparar objetivamente confort (ambulancia) frente a rigidez y agarre (vehículo de carreras).</p>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
