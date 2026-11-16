import React, { useState, useMemo } from 'react';
import KaTeXMath from './KaTeXMath';
import {
  calculateOscillatorProperties,
  rk4Integrate,
  calculateEngineeringMetrics,
  exactAnalyticalSolution
} from '../physics/suspensionPhysics';
import {
  Sliders,
  Calculator,
  Activity,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  HeartPulse,
  Trophy,
  Gauge,
  Layers,
  Check
} from 'lucide-react';

/**
 * Formateador numérico limpio para fórmulas KaTeX
 */
function fmt(val, decimals = 3) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  if (Math.abs(val) < 1e-7) return '0';
  const num = Number(val);
  if (Number.isInteger(num)) return num.toString();
  const str = num.toFixed(decimals);
  return str.includes('.') ? str.replace(/\.?0+$/, '') : str;
}

/**
 * Tarjeta individual para cada uno de los 11 pasos analíticos
 */
function StepCard({ num, title, desc, math, children, isHighlight = false }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
        isHighlight
          ? 'border-2 border-blue-400 shadow-md ring-2 ring-blue-50'
          : 'border-slate-200 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            {num}
          </span>
          <h3 className={`font-bold text-sm sm:text-base ${isHighlight ? 'text-blue-900 font-extrabold' : 'text-slate-900'}`}>
            {title}
          </h3>
        </div>
        {isHighlight && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            Solución Particular
          </span>
        )}
      </div>
      {desc && <p className="text-xs text-slate-600 mb-2 leading-relaxed">{desc}</p>}
      {math && (
        <div
          className={`p-3 rounded-xl border overflow-x-auto text-slate-900 font-medium ${
            isHighlight ? 'bg-blue-50/70 border-blue-200 text-center' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <KaTeXMath math={math} block={true} />
        </div>
      )}
      {children}
    </div>
  );
}

export default function SuspensionCalculator() {
  // --------------------------------------------------------------------------
  // ESTADO DE PARÁMETROS INTERACTIVOS DEL SISTEMA
  // --------------------------------------------------------------------------
  const [m, setM] = useState(300.0);       // Masa suspendida (cuarto de carro) [kg]
  const [k, setK] = useState(30000.0);     // Rigidez del resorte [N/m]
  const [c, setC] = useState(1800.0);      // Amortiguamiento viscoso [N·s/m]
  const [x0, setX0] = useState(0.05);      // Desplazamiento inicial por bache [m] (5 cm)
  const v0 = 0.0;                          // Velocidad inicial en reposo [m/s]

  // --------------------------------------------------------------------------
  // PRESETS RÁPIDOS OFICIALES
  // --------------------------------------------------------------------------
  const presets = [
    {
      id: 'sub',
      label: 'Subamortiguado (c=1800)',
      m: 300,
      k: 30000,
      c: 1800,
      x0: 0.05,
      icon: Activity,
      desc: '0.3 ccr · Oscilación con rebote notable (~37%)'
    },
    {
      id: 'crit',
      label: 'Crítico (c=6000)',
      m: 300,
      k: 30000,
      c: 6000,
      x0: 0.05,
      icon: CheckCircle2,
      desc: 'ccr óptimo · Retorno más rápido sin oscilación'
    },
    {
      id: 'sobre',
      label: 'Sobreamortiguado (c=9000)',
      m: 300,
      k: 30000,
      c: 9000,
      x0: 0.05,
      icon: Layers,
      desc: '1.5 ccr · Fluido muy viscoso; retorno lento'
    },
    {
      id: 'amb',
      label: 'Ambulancia',
      m: 300,
      k: 30000,
      c: 6000,
      x0: 0.05,
      icon: HeartPulse,
      desc: 'Confort clínico · Cero rebote para proteger al paciente'
    },
    {
      id: 'race',
      label: 'Carro de Carreras',
      m: 300,
      k: 50000,
      c: 8500,
      x0: 0.03,
      icon: Trophy,
      desc: 'Rigidez alta k=50k · Máximo agarre aerodinámico'
    }
  ];

  const applyPreset = (preset) => {
    setM(preset.m);
    setK(preset.k);
    setC(preset.c);
    setX0(preset.x0);
  };

  // --------------------------------------------------------------------------
  // CÁLCULOS FÍSICOS Y MATEMÁTICOS REACTIVOS EN TIEMPO REAL
  // --------------------------------------------------------------------------
  const physics = useMemo(() => {
    // 1. Frecuencia natural y amortiguamiento crítico
    const { omega_n, c_cr, zeta, regimen, omega_d } = calculateOscillatorProperties(m, k, c);
    const fn = omega_n / (2 * Math.PI);
    const alpha = c / (2 * m); // Factor de decaimiento: alpha = zeta * omega_n

    // 2. Coeficientes de la ecuación característica: r^2 + (c/m)r + (k/m) = 0
    const a1 = c / m;
    const a0 = k / m;
    const discriminant = a1 * a1 - 4 * a0;

    // 3. Raíces y constantes según el régimen
    let r1 = 0;
    let r2 = 0;
    let r1Str = '';
    let r2Str = '';
    let A = 0;
    let B = 0;
    let C1 = 0;
    let C2 = 0;
    let generalSolLatex = '';
    let constantsLatex = '';
    let particularSolLatex = '';
    let theoreticalMp = 0;
    let theoreticalTs = 0;
    let regimeBadgeColor = '';
    let regimeDesc = '';

    const EPSILON = 1e-4;

    if (Math.abs(zeta - 1.0) <= EPSILON) {
      // RÉGIMEN CRÍTICAMENTE AMORTIGUADO (zeta = 1)
      regimeBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
      regimeDesc = 'Retorno al punto de equilibrio en el tiempo mínimo posible sin sobrepasar el nivel cero.';
      r1 = -omega_n;
      r2 = -omega_n;
      r1Str = `-${fmt(omega_n, 3)}`;
      r2Str = `-${fmt(omega_n, 3)}`;

      C1 = x0;
      C2 = v0 + omega_n * x0; // Con v0 = 0 -> C2 = omega_n * x0

      generalSolLatex = 'x(t) = (C_1 + C_2 t) e^{-\\omega_n t}';
      constantsLatex = `\\begin{aligned}
        x(0) &= C_1 = x_0 = ${fmt(x0, 4)}\\text{ m} \\\\[3pt]
        x'(0) &= C_2 - \\omega_n C_1 = 0 \\implies C_2 = \\omega_n x_0 = (${fmt(omega_n, 3)})(${fmt(x0, 4)}) = ${fmt(C2, 4)}\\text{ m/s}
      \\end{aligned}`;

      particularSolLatex = `x(t) = \\left(${fmt(C1, 4)} + ${fmt(C2, 4)} t\\right) e^{-${fmt(omega_n, 3)} t}\\text{ m}`;
      theoreticalMp = 0.0;
      theoreticalTs = 5.83 / omega_n;

    } else if (zeta < 1.0) {
      // RÉGIMEN SUBAMORTIGUADO (zeta < 1)
      regimeBadgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      regimeDesc = 'La fuerza del resorte domina la disipación viscosa. La masa oscila con amplitud decreciente exponencial.';
      r1Str = `-${fmt(alpha, 3)} + ${fmt(omega_d, 3)} i`;
      r2Str = `-${fmt(alpha, 3)} - ${fmt(omega_d, 3)} i`;

      A = x0;
      B = (v0 + alpha * x0) / omega_d; // Con v0 = 0 -> B = (alpha * x0) / omega_d

      generalSolLatex = 'x(t) = e^{-\\alpha t} \\left[ A \\cos(\\omega_d t) + B \\sin(\\omega_d t) \\right]';
      constantsLatex = `\\begin{aligned}
        x(0) &= A = x_0 = ${fmt(x0, 4)}\\text{ m} \\\\[3pt]
        x'(0) &= -\\alpha A + \\omega_d B = 0 \\implies B = \\frac{\\alpha x_0}{\\omega_d} = \\frac{(${fmt(alpha, 3)})(${fmt(x0, 4)})}{${fmt(omega_d, 3)}} = ${fmt(B, 5)}\\text{ m}
      \\end{aligned}`;

      particularSolLatex = `x(t) = e^{-${fmt(alpha, 3)} t} \\left[ ${fmt(A, 4)} \\cos(${fmt(omega_d, 3)} t) + ${fmt(B, 4)} \\sin(${fmt(omega_d, 3)} t) \\right]\\text{ m}`;
      theoreticalMp = Math.exp((-Math.PI * zeta) / Math.sqrt(1.0 - zeta * zeta)) * 100.0;
      theoreticalTs = 4.0 / alpha;

    } else {
      // RÉGIMEN SOBREAMORTIGUADO (zeta > 1)
      regimeBadgeColor = 'bg-purple-100 text-purple-800 border-purple-300';
      regimeDesc = 'Resistencia viscosa dominante. Sin oscilaciones, pero el retorno al reposo es lento e inadecuado para baches repetidos.';
      const delta = omega_n * Math.sqrt(zeta * zeta - 1.0);
      r1 = -alpha + delta; // Polo dominante lento
      r2 = -alpha - delta; // Polo rápido
      r1Str = `${fmt(r1, 3)}`;
      r2Str = `${fmt(r2, 3)}`;

      C1 = (v0 - r2 * x0) / (r1 - r2);
      C2 = (r1 * x0 - v0) / (r1 - r2);

      generalSolLatex = 'x(t) = C_1 e^{r_1 t} + C_2 e^{r_2 t}';
      constantsLatex = `\\begin{aligned}
        C_1 + C_2 &= x_0 = ${fmt(x0, 4)}\\text{ m} \\\\[3pt]
        r_1 C_1 + r_2 C_2 &= 0 \\implies C_1 = \\frac{-r_2 x_0}{r_1 - r_2} = ${fmt(C1, 5)}\\text{ m}, \\quad C_2 = \\frac{r_1 x_0}{r_1 - r_2} = ${fmt(C2, 5)}\\text{ m}
      \\end{aligned}`;

      const c2Sign = C2 >= 0 ? `+ ${fmt(C2, 4)}` : `- ${fmt(Math.abs(C2), 4)}`;
      particularSolLatex = `x(t) = ${fmt(C1, 4)} e^{${fmt(r1, 3)} t} ${c2Sign} e^{${fmt(r2, 3)} t}\\text{ m}`;
      theoreticalMp = 0.0;
      theoreticalTs = Math.log((0.02 * x0) / Math.abs(C1 || 1e-4)) / r1;
    }

    // 4. Integrador numérico RK4 para cálculo riguroso de métricas
    const simTf = Math.max(3.0, Math.min(8.0, 7.0 / (zeta < 1.0 ? alpha : Math.abs(r1 || 1.0))));
    const { t: tArr, x: xArr } = rk4Integrate(m, c, k, x0, v0, simTf, 0.0005);
    const metrics = calculateEngineeringMetrics(tArr, xArr, m, c, k, x0, v0);

    return {
      omega_n,
      fn,
      c_cr,
      zeta,
      regimen,
      regimeBadgeColor,
      regimeDesc,
      omega_d,
      alpha,
      a1,
      a0,
      discriminant,
      r1,
      r2,
      r1Str,
      r2Str,
      A,
      B,
      C1,
      C2,
      generalSolLatex,
      constantsLatex,
      particularSolLatex,
      theoreticalMp,
      theoreticalTs,
      settlingTime: metrics.settlingTime,
      overshootPct: metrics.overshootPct,
      minDisplacement: metrics.minDisplacement,
      maxRk4Error: metrics.maxRk4Error
    };
  }, [m, k, c, x0]);

  // --------------------------------------------------------------------------
  // MATRIZ COMPARATIVA DE REGÍMENES
  // --------------------------------------------------------------------------
  const comparisonRows = useMemo(() => {
    return presets.map((preset) => {
      const props = calculateOscillatorProperties(preset.m, preset.k, preset.c);
      const alphaP = preset.c / (2 * preset.m);
      let rootsDisplay = '';

      if (Math.abs(props.zeta - 1.0) < 1e-4) {
        rootsDisplay = `-${fmt(props.omega_n, 1)} (doble)`;
      } else if (props.zeta < 1.0) {
        rootsDisplay = `-${fmt(alphaP, 1)} ± ${fmt(props.omega_d, 1)}i`;
      } else {
        const deltaP = props.omega_n * Math.sqrt(props.zeta * props.zeta - 1.0);
        rootsDisplay = `${fmt(-alphaP + deltaP, 1)}, ${fmt(-alphaP - deltaP, 1)}`;
      }

      const { t, x } = rk4Integrate(preset.m, preset.c, preset.k, preset.x0, 0, 3.0, 0.001);
      const met = calculateEngineeringMetrics(t, x, preset.m, preset.c, preset.k, preset.x0, 0);

      const isActive =
        Math.abs(preset.m - m) < 1 &&
        Math.abs(preset.k - k) < 1 &&
        Math.abs(preset.c - c) < 5 &&
        Math.abs(preset.x0 - x0) < 0.005;

      return {
        ...preset,
        zeta: props.zeta,
        regimen: props.regimen,
        rootsDisplay,
        settlingTime: met.settlingTime,
        overshootPct: met.overshootPct,
        isActive
      };
    });
  }, [m, k, c, x0, presets]);

  // Configuración de los cuatro inputs duales (número + slider)
  const inputConfig = [
    {
      id: 'm',
      label: 'Masa suspendida',
      symbol: 'm',
      unit: 'kg',
      val: m,
      setVal: setM,
      min: 50,
      max: 1200,
      step: 5,
      minLabel: '50 kg',
      midLabel: '300 kg (Estándar)',
      maxLabel: '1200 kg'
    },
    {
      id: 'k',
      label: 'Rigidez resorte',
      symbol: 'k',
      unit: 'N/m',
      val: k,
      setVal: setK,
      min: 5000,
      max: 100000,
      step: 500,
      minLabel: '5 kN/m',
      midLabel: '30 kN/m (Rúbrica)',
      maxLabel: '100 kN/m'
    },
    {
      id: 'c',
      label: 'Amortiguador viscoso',
      symbol: 'c',
      unit: 'N·s/m',
      val: c,
      setVal: setC,
      min: 100,
      max: 15000,
      step: 50,
      minLabel: '100',
      midLabel: `Crítico (${fmt(physics.c_cr, 0)})`,
      maxLabel: '15 000'
    },
    {
      id: 'x0',
      label: 'Bache inicial',
      symbol: 'x₀',
      unit: 'm',
      val: x0,
      setVal: setX0,
      min: 0.01,
      max: 0.20,
      step: 0.005,
      minLabel: '1 cm',
      midLabel: '5 cm (0.05 m)',
      maxLabel: '20 cm'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-800">
      
      {/* ======================================================================
          CABECERA SUPERIOR: BANNER Y PRESETS RÁPIDOS
          ====================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                Deducción Analítica & Simulador en Tiempo Real
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Unidad 3 · EDO 2° Orden
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Calculador de Suspensión Vehicular
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Resuelve analíticamente la EDO canónica{' '}
              <strong className="text-blue-900 font-mono">m x''(t) + c x'(t) + k x(t) = 0</strong>{' '}
              con <strong className="text-blue-900 font-mono">x(0) = x₀, x'(0) = 0</strong>{' '}
              y actualiza en tiempo real cada fórmula con KaTeX al modificar cualquier parámetro.
            </p>
          </div>

          <button
            onClick={() => {
              setM(300);
              setK(30000);
              setC(6000);
              setX0(0.05);
            }}
            className="self-start md:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 shadow-sm transition-all cursor-pointer"
            title="Restablecer caso crítico óptimo (c=6000)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Resetear Parámetros</span>
          </button>
        </div>

        {/* BOTONES DE PRESET RÁPIDO */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Presets Oficiales:
          </span>
          {presets.map((p) => {
            const Icon = p.icon;
            const isMatch =
              Math.abs(p.m - m) < 1 &&
              Math.abs(p.k - k) < 1 &&
              Math.abs(p.c - c) < 5 &&
              Math.abs(p.x0 - x0) < 0.005;

            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isMatch
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
                }`}
                title={p.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isMatch ? 'text-white' : 'text-blue-600'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================================
          GRID PRINCIPAL: PANEL IZQUIERDO (INPUTS) + PANEL DERECHO (PASOS DEDUCIDOS)
          ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --------------------------------------------------------------------
            PANEL IZQUIERDO: CONTROLES DE ENTRADA (SLIDERS + CAMPOS NUMÉRICOS)
            -------------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5 sticky top-20">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Sliders className="w-5 h-5 text-blue-600" />
                <span>Variables del Sistema</span>
              </div>
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                1/4 Vehículo
              </span>
            </div>

            {/* CAMPOS DE ENTRADA (NÚMERO + SLIDER) */}
            {inputConfig.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor={`input-${item.id}`} className="font-semibold text-slate-700 flex items-center gap-1">
                    <span>{item.label}</span>
                    <span className="font-mono text-blue-700 font-bold">({item.symbol})</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`input-${item.id}`}
                      type="number"
                      step={item.step}
                      min={item.min}
                      max={item.max}
                      value={item.val}
                      onChange={(e) => item.setVal(Math.max(0.001, parseFloat(e.target.value) || 0))}
                      className="w-24 px-2 py-1 text-right font-mono text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900"
                    />
                    <span className="text-slate-500 font-medium text-[11px]">{item.unit}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={item.val}
                  onChange={(e) => item.setVal(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{item.minLabel}</span>
                  <span className="text-slate-600 font-semibold">{item.midLabel}</span>
                  <span>{item.maxLabel}</span>
                </div>
              </div>
            ))}

            {/* MONITOR EN VIVO DE MÉTRICAS */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Régimen Dinámico:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${physics.regimeBadgeColor}`}>
                  {physics.regimen}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Frecuencia Natural (ωn):</span>
                <span className="font-mono font-bold text-blue-900">{fmt(physics.omega_n, 2)} rad/s</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Amortiguador Crítico (ccr):</span>
                <span className="font-mono font-bold text-blue-900">{fmt(physics.c_cr, 1)} N·s/m</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Factor Amortiguamiento (ζ):</span>
                <span className="font-mono font-bold text-blue-900">{fmt(physics.zeta, 3)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-700 pt-2 border-t border-slate-200">
                <span>Tiempo Asentamiento (ts 2%):</span>
                <span className="font-mono font-bold text-amber-700">{fmt(physics.settlingTime, 3)} s</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Sobreimpulso (Mp):</span>
                <span className="font-mono font-bold text-amber-700">{fmt(physics.overshootPct, 2)}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* --------------------------------------------------------------------
            PANEL DERECHO: 11 PASOS FORMALES CON LATEX EN TIEMPO REAL
            -------------------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* PASO 1 */}
          <StepCard
            num={1}
            title="Frecuencia Natural del Sistema (ωn)"
            desc="Velocidad angular intrínseca con la cual oscilaría libremente la carrocería en ausencia total de amortiguamiento viscoso (c = 0):"
            math={`\\omega_n = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{${fmt(k, 1)}}{${fmt(m, 1)}}} = ${fmt(physics.omega_n, 3)}\\text{ rad/s} \\quad \\implies \\quad f_n = \\frac{\\omega_n}{2\\pi} = ${fmt(physics.fn, 3)}\\text{ Hz}`}
          />

          {/* PASO 2 */}
          <StepCard
            num={2}
            title="Amortiguamiento Crítico (ccr)"
            desc="Constante límite que marca la frontera matemática exacta entre el régimen oscilatorio y el no oscilatorio:"
            math={`c_{cr} = 2\\sqrt{m \\cdot k} = 2\\sqrt{(${fmt(m, 1)})(${fmt(k, 1)})} = 2(${fmt(m, 1)})(${fmt(physics.omega_n, 3)}) = ${fmt(physics.c_cr, 2)}\\text{ N}\\cdot\\text{s/m}`}
          />

          {/* PASO 3 */}
          <StepCard
            num={3}
            title="Factor de Amortiguamiento Adimensional (ζ)"
            desc="Razón adimensional entre el amortiguador físico implementado y la capacidad crítica del oscilador:"
            math={`\\zeta = \\frac{c}{c_{cr}} = \\frac{${fmt(c, 1)}}{${fmt(physics.c_cr, 2)}} = ${fmt(physics.zeta, 4)}`}
          />

          {/* PASO 4 */}
          <StepCard
            num={4}
            title="Clasificación del Régimen Dinámico"
            desc="Diagnóstico cualitativo según el valor numérico del factor de amortiguamiento ζ:"
          >
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${physics.regimeBadgeColor}`}>
                  {physics.regimen}
                </span>
                <span className="text-xs text-slate-600 font-semibold font-mono">
                  {physics.zeta < 0.999 && `(\\zeta = ${fmt(physics.zeta, 3)} < 1)`}
                  {Math.abs(physics.zeta - 1.0) <= 0.001 && `(\\zeta \\approx 1.000)`}
                  {physics.zeta > 1.001 && `(\\zeta = ${fmt(physics.zeta, 3)} > 1)`}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {physics.regimeDesc}
              </p>
            </div>
          </StepCard>

          {/* PASO 5 */}
          <StepCard
            num={5}
            title="Ecuación Característica y Discriminante (Δ)"
            desc="Planteamiento de la solución exponencial x(t) = e^(rt) en la ecuación diferencial homogénea canónica:"
          >
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 overflow-x-auto text-slate-900 space-y-2">
              <KaTeXMath math={`m r^2 + c r + k = 0 \\iff r^2 + \\left(\\frac{c}{m}\\right) r + \\left(\\frac{k}{m}\\right) = 0`} block={true} />
              <KaTeXMath math={`r^2 + \\left(\\frac{${fmt(c, 1)}}{${fmt(m, 1)}}\\right) r + \\left(\\frac{${fmt(k, 1)}}{${fmt(m, 1)}}\\right) = 0 \\implies r^2 + ${fmt(physics.a1, 3)} r + ${fmt(physics.a0, 3)} = 0`} block={true} />
              <KaTeXMath math={`\\Delta = \\left(\\frac{c}{m}\\right)^2 - 4\\left(\\frac{k}{m}\\right) = (${fmt(physics.a1, 3)})^2 - 4(${fmt(physics.a0, 3)}) = ${fmt(physics.discriminant, 2)}`} block={true} />
            </div>
          </StepCard>

          {/* PASO 6 */}
          <StepCard
            num={6}
            title="Raíces de la Ecuación Característica (r1, r2)"
            desc="Soluciones numéricas obtenidas mediante la fórmula general cuadrática:"
          >
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 overflow-x-auto text-slate-900">
              {physics.zeta < 0.999 && (
                <KaTeXMath
                  math={`r_{1,2} = -\\alpha \\pm i \\omega_d = -${fmt(physics.alpha, 3)} \\pm ${fmt(physics.omega_d, 3)} i\\text{ s}^{-1} \\quad (\\omega_d = ${fmt(physics.omega_d, 3)}\\text{ rad/s})`}
                  block={true}
                />
              )}
              {Math.abs(physics.zeta - 1.0) <= 0.001 && (
                <KaTeXMath
                  math={`r_1 = r_2 = -\\omega_n = -\\frac{c}{2m} = -${fmt(physics.omega_n, 3)}\\text{ s}^{-1} \\quad (\\text{raíz real doble})`}
                  block={true}
                />
              )}
              {physics.zeta > 1.001 && (
                <KaTeXMath
                  math={`r_1 = ${fmt(physics.r1, 3)}\\text{ s}^{-1}, \\quad r_2 = ${fmt(physics.r2, 3)}\\text{ s}^{-1} \\quad (\\text{dos raíces reales negativas distintas})`}
                  block={true}
                />
              )}
            </div>
          </StepCard>

          {/* PASO 7 */}
          <StepCard
            num={7}
            title="Forma Simbólica de la Solución General"
            desc="Combinación lineal del conjunto fundamental de soluciones según el tipo de raíces halladas:"
            math={physics.generalSolLatex}
          />

          {/* PASO 8 */}
          <StepCard
            num={8}
            title="Constantes por Condiciones Iniciales [x(0)=x₀, x'(0)=0]"
            desc={`Determinación algebraica unívoca imponiendo desplazamiento x(0) = ${fmt(x0, 3)} m y reposo x'(0) = 0 m/s:`}
            math={physics.constantsLatex}
          />

          {/* PASO 9 - HIGHLIGHT */}
          <StepCard
            num={9}
            title="SOLUCIÓN PARTICULAR CON VALORES SUSTITUIDOS"
            desc="Expresión matemática definitiva que describe la trayectoria exacta de la suspensión para todo instante t ≥ 0:"
            math={physics.particularSolLatex}
            isHighlight={true}
          />

          {/* PASOS 10 Y 11 EN GRID DUAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* PASO 10 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  10
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Tiempo de Asentamiento (ts al 2%)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Criterio del 2%: <KaTeXMath math={`|x(t_s)| \\le 0.02 x_0 = ${fmt(0.02 * x0 * 100, 2)}\\text{ mm}`} block={false} />
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-1">
                <div className="text-2xl font-black text-amber-600 font-mono">
                  {fmt(physics.settlingTime, 3)} s
                </div>
                <div className="text-[10px] text-slate-500">
                  Aprox. Analítica:{' '}
                  <span className="font-mono font-semibold">{fmt(physics.theoreticalTs, 2)} s</span>
                </div>
              </div>
            </div>

            {/* PASO 11 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  11
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Sobreimpulso Porcentual (Mp)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Magnitud del rebote en dirección opuesta al bache:
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-1">
                <div className="text-2xl font-black text-amber-600 font-mono">
                  {fmt(physics.overshootPct, 2)}%
                </div>
                <div className="text-[10px] text-slate-500">
                  {physics.overshootPct > 0 ? (
                    <span>
                      Rebote opuesto: <span className="font-mono font-semibold">{fmt(Math.abs(physics.minDisplacement) * 100, 2)} cm</span>
                    </span>
                  ) : (
                    <span>Sin oscilación (decae suavemente)</span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================================
          PARTE INFERIOR: TABLA COMPARATIVA ELEGANTE (LIGHT THEME)
          ====================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              <span>Matriz Comparativa de Desempeño y Regímenes de Suspensión</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contraste cuantitativo de parámetros, amortiguamiento, tiempo de asentamiento y sobreimpulso.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 self-start sm:self-auto">
            Rúbrica de Evaluación 5.0
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3 font-bold">Caso de Estudio</th>
                <th className="py-3 px-2 font-bold text-center">Masa (m)</th>
                <th className="py-3 px-2 font-bold text-center">Rigidez (k)</th>
                <th className="py-3 px-2 font-bold text-center">Amort. (c)</th>
                <th className="py-3 px-2 font-bold text-center">Factor (ζ)</th>
                <th className="py-3 px-2 font-bold text-center">Raíces (r)</th>
                <th className="py-3 px-2 font-bold text-center">ts (2%)</th>
                <th className="py-3 px-2 font-bold text-center">Mp (%)</th>
                <th className="py-3 px-3 font-bold">Comportamiento Dinámico</th>
                <th className="py-3 px-2 font-bold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {comparisonRows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.isActive ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {row.isActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                      <span>{row.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono">{row.m} kg</td>
                  <td className="py-3 px-2 text-center font-mono">{row.k / 1000} kN/m</td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-slate-900">{row.c}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-blue-700">
                    {fmt(row.zeta, 2)}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-600">
                    {row.rootsDisplay}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-amber-700">
                    {fmt(row.settlingTime, 2)} s
                  </td>
                  <td className="py-3 px-2 text-center font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        row.overshootPct > 20
                          ? 'bg-rose-100 text-rose-700'
                          : row.overshootPct > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {fmt(row.overshootPct, 1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-600 max-w-xs">{row.desc}</td>
                  <td className="py-3 px-2 text-center">
                    {row.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        Activo
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          const target = presets.find((p) => p.id === row.id);
                          if (target) applyPreset(target);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300 transition-all cursor-pointer"
                      >
                        Cargar
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {/* FILA DINÁMICA DE CONFIGURACIÓN PERSONALIZADA EN TIEMPO REAL */}
              <tr className="bg-amber-50/40 border-t-2 border-amber-200 font-semibold">
                <td className="py-3 px-3 text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tu Configuración en Vivo</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center font-mono">{fmt(m, 1)} kg</td>
                <td className="py-3 px-2 text-center font-mono">{fmt(k / 1000, 1)} kN/m</td>
                <td className="py-3 px-2 text-center font-mono font-bold text-slate-900">{fmt(c, 0)}</td>
                <td className="py-3 px-2 text-center font-mono font-bold text-blue-700">
                  {fmt(physics.zeta, 3)}
                </td>
                <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-800">
                  {physics.r1Str}
                </td>
                <td className="py-3 px-2 text-center font-mono font-bold text-amber-700">
                  {fmt(physics.settlingTime, 3)} s
                </td>
                <td className="py-3 px-2 text-center font-mono font-bold text-slate-900">
                  {fmt(physics.overshootPct, 2)}%
                </td>
                <td className="py-3 px-3 text-[11px] text-slate-700">
                  {physics.regimen} · Disipación instantánea
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    En Vivo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
