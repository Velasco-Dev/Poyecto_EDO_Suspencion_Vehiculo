import React from 'react';
import {
  Activity, BarChart3, BookOpen, Presentation,
  Award, Download, Calculator, BookCheck
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenFlashcards }) {
  const tabs = [
    { id: 'deck', label: 'Exposición', icon: Presentation, color: 'text-amber-500' },
    { id: 'simulator', label: 'Laboratorio', icon: Activity, color: 'text-blue-600' },
    // { id: 'chart', label: 'RK4', icon: BarChart3, color: 'text-sky-500' },
    // { id: 'math', label: 'Deducción', icon: BookOpen, color: 'text-purple-500' },
    // { id: 'calculator', label: 'Calculadora', icon: Calculator, color: 'text-emerald-500' },
    // { id: 'comparison', label: 'Clase vs Web', icon: BookCheck, color: 'text-indigo-600' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-[0_6px_24px_-16px_rgba(11,60,115,0.18)] backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-3 xl:flex-row">

        {/* Identidad Institucional */}
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start xl:shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src="./logotipo-actual.webp"
                alt="Unimayor Logo"
                className="w-10 h-10 object-contain drop-shadow-sm rounded-xl bg-white p-1 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-[.18em] text-[#0B3C73] uppercase sm:text-xs">
                  UNIMAYOR · GRUPO 5
                </span>
                <span className="rounded-full border border-blue-200/80 bg-blue-50/90 px-2.5 py-0.5 text-[10px] font-extrabold text-[#0B3C73] shadow-2xs">
                  EDO U3
                </span>
              </div>
              <h1 className="text-sm font-black leading-tight tracking-tight text-slate-950 sm:text-base">
                Simulador de Suspensión Vehicular
              </h1>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onOpenFlashcards}
              className="liquid-glass-button-gold px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav aria-label="Navegación principal" className="flex w-full min-w-0 items-center justify-start gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-100/90 p-1.5 text-xs xl:flex-1 xl:justify-center backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 border border-slate-300/80 shadow-xs ring-1 ring-black/5 -translate-y-0.5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Acciones Rápidas */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            onClick={onOpenFlashcards}
            className="liquid-glass-button-gold whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 !text-slate-950 font-black shadow-xs hover:shadow-md transition-all active:scale-95"
            title="Abrir flashcards de preparación"
          >
            <Award className="w-3.5 h-3.5 text-slate-950" />
            <span>Flashcards 5.0</span>
          </button>

          <a
            href="./suspension_sim.py"
            download="suspension_sim.py"
            className="liquid-glass-button whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95"
            title="Descargar script Python"
          >
            <Download className="w-3.5 h-3.5 text-[#0B3C73]" />
            <span>Script Python</span>
          </a>
        </div>

      </div>
    </header>
  );
}
