import React from 'react';
import {
  Activity, BarChart3, BookOpen, Presentation,
  Award, Download, Calculator
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenFlashcards }) {
  const tabs = [
    { id: 'simulator', label: 'Laboratorio', icon: Activity, color: 'text-blue-600' },
    { id: 'chart', label: 'RK4', icon: BarChart3, color: 'text-sky-500' },
    { id: 'math', label: 'Deducción', icon: BookOpen, color: 'text-purple-500' },
    { id: 'calculator', label: 'Calculadora', icon: Calculator, color: 'text-emerald-500' },
    { id: 'deck', label: 'Exposición', icon: Presentation, color: 'text-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 px-3 py-3 shadow-[0_5px_22px_-18px_rgba(15,23,42,.55)] backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-3 xl:flex-row">

        {/* Identidad Institucional */}
        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start xl:shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="./logotipo-actual.webp"
              alt="Unimayor Logo"
              className="w-10 h-10 object-contain drop-shadow-sm rounded-lg bg-white p-0.5 border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-[.16em] text-blue-800 uppercase sm:text-xs">
                  UNIMAYOR · GRUPO 5
                </span>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
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
              className="liquid-glass-button-gold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav aria-label="Navegación principal" className="flex w-full min-w-0 items-center justify-start gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs xl:flex-1 xl:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-950 border border-slate-300 shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? tab.color : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Acciones Rápidas */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            onClick={onOpenFlashcards}
            className="liquid-glass-button-gold whitespace-nowrap px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 !text-slate-950"
            title="Abrir flashcards de preparación"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Flashcards 5.0</span>
          </button>

          <a
            href="./suspension_sim.py"
            download="suspension_sim.py"
            className="liquid-glass-button whitespace-nowrap px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-700 hover:text-slate-950"
            title="Descargar script Python"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Script Python</span>
          </a>
        </div>

      </div>
    </header>
  );
}
