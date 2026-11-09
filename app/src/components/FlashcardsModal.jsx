import React, { useState } from 'react';
import { 
  UserCheck, Clock, BookOpen, Code, HelpCircle, 
  Printer, CheckCircle2, Award, ShieldAlert, X,
  PenTool, Volume2, Info
} from 'lucide-react';
import { TEAM_MEMBERS_FLASHCARDS } from '../data/flashcardsData';
import KaTeXMath from './KaTeXMath';

export default function FlashcardsModal({ isOpen, onClose }) {
  const [activeMemberId, setActiveMemberId] = useState('angela');
  const [showSymbolGuide, setShowSymbolGuide] = useState(false);

  if (!isOpen) return null;

  const currentMember = TEAM_MEMBERS_FLASHCARDS.find((m) => m.id === activeMemberId) || TEAM_MEMBERS_FLASHCARDS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Flashcards de Defensa Individual (Meta: 5.0)
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Grupo 5
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Fórmulas renderizadas matemáticamente, guía para el tablero, guion verbal y preguntas trampa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSymbolGuide(!showSymbolGuide)}
              className="liquid-glass-button px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-gray-200 hover:text-white"
              title="Ver guía de símbolos y pronunciación"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Guía de Símbolos</span>
            </button>
            <button
              onClick={handlePrint}
              className="liquid-glass-button px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-gray-200 hover:text-white"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Imprimir PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guía Rápida de Símbolos Griegos y Matemáticos (Desplegable) */}
        {showSymbolGuide && (
          <div className="bg-slate-950/95 p-4 border-b border-cyan-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-cyan-400" />
                Guía Rápida: Cómo dibujar y nombrar los símbolos en el tablero
              </span>
              <button 
                onClick={() => setShowSymbolGuide(false)}
                className="text-gray-400 hover:text-white"
              >
                Cerrar guía &times;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-gray-300">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-white/10">
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>ωₙ (omega sub n)</span>
                  <KaTeXMath math="\omega_n" block={false} />
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  <strong>Frecuencia natural:</strong> se dibuja como una "w" redondeada con subíndice n.
                </p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-white/10">
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>ζ (zeta)</span>
                  <KaTeXMath math="\zeta" block={false} />
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  <strong>Factor amortiguamiento:</strong> trazo curvo en "s" con colita inferior (ζ = c / c_cr).
                </p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-white/10">
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>c_cr (c crítico)</span>
                  <KaTeXMath math="c_{cr}" block={false} />
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  <strong>Amortiguamiento crítico:</strong> valor frontera donde el sistema deja de oscilar.
                </p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-white/10">
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>t_s y M_p</span>
                  <KaTeXMath math="t_s,\, M_p" block={false} />
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  <strong>t_s:</strong> tiempo asentamiento al 2% | <strong>M_p:</strong> porcentaje sobreimpulso.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selector de Integrantes */}
        <div className="flex items-center gap-2 p-3 bg-slate-950/50 border-b border-white/10 overflow-x-auto">
          {TEAM_MEMBERS_FLASHCARDS.map((member) => (
            <button
              key={member.id}
              onClick={() => setActiveMemberId(member.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeMemberId === member.id
                  ? 'bg-[#0B3C73] text-white border border-[#F5A800] shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeMemberId === member.id ? 'text-[#F5A800]' : 'text-gray-400'}`} />
              <span>{member.name.split(' ')[0]} {member.name.split(' ')[2] || ''}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300 font-mono">
                {member.timeSlot.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido de la Tarjeta del Estudiante */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-gray-200 text-sm">
          {/* Banner de Identificación y Rol */}
          <div className="liquid-glass-card p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                {currentMember.role}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {currentMember.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-amber-500/30 font-mono text-xs text-amber-300">
              <Clock className="w-4 h-4" />
              <span>Tiempo Asignado: {currentMember.timeSlot}</span>
            </div>
          </div>

          {/* 1. Temas Asignados */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Temas que debes dominar en tu turno
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentMember.topics.map((topic, i) => (
                <div key={i} className="bg-slate-950/60 p-3 rounded-lg border border-white/5 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Guion Textual */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Guion Textual Recomendado (Léelo con seguridad y lenguaje técnico)
            </h4>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
              {currentMember.script.map((paragraph, i) => (
                <p key={i} className="pl-3 border-l-2 border-amber-500/50">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 3. Fórmulas Clave Renderizadas con KaTeX + Guía para el Tablero */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                Fórmulas Matemáticas que debes saber escribir y explicar en el tablero
              </h4>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                Incluye simbología y pronunciación
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentMember.formulas.map((f, i) => (
                <div key={i} className="liquid-glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between gap-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 block mb-1">
                      {f.label}:
                    </span>
                    {/* Render KaTeX Real */}
                    <div className="bg-slate-950/90 p-3 rounded-lg border border-white/10 text-center text-white overflow-x-auto shadow-inner">
                      <KaTeXMath math={f.latex} block={true} />
                    </div>
                  </div>

                  {/* Guía para escribirlo en el Tablero */}
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-amber-500/20 text-xs space-y-1">
                    <div className="flex items-start gap-1.5 text-amber-300 font-semibold text-[11px]">
                      <PenTool className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <span>Cómo escribirlo en el tablero:</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed pl-5">
                      {f.whiteboardGuide}
                    </p>
                  </div>

                  {/* Guía de Pronunciación Verbal */}
                  <div className="bg-slate-900/70 p-2 rounded-lg border border-cyan-500/20 text-xs">
                    <div className="flex items-start gap-1.5 text-cyan-300 text-[11px]">
                      <Volume2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                      <span className="italic text-gray-300">{f.pronunciation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Referencias Exactas al Código */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              Líneas de Código que debes explicar si la docente pregunta
            </h4>
            <div className="space-y-2">
              {currentMember.codeReferences.map((ref, i) => (
                <div key={i} className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-300">{ref.file}</span>
                    <span className="bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
                      {ref.lines}
                    </span>
                  </div>
                  <p className="text-gray-300 text-[11px] pt-1">
                    {ref.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Preguntas Trampa del Docente y Cómo Responderlas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Preguntas Trampa Típicas de la Docente y Cómo Responder con Solvencia
            </h4>
            <div className="space-y-2.5">
              {currentMember.trapQuestions.map((t, i) => (
                <div key={i} className="bg-slate-950/90 p-4 rounded-xl border border-rose-500/20 space-y-2">
                  <div className="flex items-start gap-2 text-xs font-semibold text-rose-300">
                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>Pregunta: "{t.question}"</span>
                  </div>
                  <div className="pl-6 text-xs text-gray-300 border-l border-white/10">
                    <strong className="text-emerald-400 block mb-0.5">Cómo debes responder:</strong>
                    {t.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pie de Página del Modal */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <span>Institución Universitaria Colegio Mayor del Cauca · EDO 2026</span>
          <button
            onClick={onClose}
            className="liquid-glass-button-gold px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
}
