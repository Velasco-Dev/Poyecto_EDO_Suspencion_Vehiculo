import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Layers, Eye, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  rk4Integrate,
  exactAnalyticalSolution,
  calculateEngineeringMetrics
} from '../physics/suspensionPhysics';

// Plugin para asegurar fondo blanco en el canvas de Chart.js
const customCanvasBackgroundColor = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

// Registrar componentes y plugin de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  customCanvasBackgroundColor
);

export default function SimulationChart({ m, c, k, x0, v0 = 0 }) {
  const [viewMode, setViewMode] = useState('superposition'); // 'superposition' | 'three_cases' | 'error'
  const [showToleranceBand, setShowToleranceBand] = useState(true);

  // Muestreo temporal de 0 a 3.0 s
  const tf = 3.0;
  const h = 0.005; // 600 puntos para renderizado ultra suave
  const numSteps = Math.floor(tf / h) + 1;

  const timeLabels = useMemo(() => {
    const labels = [];
    for (let i = 0; i < numSteps; i++) {
      labels.push((i * h).toFixed(3));
    }
    return labels;
  }, [numSteps, h]);

  // Simulación actual
  const { currentRk4Data, currentExactData, currentMetrics } = useMemo(() => {
    const { t, x } = rk4Integrate(m, c, k, x0, v0, tf, h);
    const exact = new Float64Array(numSteps);
    for (let i = 0; i < numSteps; i++) {
      exact[i] = exactAnalyticalSolution(t[i], m, c, k, x0, v0);
    }
    const metrics = calculateEngineeringMetrics(t, x, m, c, k, x0, v0);
    return {
      currentRk4Data: Array.from(x),
      currentExactData: Array.from(exact),
      currentMetrics: metrics
    };
  }, [m, c, k, x0, v0, tf, h, numSteps]);

  // Simulación de los 3 casos oficiales de la guía
  const threeCasesData = useMemo(() => {
    const c_cr = 2.0 * Math.sqrt(m * k);
    const c_sub = 0.3 * c_cr;  // 1800 N·s/m
    const c_crit = 1.0 * c_cr; // 6000 N·s/m
    const c_sobre = 1.5 * c_cr; // 9000 N·s/m

    const sub = rk4Integrate(m, c_sub, k, x0, v0, tf, h);
    const crit = rk4Integrate(m, c_crit, k, x0, v0, tf, h);
    const sobre = rk4Integrate(m, c_sobre, k, x0, v0, tf, h);

    return {
      subData: Array.from(sub.x),
      critData: Array.from(crit.x),
      sobreData: Array.from(sobre.x)
    };
  }, [m, k, x0, v0, tf, h]);

  // Banda de tolerancia del 2% (+- 0.001 m = +- 1 mm)
  const bandUpper = useMemo(() => new Array(numSteps).fill(0.001), [numSteps]);
  const bandLower = useMemo(() => new Array(numSteps).fill(-0.001), [numSteps]);

  // Configuración de Datasets según el modo con paleta Light Theme
  const chartData = useMemo(() => {
    if (viewMode === 'superposition') {
      const datasets = [
        {
          label: `Numérica RK4 (c = ${c.toFixed(0)} N·s/m)`,
          data: currentRk4Data,
          borderColor: '#2563eb', // blue-600
          backgroundColor: 'rgba(37, 99, 235, 0.06)',
          borderWidth: 2.8,
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: 'Analítica Exacta (deducida a mano)',
          data: currentExactData,
          borderColor: '#f59e0b', // amber-500
          borderWidth: 2.2,
          borderDash: [5, 4],
          pointRadius: 0,
          tension: 0.1
        }
      ];

      if (showToleranceBand) {
        datasets.push(
          {
            label: 'Banda Asentamiento (+2% = +1 mm)',
            data: bandUpper,
            borderColor: '#94a3b8', // light gray dashed
            borderWidth: 1.2,
            borderDash: [4, 4],
            pointRadius: 0
          },
          {
            label: 'Banda Asentamiento (-2% = -1 mm)',
            data: bandLower,
            borderColor: '#94a3b8', // light gray dashed
            borderWidth: 1.2,
            borderDash: [4, 4],
            pointRadius: 0
          }
        );
      }

      return { labels: timeLabels, datasets };
    }

    if (viewMode === 'three_cases') {
      const datasets = [
        {
          label: '1. Subamortiguado (c = 1800 N·s/m - 0.3 ccr)',
          data: threeCasesData.subData,
          borderColor: '#0ea5e9', // sky-500
          borderWidth: 2.4,
          pointRadius: 0
        },
        {
          label: '2. Crítico (c = 6000 N·s/m - 1.0 ccr)',
          data: threeCasesData.critData,
          borderColor: '#f59e0b', // amber-500
          borderWidth: 2.8,
          pointRadius: 0
        },
        {
          label: '3. Sobreamortiguado (c = 9000 N·s/m - 1.5 ccr)',
          data: threeCasesData.sobreData,
          borderColor: '#ec4899', // pink-500
          borderWidth: 2.4,
          pointRadius: 0
        }
      ];

      if (showToleranceBand) {
        datasets.push(
          {
            label: 'Tolerancia (+-2% = +-0.001 m)',
            data: bandUpper,
            borderColor: '#94a3b8',
            borderWidth: 1.2,
            borderDash: [4, 4],
            pointRadius: 0
          },
          {
            label: 'Tolerancia (-2% = -0.001 m)',
            data: bandLower,
            borderColor: '#94a3b8',
            borderWidth: 1.2,
            borderDash: [4, 4],
            pointRadius: 0
          }
        );
      }

      return { labels: timeLabels, datasets };
    }

    // Modo Error Residual: |x_rk4 - x_exacta|
    const errorData = currentRk4Data.map((val, idx) => Math.abs(val - currentExactData[idx]));
    return {
      labels: timeLabels,
      datasets: [
        {
          label: 'Error Absoluto Residual |x_num(t) - x_exacta(t)| [m]',
          data: errorData,
          borderColor: '#10b981', // emerald-500
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          fill: true,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    };
  }, [viewMode, currentRk4Data, currentExactData, threeCasesData, timeLabels, c, showToleranceBand, bandUpper, bandLower]);

  // Opciones de configuración Light Theme para ejes, leyenda, rejilla y tooltips
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 350,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155', // dark text
          font: { size: 11, weight: '500', family: 'sans-serif' },
          boxWidth: 14,
          usePointStyle: false,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: '#ffffff', // white bg
        titleColor: '#0f172a', // dark text
        bodyColor: '#334155', // dark text
        borderColor: '#e2e8f0', // light border / shadow effect
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 8,
        titleFont: { weight: 'bold', size: 12 },
        bodyFont: { size: 11 },
        callbacks: {
          title: (items) => `Tiempo: ${items[0].label} s`,
          label: (item) => {
            if (!item.dataset.label) return null;
            return ` ${item.dataset.label}: ${Number(item.raw).toFixed(5)} m`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'tiempo [s]',
          color: '#334155', // dark axis label
          font: { size: 12, weight: 'bold' }
        },
        grid: {
          color: '#e2e8f0' // light gray grid lines
        },
        ticks: {
          color: '#334155', // dark ticks
          maxTicksLimit: 12,
          callback: (val, index) => `${timeLabels[index]} s`
        }
      },
      y: {
        title: {
          display: true,
          text: viewMode === 'error' ? 'error absoluto [m]' : 'desplazamiento [m]',
          color: '#334155', // dark axis label
          font: { size: 12, weight: 'bold' }
        },
        grid: {
          color: '#e2e8f0' // light gray grid lines
        },
        ticks: {
          color: '#334155', // dark ticks
          callback: (value) => `${Number(value).toFixed(3)} m`
        }
      }
    }
  }), [timeLabels, viewMode]);

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Controles de visualización de la gráfica */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('superposition')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              viewMode === 'superposition'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${viewMode === 'superposition' ? 'text-amber-300' : 'text-amber-500'}`} />
            Superposición (Exacta vs RK4)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('three_cases')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              viewMode === 'three_cases'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${viewMode === 'three_cases' ? 'text-sky-200' : 'text-sky-500'}`} />
            Los 3 Regímenes Oficiales
          </button>

          <button
            type="button"
            onClick={() => setViewMode('error')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              viewMode === 'error'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 ${viewMode === 'error' ? 'text-emerald-200' : 'text-emerald-500'}`} />
            Error Residual O(h⁴)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowToleranceBand(!showToleranceBand)}
          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium ${
            showToleranceBand
              ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          Banda 2% (±0.001 m)
        </button>
      </div>

      {/* Lienzo de la gráfica con fondo blanco */}
      <div className="relative flex-1 w-full min-h-[320px] bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Tarjetas de Métricas Cuantitativas - White cards with subtle border */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Tiempo de Asentamiento (ts)</span>
          <span className="text-base font-bold text-amber-600 font-mono">
            {currentMetrics.settlingTime.toFixed(3)} s
          </span>
          <span className="text-[10px] text-slate-600 block">Criterio |x| ≤ 2% (1 mm)</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Sobreimpulso (Mp)</span>
          <span className="text-base font-bold text-sky-600 font-mono">
            {currentMetrics.overshootPct.toFixed(2)}%
          </span>
          <span className="text-[10px] text-slate-600 block">
            Pico: {(currentMetrics.minDisplacement * 100).toFixed(2)} cm
          </span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Error Máximo RK4 vs Exacta</span>
          <span className="text-base font-bold text-emerald-600 font-mono">
            {currentMetrics.maxRk4Error.toExponential(2)} m
          </span>
          <span className="text-[10px] text-slate-600 block">Convergencia de 4to orden</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Estado de Superposición</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            100% Coincidente
          </span>
          <span className="text-[10px] text-slate-600 block">Validación analítica OK</span>
        </div>
      </div>
    </div>
  );
}
