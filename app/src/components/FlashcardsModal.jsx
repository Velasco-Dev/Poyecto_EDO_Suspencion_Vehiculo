import React, { useState } from 'react';
import { 
  UserCheck, Clock, BookOpen, Code, HelpCircle, 
  Printer, CheckCircle2, Award, ShieldAlert, X,
  PenTool, Volume2, Info, Sparkles
} from 'lucide-react';
import { TEAM_MEMBERS_FLASHCARDS } from '../data/flashcardsData';
import KaTeXMath from './KaTeXMath';

/**
 * Renderizador de texto enriquecido que detecta expresiones LaTeX delimitadas por $...$
 * y las convierte en componentes matemáticos KaTeX inline reales.
 */
function FormattedMathText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((part, idx) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const math = part.slice(1, -1);
          return (
            <span key={idx} className="inline-block mx-1 font-semibold text-[#0B3C73]">
              <KaTeXMath math={math} block={false} />
            </span>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}

export default function FlashcardsModal({ isOpen, onClose }) {
  const [activeMemberId, setActiveMemberId] = useState('angela');
  const [showSymbolGuide, setShowSymbolGuide] = useState(false);

  if (!isOpen) return null;

  const currentMember = TEAM_MEMBERS_FLASHCARDS.find((m) => m.id === activeMemberId) || TEAM_MEMBERS_FLASHCARDS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_25px_70px_-15px_rgba(11,60,115,0.22)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glows ambientales sutiles con colores institucionales */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#0B3C73]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#F5A800]/15 blur-3xl" />

        {/* Cabecera del Modal (Luminous Glass Header) */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/90 bg-white/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-600 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-950">
                  Flashcards de Defensa Individual
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Meta: 5.0 · Grupo 5
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Fórmulas en LaTeX, guía paso a paso para el tablero, guion verbal exacto y preguntas trampa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSymbolGuide(!showSymbolGuide)}
              className="liquid-glass-button px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-semibold"
              title="Ver guía de símbolos y pronunciación"
            >
              <Info className="w-4 h-4 text-[#0B3C73]" />
              <span className="hidden sm:inline">Guía de Símbolos</span>
            </button>
            <button
              onClick={handlePrint}
              className="liquid-glass-button-gold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-950 font-bold"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guía Rápida de Símbolos Griegos y Matemáticos (Desplegable) */}
        {showSymbolGuide && (
          <div className="relative z-10 bg-blue-50/95 p-4 border-b border-blue-200 text-xs space-y-2 shrink-0">
            <div className="flex items-center justify-between text-[#0B3C73] font-bold">
              <span className="flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-amber-600" />
                Guía Rápida: Cómo dibujar y nombrar los símbolos matemáticos en el tablero
              </span>
              <button 
                onClick={() => setShowSymbolGuide(false)}
                className="text-slate-500 hover:text-slate-950 font-bold cursor-pointer"
              >
                Cerrar guía &times;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-slate-800">
              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-[#0B3C73] font-bold flex items-center justify-between">
                  <span>ωₙ (omega sub n)</span>
                  <KaTeXMath math="\omega_n" block={false} />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Frecuencia natural:</strong> dibuja una "w" redondeada con subíndice n.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-[#0B3C73] font-bold flex items-center justify-between">
                  <span>ζ (zeta)</span>
                  <KaTeXMath math="\zeta" block={false} />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Factor amortiguamiento:</strong> trazo curvo en "s" con colita inferior (ζ = c / c_cr).
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-[#0B3C73] font-bold flex items-center justify-between">
                  <span>c_cr (c crítico)</span>
                  <KaTeXMath math="c_{cr}" block={false} />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>Amortiguamiento crítico:</strong> valor frontera donde cesan las oscilaciones (6000 N·s/m).
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-[#0B3C73] font-bold flex items-center justify-between">
                  <span>t_s y M_p</span>
                  <KaTeXMath math="t_s,\, M_p" block={false} />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  <strong>t_s:</strong> tiempo asentamiento 2% | <strong>M_p:</strong> porcentaje sobreimpulso.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selector de Integrantes con Estilo de Pestañas Claras y Nombres Completos */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/90 overflow-x-auto shrink-0">
          {TEAM_MEMBERS_FLASHCARDS.map((member) => (
            <button
              key={member.id}
              onClick={() => setActiveMemberId(member.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMemberId === member.id
                  ? 'bg-[#0B3C73] text-white shadow-md border border-blue-800'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <UserCheck className={`w-4 h-4 shrink-0 ${activeMemberId === member.id ? 'text-[#F5A800]' : 'text-slate-400'}`} />
              <span>{member.shortName || member.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                activeMemberId === member.id ? 'bg-white/20 text-amber-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {member.timeSlot.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido de la Tarjeta del Estudiante */}
        <div className="relative z-10 p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          
          {/* Banner de Identificación y Rol */}
          <div className="liquid-glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#0B3C73] font-extrabold block">
                {currentMember.role}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 mt-0.5">
                {currentMember.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-300 font-mono text-xs text-amber-900 font-bold shadow-2xs">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Tiempo Asignado: {currentMember.timeSlot}</span>
            </div>
          </div>

          {/* 1. Temas Asignados */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B3C73] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Temas que debes dominar en tu turno
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentMember.topics.map((topic, i) => (
                <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200/90 flex items-start gap-2.5 text-xs font-medium text-slate-800 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <FormattedMathText text={topic} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Guion Textual Recomendado (Renderizado con LaTeX Inline Real) */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Guion Textual Recomendado (Léelo con seguridad y lenguaje técnico de ingeniería)
            </h4>
            <div className="bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200/90 space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal shadow-xs">
              {currentMember.script.map((paragraph, i) => (
                <p key={i} className="pl-3.5 border-l-3 border-[#F5A800]">
                  <FormattedMathText text={paragraph} />
                </p>
              ))}
            </div>
          </div>

          {/* 3. Fórmulas Clave Renderizadas con KaTeX + Guía para el Tablero */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B3C73] flex items-center gap-1.5">
                <Code className="w-4 h-4 text-blue-600" />
                Fórmulas Matemáticas que debes saber escribir y explicar en el tablero
              </h4>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-amber-600" />
                Incluye simbología y pronunciación
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentMember.formulas.map((f, i) => (
                <div key={i} className="liquid-glass-card p-4 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-xs font-extrabold text-[#0B3C73] block mb-1">
                      {f.label}:
                    </span>
                    {/* Render KaTeX Real en Fondo Claro de Alto Contraste */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-slate-900 overflow-x-auto shadow-inner">
                      <KaTeXMath math={f.latex} block={true} />
                    </div>
                  </div>

                  {/* Guía para escribirlo en el Tablero */}
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/90 text-xs space-y-1">
                    <div className="flex items-start gap-1.5 text-amber-900 font-bold text-[11px]">
                      <PenTool className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span>Cómo escribirlo en el tablero:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed pl-5 font-medium">
                      {f.whiteboardGuide}
                    </p>
                  </div>

                  {/* Guía de Pronunciación Verbal */}
                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 text-xs">
                    <div className="flex items-start gap-1.5 text-[#0B3C73] text-[11px]">
                      <Volume2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-600" />
                      <span className="italic text-slate-700 font-medium">{f.pronunciation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Referencias Exactas al Código */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-600" />
              Líneas de Código que debes explicar si la docente pregunta
            </h4>
            <div className="space-y-2.5">
              {currentMember.codeReferences.map((ref, i) => (
                <div key={i} className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-900">{ref.file}</span>
                    <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded font-mono font-semibold border border-emerald-200">
                      {ref.lines}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1 leading-relaxed">
                    {ref.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Preguntas Trampa del Docente y Cómo Responderlas */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Preguntas Trampa Típicas de la Docente y Cómo Responder con Solvencia
            </h4>
            <div className="space-y-2.5">
              {currentMember.trapQuestions.map((t, i) => (
                <div key={i} className="bg-rose-50/40 p-4 rounded-xl border border-rose-200 space-y-2 shadow-2xs">
                  <div className="flex items-start gap-2 text-xs font-bold text-rose-900">
                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>Pregunta: "{t.question}"</span>
                  </div>
                  <div className="pl-6 text-xs text-slate-700 border-l-2 border-emerald-500 font-normal leading-relaxed">
                    <strong className="text-emerald-800 font-bold block mb-0.5">Cómo debes responder:</strong>
                    <FormattedMathText text={t.answer} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pie de Página del Modal */}
        <div className="relative z-10 p-4 border-t border-slate-200/90 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium shrink-0">
          <span>Institución Universitaria Colegio Mayor del Cauca · EDO 2026</span>
          <button
            onClick={onClose}
            className="liquid-glass-button-gold px-4 py-2 rounded-xl text-xs font-bold text-slate-950 cursor-pointer shadow-xs"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
}
