import React, { useState, useEffect } from 'react';
import { 
  X, Code2, Copy, Check, Terminal, FileCode2, 
  Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2,
  ChevronRight, Laptop, Cpu
} from 'lucide-react';
import KaTeXMath from './KaTeXMath';
import { SLIDES_CODE_MAPPING } from '../data/slidesCodeData';

export default function CodeCalculationModal({ 
  isOpen, 
  onClose, 
  slideId, 
  m, 
  c, 
  k, 
  x0, 
  v0, 
  regimen, 
  settlingTime, 
  overshootPct 
}) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [codeLang, setCodeLang] = useState('js'); // 'js' | 'python'
  const [copied, setCopied] = useState(false);

  const slideData = SLIDES_CODE_MAPPING[slideId];

  // Cerrar con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Resetear selección de sub-ítem cuando cambia la diapositiva
  useEffect(() => {
    setActiveItemIndex(0);
    setCopied(false);
  }, [slideId, isOpen]);

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

  const handleCopyCode = () => {
    if (activeCodeObj?.snippet) {
      navigator.clipboard.writeText(activeCodeObj.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Contenedor Principal del Modal con Diseño Liquid Glass */}
      <div 
        className="liquid-glass bg-white/95 text-slate-900 border border-white/90 shadow-2xl rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glows de fondo institucionales */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#0B3C73]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#F5A800]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200/90 flex items-center justify-between gap-3 relative z-10 bg-gradient-to-r from-slate-50/90 to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0B3C73] text-white shadow-md">
              <Code2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0B3C73] border border-blue-200">
                  Diapositiva {slideId} · {slideData.speaker.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                  Mapeo Matemático a Código
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight mt-0.5">
                {slideData.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de Lenguaje (JS / Python) */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold border border-slate-300">
              <button
                onClick={() => setCodeLang('js')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  codeLang === 'js'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Ver implementación en JavaScript (React / Web)"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>JavaScript</span>
              </button>
              <button
                onClick={() => setCodeLang('python')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  codeLang === 'python'
                    ? 'bg-[#0B3C73] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Ver implementación en Python (NumPy / Script)"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Python</span>
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
          <div className="px-4 sm:px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2 overflow-x-auto relative z-10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Cálculo:
            </span>
            {slideData.items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItemIndex(idx);
                  setCopied(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 relative z-10 text-xs sm:text-sm">
          
          {/* 1. SECCIÓN: FÓRMULA MATEMÁTICA TEÓRICA */}
          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3C73] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                1. Deducción y Expresión Matemática Formal
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentItem.title}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-inner overflow-x-auto text-center my-2">
              <KaTeXMath math={currentItem.mathFormula} block={true} />
            </div>

            <p className="text-slate-700 font-medium leading-relaxed mt-2 text-xs sm:text-[13px]">
              {currentItem.explanation}
            </p>
          </div>

          {/* 2. SECCIÓN: MAPEO DE VARIABLES (MATEMÁTICA <-> CÓDIGO) */}
          <div className="bg-white/90 rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3C73] flex items-center gap-1.5 mb-2.5">
              <Layers className="w-4 h-4 text-blue-600" />
              2. Correspondencia de Variables y Parámetros
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {currentItem.variables.map((v, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#0B3C73] bg-blue-100/70 px-1.5 py-0.5 rounded">
                      <KaTeXMath math={v.symbol} block={false} />
                    </span>
                    <span className="font-mono text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {v.name}
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-1">
                    {typeof v.value === 'function' ? v.value(liveParams) : v.value}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 leading-tight">
                    {v.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. SECCIÓN: IMPLEMENTACIÓN EN CÓDIGO FUENTE (LÍNEAS EXACTAS) */}
          <div className="rounded-2xl border border-slate-800 bg-[#081528] text-slate-100 overflow-hidden shadow-lg">
            {/* Header del bloque de código */}
            <div className="px-4 py-2.5 bg-[#050D1A] border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="font-mono font-bold text-amber-300">
                  {activeCodeObj.file}
                </span>
                <span className="text-slate-400 text-[11px] font-mono hidden sm:inline">
                  • {activeCodeObj.lines}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer border border-slate-700"
                title="Copiar snippet de código al portapapeles"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Código formateado con sintaxis visual */}
            <div className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-emerald-300">
              <pre className="m-0 whitespace-pre">
                <code>{activeCodeObj.snippet}</code>
              </pre>
            </div>
          </div>

          {/* 4. SECCIÓN: EVALUACIÓN PASO A PASO EN TIEMPO REAL CON LOS VALORES ACTUALES */}
          {currentItem.liveEvaluation && (
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-300/80 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  4. Evaluación Aritmética Paso a Paso con Parámetros Actuales
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                  m={liveParams.m}kg · k={liveParams.k}N/m · c={liveParams.c}N·s/m
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentItem.liveEvaluation(liveParams).map((step, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 mb-1">
                      {step.label}:
                    </span>
                    <div className="my-1 overflow-x-auto py-1">
                      <KaTeXMath math={step.formula} block={false} />
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Resultado:</span>
                      <span className="font-mono font-extrabold text-[#0B3C73] text-xs">
                        {step.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal: Navegación Rápida y Teclas */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 relative z-10">
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
              Entendido
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
